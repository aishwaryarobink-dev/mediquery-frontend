# 🧠 MediQuery – AI-Powered Medical Assistant (Frontend)

> ⚠️ This repository contains the **frontend application**.
> 🔗 Backend Repository: https://github.com/aishwaryarobink-dev/mediquery-backend

---

## 🚀 Live Demo

* 🌐 Frontend: https://mediquery-frontend.vercel.app
* ⚙️ Backend API: https://mediquery-backend-wb9o.onrender.com

---

## ✨ Features

* 💬 ChatGPT-like conversational UI
* ⚡ Real-time streaming responses (character-by-character typing effect)
* 🧠 AI-powered answers using Groq API
* 📚 Context-aware responses using a lightweight knowledge base
* 🎨 Clean, modern UI with animated typing & cursor
* 🔄 Continuous conversation flow
* 🌐 Fully deployed (Frontend + Backend)

---

## 🏗️ Architecture

MediQuery follows a decoupled full-stack architecture:

* **Frontend (this repo – React + Vite)**
  Handles UI, user interaction, and streaming response rendering

* **Backend (Flask API)**
  Processes requests, retrieves context, and streams responses

* **LLM (Groq API)**
  Generates AI-powered medical responses

The frontend communicates with the backend using REST APIs and Server-Sent Events (SSE).

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* SCSS
* Fetch API (Streaming)

### Backend

* Flask
* Groq API
* Flask-CORS

### Deployment

* ▲ Vercel (Frontend)
* Render (Backend)

---

## ⚙️ Environment Variables

Create a `.env` file:

```
VITE_API_URL=https://mediquery-backend-wb9o.onrender.com/api/chat
```

---

## ▶️ Running Locally (Frontend)

```
git clone https://github.com/aishwaryarobink-dev/mediquery-frontend.git
cd mediquery-frontend
npm install
npm run dev
```

---

## 🔗 Related Repository

👉 Backend API: https://github.com/aishwaryarobink-dev/mediquery-backend
---

## 🧠 How It Works

1. User sends a query
2. Frontend sends conversation history to backend
3. Backend retrieves relevant context and calls the Groq LLM
4. Response is streamed back using SSE
5. Frontend renders response with typing animation

---

## 🚀 Key Highlights

* ⚡ Built a real-time streaming chat system using Server-Sent Events (SSE)
* 🧠 Integrated LLM responses using Groq API
* 🔄 Implemented lightweight context retrieval
* 🎨 Designed a ChatGPT-like UI with typing animation and cursor
* 🌐 Deployed full-stack system (Vercel + Render)
* 🛠️ Handled CORS, API integration, and production debugging

---

## 🧩 What I Learned

* Building and debugging real-time streaming APIs
* Managing frontend-backend communication
* Handling async UI updates for better UX
* Deploying full-stack applications

---

## ⚠️ Disclaimer

This application is for informational purposes only and should not be used as a substitute for professional medical advice.

---

## 📈 Future Improvements

* Markdown rendering (bold, lists, formatting)
* Chat history persistence (database)
* Authentication system
* Mobile optimization
* Improved medical knowledge base

---

## 👩‍💻 Author

**Aishwarya Robin Kandikatla**

* LinkedIn: linkedin.com/in/aishwarya-robin-kandikatla
* GitHub: https://github.com/aishwaryarobink-dev

---

## ⭐ Show Your Support

If you like this project, consider giving it a ⭐ on GitHub!
