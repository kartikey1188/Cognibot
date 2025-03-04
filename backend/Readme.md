# Team 11 - Software Engineering Project Backend

This repository contains the backend API for the Team 11 Software Engineering Project. The backend is built using Flask and integrates with Firebase and Google Cloud’s Gemini API (Generative Language API) to implement various user stories.

This README provides detailed, step-by-step instructions for setting up and running the backend, as well as configuring Firebase and the Gemini API.

---

## Prerequisites

Ensure you have the following installed on your machine:

- **Python Version 3.11 or lower (If you have a Python version higher than 3.11, uninstall it before installing Python 3.11 or lower)**
- A terminal (Command Prompt, PowerShell, or Git Bash)
- An internet connection to access Firestore and Google Cloud Console

---

## Firebase Firestore Setup

1. **Create a Firebase Project:**

   - Go to [Firebase Console](https://console.firebase.google.com/u/0/).
   - Click **"Create a project"** and follow the on-screen instructions to create a new project.

2. **Create and Use `service-account.json`:**

   - In the Firebase Console, go to **Project Settings → Service accounts**.
   - Under 'Admin SDK configuration snippet' select Python, click on **"Generate new private key"** and a file will be downloaded automatically. Rename the downloaded file to `service-account.json`.
   - Place the `service-account.json` file in the root of the project directory.

---

## Google Cloud Gemini API & Google Cloud Firestore API Setup

1. **Select Your Project:**

   - Visit [Google Cloud Console](https://console.cloud.google.com/).
   - Select the project you created in Firebase using the Project ID (located beside the Google Cloud icon).

2. **Enable the Google Cloud Firestore API:**

   - Go to the [Google Cloud Firestore API page](https://console.cloud.google.com/apis/api/firestore.googleapis.com/).
   - Click **"Enable"**.

3. **Enable the Gemini API:**

   - Go to the [Gemini API page](https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/).
   - Click **"Enable"**.

4. **Create Credentials:**

   - Go to **APIs & Services → Credentials**.
   - Click **"Create Credentials"** and select **"API Key"**.
   - Copy the created API key.

5. **Update Environment Variables:**

   - In the `.env` file present in the root directory, add:
     ```
     GOOGLE_API_KEY=your_google_gemini_api_key
     ```

## Setting Up and Running the Application

1. **Clone or Copy the Project Folder:**

   - Ensure you have the complete backend folder.

2. **Create and Activate a Virtual Environment:**

   - Navigate to the backend folder:
     ```bash
     cd backend
     ```
   - Create a virtual environment:
     ```bash
     python -m venv .venv
     ```
   - Activate the virtual environment:
     - **Windows:**
       ```bash
       .venv\Scripts\activate
       ```
     - **macOS/Linux:**
       ```bash
       source .venv/bin/activate
       ```

3. **Install Dependencies:**

   - Install required packages:
     ```bash
     pip install -r requirements.txt
     ```

4. **Run the Application:**

   - Start the Flask server:
     ```bash
     python run.py
     ```
   - The backend will run at `http://127.0.0.1:5000`.

---

## Testing the Endpoints

Test the API Endpoints using openapi.yaml

Or you can test the endpoints using Thunder Client or Postman or using OpenAPI Swagger UI.