# Team 11 - Software Engineering Project Backend

This repository contains the backend API for the Software Engineering Project. The backend is built using Flask and integrates with Firebase and Google Cloud’s Gemini API (Generative Language API) to implement various user stories.

This README provides detailed, step-by-step instructions for setting up and running the backend, as well as configuring Firebase and the Gemini API.

---

## Prerequisites

Ensure you have the following installed on your machine:

- **Python Version equal to or less than 3.11 (If you have Python version greater than 3.11, delete it before installing Python Version equal to or less than 3.11)**
- **Git**
- **Google Cloud SDK**
- A terminal (Command Prompt, PowerShell, or Git Bash)
- An internet connection to access Firestore and Google Cloud Console

---

## Firebase Setup

1. **Create a Firebase Project:**

   - Go to [Firebase Console](https://console.firebase.google.com/u/0/).
   - Click **"Create a project"** and follow the on-screen instructions to create a new project.

2. **Obtain the Project ID:**

   - Once your project is created, click the **gear icon (Project Settings)**.
   - Under the **"General"** tab, locate your **Project ID**.

3. **Update Environment Variables:**

   - Create and open a `.env` file in the root folder.
   - Set your Firebase Project ID:
     ```
     PROJECT_ID=your_firebase_project_id
     ```

---

## Google Cloud Gemini API Setup

1. **Select Your Project:**

   - Visit [Google Cloud Console](https://console.cloud.google.com/).
   - Select the project you created in Firebase using the Project ID.(Beside Google Cloud Icon)

2. **Enable the Gemini API:**

   - Go to the [Gemini API page](https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/).
   - Click **"Enable"**.

3. **Create Credentials:**

   - Go to **APIs & Services → Credentials**.
   - Click **"Create Credentials"** and select **"API Key"**.
   - Copy the created API key.

4. **Install and Authenticate Google Cloud SDK:**

   - Install Google Cloud SDK from [here](https://cloud.google.com/sdk/docs/install).
   - Open a terminal and authenticate your account:
     ```bash
     gcloud auth login
     ```
   - Set the active project:
     ```bash
     gcloud config set project your_firebase_project_id
     ```

5. **Update Environment Variables:**

   - In your `.env` file, add:
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

You can test the endpoints using Thunder Client or Postman or using OpenAPI Swagger UI.

