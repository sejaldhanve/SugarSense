import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

if (!API_KEY) {
  console.warn('Gemini API key not found. AI features will use mock responses.')
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null

// Health chatbot prompt - conversational and friendly
const HEALTH_CHATBOT_PROMPT = `
You are a friendly, empathetic health chatbot. Your role is to:
- Have natural, conversational responses (no bullet points, no asterisks, no markdown formatting)
- Ask follow-up questions to understand the user's situation better
- Provide practical health advice based on real medical knowledge
- Be supportive and understanding
- Keep responses concise (2-4 sentences usually)
- If someone greets you, respond warmly and ask how they're feeling

IMPORTANT RULES:
- Never use asterisks (*) or bullet points in your responses
- Write in a natural, conversational tone like a caring friend who knows about health
- Don't give overly long medical explanations unless asked
- Always suggest consulting a doctor for serious symptoms
- For diabetes patients, be mindful of blood sugar management
`

// Chatpata AI prompt - recipe generator for diabetics
const CHATPATA_RECIPE_PROMPT = `
You are Chatpata AI, a creative Indian recipe generator specialized for diabetic patients.

When a user gives you ingredients, create a delicious, diabetes-friendly recipe that:
- Uses LOW glycemic index cooking methods
- Keeps carbs controlled
- Is practical and tasty
- Includes Indian spices and flavors when possible

Format your response naturally without asterisks or bullet points. Structure it as:
1. Recipe name (creative Indian-style name)
2. A brief description of why it's good for diabetics
3. Ingredients needed (use what they have, suggest minimal additions)
4. Simple step-by-step cooking instructions
5. Nutritional tip at the end

Keep it conversational and encouraging. Make the person excited to cook!
`

export class GeminiAI {
  private model: any

  constructor() {
    if (genAI) {
      this.model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    }
  }

  // Health Chatbot - conversational health queries
  async healthChat(userMessage: string): Promise<string> {
    if (!this.model) {
      return this.getMockHealthResponse(userMessage)
    }

    try {
      const prompt = `${HEALTH_CHATBOT_PROMPT}

User says: "${userMessage}"

Respond naturally and conversationally:`

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return this.cleanResponse(response.text())
    } catch (error) {
      console.error('Health Chat Error:', error)
      return this.getMockHealthResponse(userMessage)
    }
  }

  // Chatpata AI - Recipe generator from ingredients
  async generateRecipe(ingredients: string, userProfile: any = {}): Promise<string> {
    if (!this.model) {
      return this.getMockRecipeResponse(ingredients)
    }

    try {
      const prompt = `${CHATPATA_RECIPE_PROMPT}

Patient Info:
- Diabetes Type: ${userProfile.diabetesType || 'Type 2'}
- Dietary Restrictions: ${userProfile.dietaryRestrictions || 'None'}

The user has these ingredients available: ${ingredients}

Create a delicious, diabetes-friendly recipe they can make:`

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return this.cleanResponse(response.text())
    } catch (error) {
      console.error('Recipe Generation Error:', error)
      return this.getMockRecipeResponse(ingredients)
    }
  }

  // Clean response - remove markdown formatting
  private cleanResponse(text: string): string {
    return text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#{1,6}\s/g, '')
      .replace(/`/g, '')
      .trim()
  }

  private getMockHealthResponse(message: string): string {
    const lowerMsg = message.toLowerCase()
    
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
      return "Hello! It's great to hear from you. How are you feeling today? Is there anything specific about your health you'd like to talk about?"
    }
    if (lowerMsg.includes('headache')) {
      return "I'm sorry you're dealing with a headache. Have you been drinking enough water today? Sometimes dehydration can cause headaches. Also, when did it start and how would you describe the pain?"
    }
    if (lowerMsg.includes('tired') || lowerMsg.includes('fatigue')) {
      return "Feeling tired can have many causes. How's your sleep been lately? For diabetics, fatigue can sometimes be related to blood sugar levels. Have you checked your glucose recently?"
    }
    if (lowerMsg.includes('sugar') || lowerMsg.includes('glucose')) {
      return "Blood sugar management is so important. What were your recent readings? I can help you understand what might be affecting your levels and suggest some adjustments."
    }
    
    return "I understand. Tell me more about what you're experiencing, and I'll do my best to help. Remember, for any serious symptoms, it's always best to consult with your doctor."
  }

  private getMockRecipeResponse(ingredients: string): string {
    return `Great ingredients! Here's what you can make:

Diabetic-Friendly Masala Veggie Bowl

This dish is perfect for you because it's low in carbs and the spices help with blood sugar control.

Using your ${ingredients}, here's how to make it:

Heat a little oil in a pan. Add cumin seeds and let them splutter. Add your vegetables and sauté for 5-7 minutes. Add turmeric, a pinch of red chili, and salt. Cook until vegetables are tender but still have a nice bite.

Serve it warm with a small portion of roti or enjoy it on its own.

Tip: The fiber from the vegetables will help slow down any blood sugar spike. Enjoy your meal!`
  }

  async generateDietRecommendation(userProfile: any, query: string): Promise<string> {
    if (!this.model) {
      return this.getMockDietResponse(query)
    }

    try {
      const prompt = `You are a helpful nutrition advisor for diabetics. Respond conversationally without using asterisks or bullet points.
      
User Profile:
- Diabetes Type: ${userProfile.diabetesType || 'Type 2'}
- HbA1c: ${userProfile.hba1c || 'Not specified'}%
- Dietary Restrictions: ${userProfile.dietaryRestrictions || 'None specified'}

Question: ${query}

Give a helpful, conversational response:`

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return this.cleanResponse(response.text())
    } catch (error) {
      console.error('Gemini AI Error:', error)
      return this.getMockDietResponse(query)
    }
  }

  async generateMealPlan(userProfile: any): Promise<any> {
    if (!this.model) {
      return this.getMockMealPlan()
    }

    try {
      const prompt = `Create a simple 7-day meal plan for a diabetic patient. Return as JSON.
      
Profile:
- Diabetes Type: ${userProfile.diabetesType || 'Type 2'}
- Cuisine: ${userProfile.cuisinePreferences || 'Indian'}

Format: JSON object with days containing breakfast, lunch, dinner, snacks with name, calories, carbs, gi values.`

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      
      try {
        return JSON.parse(response.text())
      } catch {
        return this.getMockMealPlan()
      }
    } catch (error) {
      console.error('Gemini AI Error:', error)
      return this.getMockMealPlan()
    }
  }

  async analyzeFood(foodItem: string, userProfile: any): Promise<string> {
    if (!this.model) {
      return this.getMockFoodAnalysis(foodItem)
    }

    try {
      const prompt = `Analyze this food for a diabetic patient: "${foodItem}"

Respond conversationally without asterisks or bullet points. Include:
- Can they eat it (yes/no/moderation)
- Portion recommendation
- Best time to eat it
- A healthier alternative if needed

Keep it brief and friendly.`

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return this.cleanResponse(response.text())
    } catch (error) {
      console.error('Gemini AI Error:', error)
      return this.getMockFoodAnalysis(foodItem)
    }
  }

  private getMockDietResponse(query: string): string {
    const responses: Record<string, string> = {
      'rice': 'Brown rice is a better choice than white rice for managing blood sugar. Try to limit portions to about half a cup cooked, and always pair it with protein and vegetables to slow down glucose absorption.',
      'sugar': 'Regular sugar causes rapid blood sugar spikes. If you need something sweet, try stevia or small amounts of jaggery. Always check your glucose about 2 hours after eating anything sweet.',
      'fruit': 'Most fruits are fine in moderation! Berries, apples, and citrus fruits are great choices with lower glycemic impact. Stick to one medium fruit per serving and avoid fruit juices.',
      'default': 'For managing diabetes through diet, focus on whole foods, plenty of vegetables, lean proteins, and controlled portions of carbs. Timing your meals consistently also helps a lot.'
    }

    const lowerQuery = query.toLowerCase()
    for (const [key, response] of Object.entries(responses)) {
      if (lowerQuery.includes(key)) {
        return response
      }
    }
    return responses.default
  }

  private getMockFoodAnalysis(foodItem: string): string {
    return `About "${foodItem}": You can enjoy this in moderation. I'd suggest a small portion, about half a cup or a palm-sized amount. The best time to have it would be with your main meals rather than as a standalone snack. Pairing it with some protein or fiber will help keep your blood sugar more stable. Always good to check your glucose response to new foods!`
  }

  private getMockMealPlan(): any {
    return {
      monday: {
        breakfast: { name: 'Oats with Berries', calories: 320, carbs: 45, gi: 42 },
        lunch: { name: 'Quinoa Salad with Chickpeas', calories: 450, carbs: 55, gi: 35 },
        dinner: { name: 'Grilled Fish with Vegetables', calories: 380, carbs: 25, gi: 30 },
        snacks: [
          { name: 'Apple with Almonds', calories: 180, carbs: 20, gi: 38 },
          { name: 'Greek Yogurt', calories: 120, carbs: 12, gi: 11 }
        ]
      }
    }
  }
}

export const geminiAI = new GeminiAI()