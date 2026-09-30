# AgriSphere — Intelligent Agriculture Assistant Platform

> **Tagline:** *"Smart Farming. Better Decisions."*

---

## 🌱 Overview

**AgriSphere** is a modern, full-stack, AI-powered agricultural decision-support platform designed to help farmers, agricultural extension workers, and students make intelligent farming choices. 

AgriSphere provides guidance on crop selection, disease diagnosis, pest management, soil nutrition, irrigation schedules, weather-related decisions, and market trends. It features **strict domain guardrails** to ensure all assistance remains 100% agriculture-focused, along with **multilingual support**, **voice input**, and **camera/image upload** capabilities for crop health evaluation.

---

## ✨ Key Features

- **🌾 Agriculture-Only AI Assistant**: Enforces strict domain guardrails. Non-agricultural questions (e.g. general coding, trivia) are politely redirected to maintain product focus.
- **📷 Camera & Image Upload**: Allows farmers to take photos or upload crop leaf images for plant health and disease analysis.
- **🎤 Multilingual Voice Input**: Speech-to-text integration using browser Speech Recognition across 8 supported Indian and global languages.
- **🌐 Multilingual Support**: 8 supported languages including English, Kannada (ಕನ್ನಡ), Hindi (हिंदी), Telugu (తెలుగు), Tamil (தமிழ்), Malayalam (മലയാളം), Marathi (मराठी), and Bengali (বাংলা).
- **📊 AgriSphere Dashboard**: Analytics overview of crop inquiries, disease cases, irrigation advice, soil nutrition, and category breakdown charts powered by Recharts.
- **🌾 Crop Catalog**: Interactive catalog covering 12 major crops (Rice, Wheat, Maize, Tomato, Potato, Onion, Coconut, Banana, Sugarcane, Pulses, Vegetables, Fruits) with ideal soil, climate, care tips, and common pest details.
- **📋 Consultation History**: Full audit trail of past farming questions and diagnoses with search, filtering, and detailed inspection modal drawers.
- **📚 Agriculture Knowledge Hub**: Guides covering Soil Preparation, Seed Selection, Sowing, Irrigation, Fertilizers, IPM Pest Control, Disease Control, and Organic Farming.
- **🔌 Offline Fallback Engine**: 100% functional without an external LLM API key or MongoDB server, guaranteeing zero-dependency demo reliability.
- **⚡ Single Render Web Service Architecture**: Frontend React production build and Express API served from ONE unified Web Service endpoint.

---

## 🏗️ Tech Stack & Architecture

### Frontend
- **Framework**: React.js 18 + Vite
- **Styling**: Tailwind CSS (Natural Forest & Earthy Cream Palette)
- **Routing**: React Router v6
- **Charts**: Recharts
- **Icons**: Lucide React
- **Voice Recognition**: Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`)

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB & Mongoose (with built-in Memory Store fallback)
- **Security & Utilities**: Express Rate Limit, CORS, Axios, Dotenv

### AI & Domain Services
- **Domain Guardrail Classifier**: Enforces agriculture-only query scope
- **LLM Integration**: OpenAI/Gemini Vision compatible API (`LLM_API_KEY`, `LLM_MODEL`, `LLM_BASE_URL`)
- **Offline Rule Fallback**: Rule-based agricultural decision engine

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status & database connectivity |
| `POST` | `/api/analyze` | Process farming text queries or image attachments |
| `GET` | `/api/history` | Retrieve consultation audit logs (supports filtering) |
| `GET` | `/api/history/:id` | Retrieve detailed consultation entry by ID |
| `GET` | `/api/dashboard` | Aggregated farming metrics & category counts |
| `POST` | `/api/feedback` | Submit helpfulness feedback (thumbs up/down) |

---

## 🏃 Running AgriSphere Locally

### 1. Concurrent Development Mode
```bash
npm run dev
```
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5001/api`

### 2. Single Web Service Production Preview Mode
```bash
npm run build
npm start
```
- **Unified Application**: `http://localhost:5001`

### 3. Automated Test Suite
```bash
npm run test:server
```

---

## 🚀 Render Deployment Settings

To deploy on Render as a Single Web Service:

- **Service Type**: Web Service
- **Environment**: Node
- **Root Directory**: `server`
- **Build Command**: `npm run build`
- **Start Command**: `npm start`

Express will automatically compile the React frontend into `client/dist`, serve static assets, handle SPA routes (`/dashboard`, `/crops`, `/consultations`, `/learn`), and process `/api/*` requests from a single URL!

---

## 📜 Disclaimer

AgriSphere provides automated agricultural guidance. For severe plant disease outbreaks or regulated chemical pesticide usage, consult your local agricultural extension officer or Krishi Vigyan Kendra (KVK).
