# soft-engg-project-jan-2025-se-Jan-11

## Project Overview

This project is a web application that includes a backend built with Flask and a frontend built with React. The backend handles API requests, user authentication, and database interactions, while the frontend provides a user interface for interacting with the application.

## Directory Structure

```
├── README.md                # Project documentation
├── backend/
│   ├── .env                 # Environment variables
│   ├── app/                 # Core application logic
│   │   ├── __init__.py      # Initialization for the app module
│   │   ├── apis/            # API endpoints and routes
│   │   │   ├── __init__.py  # Initialization for the API module
│   │   │   ├── admin.py     # Admin-related API endpoints
│   │   │   ├── all_marshals.py # Marshaling rules for API responses
│   │   │   ├── auth.py      # Authentication-related API endpoints
│   │   │   ├── course.py    # Course-related API endpoints
│   │   │   ├── instructor.py # Instructor-related API endpoints
│   │   │   ├── student.py   # Student-related API endpoints
│   │   │   └── user.py      # User-related API endpoints
│   │   ├── config.py        # Configuration settings
│   │   ├── models/          # Database models
│   │   │   ├── __init__.py  # Initialization for the models module
│   │   │   └── user.py      # User-related database models
│   │   ├── services/        # Business logic or service layer (e.g., RAG, code execution)
│   │   │   └── __init__.py  # Initialization for the services module
│   │   ├── utils/           # Utility functions and helpers
│   │   │   ├── __init__.py  # Initialization for the utils module
│   │   │   └── seed.py      # Database seeding script
│   ├── data/                # Data storage and files
│   │   ├── app.db           # SQLite database
│   │   ├── documents/       # Text/document files for retrieval
│   │   ├── embeddings.npy   # Embeddings file for vector database
│   │   └── uploads/         # User-uploaded files (e.g., images, documents)
│   ├── docs/                # API documentation
│   ├── requirements.txt     # Python dependencies
│   ├── run.py               # Entry point to run the Flask app
│   └── tests/               # Unit tests and test suites
│       └── .gitkeep         # Placeholder to keep the directory in version control
└── frontend/                # Frontend (React)
    ├── .gitignore           # Git ignore file for frontend
    ├── .gitkeep             # Placeholder to keep the directory in version control
    ├── eslint.config.js     # ESLint configuration
    ├── index.html           # Main HTML file
    ├── package.json         # Node.js dependencies and scripts
    ├── public/              # Public assets
    │   ├── graduation-cap-circular-button-svgrepo-com.svg # Example asset
    │   └── Solid_blue.svg   # Example asset
    ├── src/                 # Source code
    │   ├── App.jsx          # Main React component
    │   ├── axiosClient.js   # Axios instance for API requests
    │   ├── components/      # React components
    │   │   ├── AuthForm.jsx # Authentication form component
    │   │   ├── CourseCard.jsx # Course card component
    │   │   ├── Navbar.jsx   # Navigation bar component
    │   │   ├── PrivateRoute.jsx # Private route component
    │   │   └── PublicRoute.jsx # Public route component
    │   ├── layouts/         # Layout components
    │   │   ├── CourseLayout.jsx # Layout for course pages
    │   │   ├── Layout.jsx   # Main layout component
    │   │   └── StudentDashboardLayout.jsx # Layout for student dashboard
    │   ├── pages/           # Page components
    │   │   ├── Auth/        # Authentication pages
    │   │   │   ├── Login.jsx # Login page
    │   │   │   └── Signup.jsx # Signup page
    │   │   ├── Student/     # Student-related pages
    │   │   │   ├── Assignment.jsx # Assignment page
    │   │   │   ├── Course.jsx # Course page
    │   │   │   ├── Courses.jsx # Courses page
    │   │   │   ├── Help.jsx # Help page
    │   │   │   ├── Lecture.jsx # Lecture page
    │   │   │   ├── Profile.jsx # Profile page
    │   │   │   └── Recommendations.jsx # Recommendations page
    │   ├── redux/           # Redux store and slices
    │   │   ├── slice/       # Redux slices
    │   │   │   ├── authSlice.js # Authentication slice
    │   │   │   └── uiSlice.js # UI slice
    │   │   └── store.js     # Redux store configuration
    │   ├── main.jsx         # Main entry point for React
    │   └── index.css        # Global CSS
    ├── tailwind.config.js   # Tailwind CSS configuration
    └── vite.config.js       # Vite configuration
```

## Getting Started

### Prerequisites

- Python 3.x
- Node.js
- npm or yarn

### Backend Setup

1. Navigate to the `backend` directory:

   ```sh
   cd backend
   ```

2. Create a virtual environment:

   ```sh
   python -m venv .venv
   ```

3. Activate the virtual environment:
   - On Windows:

     ```sh
     .venv\Scripts\activate
     ```

   - On macOS/Linux:

     ```sh
     source .venv/bin/activate
     ```

4. Install the dependencies:

   ```sh
   pip install -r requirements.txt
   ```

5. Run the Flask application:

   ```sh
   python run.py
   ```

### Frontend Setup

1. Navigate to the `frontend` directory:

   ```sh
   cd frontend
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

3. Start the development server:

   ```sh
   npm run dev
   ```

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License.
