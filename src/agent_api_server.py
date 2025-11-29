# agent_api_server.py (Complete and Unified Code)

from flask import Flask, request, jsonify
from flask_cors import CORS 
from dotenv import load_dotenv 
from google import genai
from google.genai import types
from datetime import datetime, timedelta # Added timedelta for simple date arithmetic
from apscheduler.schedulers.background import BackgroundScheduler # New Import
import requests
import os

# 1. Load environment variables from the .env file
load_dotenv() 

app = Flask(__name__)
# Allow cross-origin requests from the front-end dev server (and others) for all /api routes
CORS(
    app,
    resources={r"/api/*": {"origins": "*"}},
)

# --- Load Keys from Environment Variables ---
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY") 
SMS_GATEWAY_URL = os.environ.get("SMS_GATEWAY_URL")
SMS_API_KEY = os.environ.get("SMS_API_KEY")

# Check for essential keys before proceeding
if not GEMINI_API_KEY or not SMS_GATEWAY_URL or not SMS_API_KEY:
    raise EnvironmentError("Critical API keys not found. Check your .env file.")

# --- Initialize Gemini Client & Tool ---
client = genai.Client(api_key=GEMINI_API_KEY)

# Tool declaration 
alert_tool = types.Tool(
    function_declarations=[
        types.FunctionDeclaration(
            name="send_alert",
            description="Sends a critical, personalized health alert via SMS.",
            parameters=types.Schema(
                type=types.Type.OBJECT,
                properties={
                    "recipient_number": types.Schema(type=types.Type.STRING, description="The user's mobile number."),
                    "message_body": types.Schema(type=types.Type.STRING, description="The personalized action message.")
                },
                required=["recipient_number", "message_body"],
            ),
        )
    ]
)

# --- GLOBAL SCHEDULER SETUP (NEW) ---
scheduler = BackgroundScheduler()
scheduler.start() 
# ------------------------------------

# --- Helper Function: send_alert (Used by both instant alerts and the scheduler) ---
def send_alert(recipient_number: str, message_body: str) -> str:
    """Sends a personalized alert message via the SmsMobile API CLOUD gateway."""
    try:
        payload = {
            'apikey': SMS_API_KEY,      
            'recipients': recipient_number, 
            'message': message_body,  
        }

        response = requests.post(SMS_GATEWAY_URL, data=payload)
        response.raise_for_status() 
        return f"SMS Success! Status: {response.status_code}. Response: {response.text[:50]}..."
        
    except requests.exceptions.RequestException as e:
        # NOTE: If this fails from the scheduler, you need a robust logging mechanism here.
        return f"SMS API Error: {e}"

# ------------------------------------------------------------------------------------------------------
## 🛑 EXISTING ENDPOINT: INSTANT SUGAR CHECK (/api/check_sugar_alert)
# ------------------------------------------------------------------------------------------------------

