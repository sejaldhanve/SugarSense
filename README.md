# 🩺 SugarSense — AI-Powered Diabetes Assistant

SugarSense is an intelligent diabetes management platform that helps users track sugar, receive personalized health suggestions, explore diabetic-safe foods, set medication reminders, and get critical SMS alerts — all in one seamless experience.

Built using **React + TypeScript**, **Firebase**, **Firestore**, **Cloud Functions**, and **SMS Gateway APIs**.

---

## 🌟 Highlights

- **Smart Diabetes Dashboard** – Shows sugar trends, daily tasks, and actionable insights in one place.
- **AI Personalized Coaching** – Provides helpful lifestyle and diet suggestions based on user inputs:
  - “Walk 10 mins”
  - “Avoid high-carb breakfast”
  - “Your sugar may spike after this meal.”
- **Chatpata AI Food Assistant** – Suggests diabetic-friendly recipes, healthy Indian food swaps, and carb estimates, plus a curated diabetic-safe product store.
- **Medicine & Routine SMS Reminders** – Users can add medicines with timings and receive automated SMS reminders.
- **Critical Sugar Alerts** – When sugar crosses a dangerous level, SugarSense instantly sends an **SMS alert** to the user or caregiver.
- **All-in-One Diabetes Platform** – Includes:
  - Sugar logging  
  - AI chat  
  - Recipes  
  - Medicine reminders  
  - Critical alerts  
  - Daily health plan  
  - Emergency helpline  
  - Diabetic store  
  - Reports & analytics  
  Everything needed for diabetes care — in one unified platform.

---

## 🏗️ Tech Stack

| Category | Technologies |
|---------|--------------|
| Frontend | React, TypeScript, Tailwind, Framer Motion |
| Backend | Firebase Cloud Functions, Express |
| Database | Firebase Firestore |
| Authentication | Firebase Auth |
| Alerts | SMS Gateway API (reminders & high-sugar alerts) |
| Hosting | Firebase Hosting |

---

## 🧬 Architecture Overview

```plaintext
User (React App)
      |
      v
Firebase Auth  → ensures only verified users can access features
      |
      v
Health / Chat / Reminder requests
      |
      v
Firebase Cloud Functions
  - verifies ID token
  - processes user data
  - sends SMS alerts/reminders
      |
      v
Frontend displays insights, alerts & recommendations
```

## ⚙️ Project Setup

### 1️⃣ Clone project
```bash
git clone <your-repo-url>
cd SugarSense
```
### 2️⃣ Install dependencies
```bash
npm install
```
### 3️⃣ Run frontend (development)
```bash
npm run dev
```
