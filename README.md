# 🚀 **Team 11 - Software Engineering Project**

This repository contains the **complete application** (backend and frontend) for **Team 11 Software Engineering Project**. 

![Python](https://img.shields.io/badge/Python-3.11-blue?style=flat&logo=python)
![Flask](https://img.shields.io/badge/Flask-Framework-black?style=flat&logo=flask)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange?style=flat&logo=firebase)
![Google Cloud](https://img.shields.io/badge/Google%20Cloud-Gemini%20API-blue?style=flat&logo=googlecloud)
![React](https://img.shields.io/badge/React-Frontend-blue?style=flat&logo=react)

🔹 **Backend**: Built with **Flask**, integrating **Firebase** and **Google Cloud’s Gemini API** (Generative Language API).  
🔹 **Frontend**: Developed using **ReactJS**, interacting seamlessly with the backend.

This guide provides step-by-step instructions to **set up and run the application**, including **Firebase** and the **Gemini API** configuration.

---

## 📌 **Prerequisites**

Ensure you have the following installed on your machine:

✅ **Python 3.11 or lower** *(If you have a higher version, uninstall it before installing Python 3.11 or lower)*  
✅ A terminal (**Command Prompt, PowerShell, or Git Bash**)  
✅ A stable **internet connection**  

---

## 🔥 **How to Use the Application**

You have **two options** to access and use the application:

### 🏆 **Option 1: Use the Deployed Application** *(Recommended - No Setup Required!)*
The easiest way to access the application is through the **fully deployed version**:

🔗 **[Team 11 Application](https://team-11-frontend-v1-457986151866.us-central1.run.app/)**  
Simply **open the link in your browser** – no installation required! 🎉

### ⚙️ **Option 2: Manually Set Up Backend & Frontend**
Follow the instructions below to set up the application on your local machine.

---

## 🔧 **Firebase Firestore Setup (Required for Option 2)**

### 🏗 **Step 1: Create a Firebase Project**
1. Visit [Firebase Console](https://console.firebase.google.com/u/0/).
2. Click **"Create a project"** and follow the on-screen instructions.

### 🔥 **Step 2: Create a Firestore Database**
1. Navigate to **Project Overview → Cloud Firestore → Create Database**.
2. Choose **Test Mode** and complete the setup.

### 🔑 **Step 3: Update `.env` with Firebase Credentials**
1. In Firebase Console, go to **Project Settings → Service Accounts**.
2. Click **"Generate new private key"** (under 'Admin SDK configuration snippet' for Python).
3. Copy the following details from the downloaded JSON file into your `.env` file:

```ini
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
```

🔹 **Rename `.env.example` to `.env`** before proceeding.

---

## ⚡ **Google Cloud Gemini API & Firestore API Setup (Required for Option 2)**

### 🌐 **Step 1: Select Your Firebase Project**
1. Visit [Google Cloud Console](https://console.cloud.google.com/).
2. Select your project using the **Project ID**.

### 🔥 **Step 2: Enable Required APIs**
✅ **[Enable Firestore API](https://console.cloud.google.com/apis/api/firestore.googleapis.com/)**  
✅ **[Enable Gemini API](https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/)**

### 🗝 **Step 3: Create API Credentials**
1. Go to **APIs & Services → Credentials**.
2. Click **"Create Credentials" → "API Key"**.
3. Copy and add the key to your `.env` file:

```ini
GOOGLE_API_KEY=your_google_gemini_api_key
```

---

## 🛠 **Option 2: Manually Set Up Backend & Frontend**

🚀 **Ensure your `.env` file is correctly configured before proceeding.**

### 🎯 **Setting Up and Running the Backend**

1️⃣ **Navigate to the Backend Folder:**
```bash
cd backend
```

2️⃣ **Create & Activate a Virtual Environment:**
```bash
python -m venv .venv
# Activate virtual environment (Windows)
.venv\Scripts\activate
# Activate virtual environment (Mac/Linux)
source .venv/bin/activate
```

3️⃣ **Install Dependencies:**
```bash
pip install -r requirements.txt
```

4️⃣ **Run the Backend Application:**
```bash
python run.py
```

---

### 🎨 **Setting Up and Running the Frontend**

1️⃣ **Navigate to the Frontend Folder:**
```bash
cd frontend
```

2️⃣ **Install Dependencies:**
```bash
yarn
```

3️⃣ **Start the Frontend Application:**
```bash
yarn dev
```

4️⃣ **Access the Application:**
   - Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.
   - **Note:** The backend **must** be running before starting the frontend.

---

## 🎯 **Conclusion**

🎉 Congratulations! You have successfully set up the **Team 11 Software Engineering Project**.

💡 **Need Help?** Feel free to reach out for assistance! 🚀