@app.route('/api/check_sugar_alert', methods=['POST', 'OPTIONS'])
def check_sugar_alert_endpoint():
    try:
        data = request.json
        
        current_sugar = data.get('current_sugar')
        user_phone = data.get('recipient_number')
        user_target_max = data.get('user_target_max')
        time_since_meal = data.get('time_since_meal', "Data not integrated")
        last_meal_carbs = data.get('last_meal_carbs', "Data not integrated")
        recent_activity = data.get('recent_activity', "Data not integrated")
        
        # Validate critical inputs
        if not current_sugar or not user_phone:
            return jsonify({'error': 'Missing required fields (current_sugar or recipient_number).'}), 400

        # --- RUN GEMINI AGENT LOGIC (Unchanged) ---
        
        system_instruction = (
            "You are an expert AI Health Coach focused on diabetic patient safety. "
            "Target max sugar is 140 mg/dL. You MUST call the 'send_alert' function "
            "with a concrete action plan if the sugar is above 180 mg/dL. "
            "Otherwise, reply with 'No alert needed.'"
        )

        user_prompt = f"""
        New sugar reading logged. Analyze and decide if an alert is needed.
        - Current Sugar Level: {current_sugar} mg/dL
        - User Target Max: {user_target_max} mg/dL
        - Time Since Last Meal: {time_since_meal}
        - Last Meal Carbs: {last_meal_carbs}
        - Recent Activity: {recent_activity}
        The recipient number is {user_phone}.
        """
        
        config_settings = types.GenerateContentConfig(tools=[alert_tool], system_instruction=system_instruction)
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=user_prompt,
            config=config_settings,
        )

        alert_triggered = False
        execution_status = "No alert needed."

        if response.function_calls:
            alert_triggered = True
            for function_call in response.function_calls:
                if function_call.name == "send_alert":
                    args = dict(function_call.args)
                    execution_status = send_alert(
                        recipient_number=args.get("recipient_number"),
                        message_body=args.get("message_body")
                    )
        else:
            execution_status = response.text

        # Simplified success response for the client
        return jsonify({
            'status': 'Agent check complete',
            'sugar_level': current_sugar,
            'alert_triggered': alert_triggered,
            'message': execution_status
        }), 200

    except Exception as e:
        # Catch unexpected errors during processing
        return jsonify({'error': f'Internal Server Error during Agent processing: {e}'}), 500

# ------------------------------------------------------------------------------------------------------
## ✅ NEW ENDPOINT: SCHEDULED MEDICATION REMINDER (/api/schedule_reminder)
# ------------------------------------------------------------------------------------------------------

@app.route('/api/schedule_reminder', methods=['POST', 'OPTIONS'])
def schedule_reminder_endpoint():
    try:
        data = request.json
        
        # 1. Gather all required data
        recipient_number = data.get('recipient_number')
        medication_name = data.get('medication_name')
        dosage = data.get('dosage')
        scheduled_time_str = data.get('scheduled_time') # Comes as HH:MM string from React

        if not recipient_number or not scheduled_time_str:
             return jsonify({'error': 'Missing required scheduling data.'}), 400

        # 2. Convert time string to future datetime object
        # Combine today's date with the user's time input (e.g., "2025-11-27 20:00")
        current_date_str = datetime.now().strftime("%Y-%m-%d")
        target_time_str = f"{current_date_str} {scheduled_time_str}"
        target_datetime = datetime.strptime(target_time_str, "%Y-%m-%d %H:%M")

        # If the scheduled time is already past, schedule it for the same time tomorrow
        if target_datetime < datetime.now():
            target_datetime = target_datetime + timedelta(days=1)

        # 3. Construct the reminder message
        reminder_message = (
            f"💊 MEDICATION REMINDER: It's time! Take {dosage} of "
            f"{medication_name} now. Stay consistent!"
        )

        # 4. Schedule the job using APScheduler
        scheduler.add_job(
            send_alert,              
            'date',                  
            run_date=target_datetime, 
            args=[recipient_number, reminder_message] 
        )

        print(f"\n--- ⏰ Medication Reminder Scheduled for {target_datetime.strftime('%Y-%m-%d %H:%M:%S')} ---")
        
        return jsonify({
            'status': 'Reminder scheduled successfully',
            'medication': medication_name,
            'scheduled_for': target_datetime.isoformat()
        }), 200

    except Exception as e:
        return jsonify({'error': f'Scheduling error: {e}'}), 500

# ------------------------------------------------------------------------------------------------------
## 🛠️ SERVER STARTUP
# ------------------------------------------------------------------------------------------------------

if __name__ == '__main__':
    # Run the server for local testing
    print(f"Starting Flask server. Using GEMINI_API_KEY: {'Loaded' if GEMINI_API_KEY else 'Failed'}")
    # Note: Debug=True enables the reloader, which sometimes causes the scheduler to double-run.
    # For production, set debug=False. For local testing, keep it True for convenience.
    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=False)