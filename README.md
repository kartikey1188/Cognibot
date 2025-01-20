# soft-engg-project-jan-2025-se-Jan-11

## Directory Structure
```
├── README.md                # Project documentation
├── backend/
│   ├── app/                 # Core application logic
│   │   ├── __init__.py       # Initialization for the app module
│   │   ├── apis/             # API endpoints and routes
│   │   │   └── __init__.py   # Initialization for the API module
│   │   ├── app.py            # Main app setup (Flask app instance)
│   │   ├── config.py         # Configuration settings
│   │   ├── models/           # Database models
│   │   │   └── __init__.py   # Initialization for the models module
│   │   ├── services/         # Business logic or service layer (e.g., RAG, code execution)
│   │   │   └── __init__.py   # Initialization for the services module
│   │   └── utils/            # Utility functions and helpers
│   │       └── __init__.py   # Initialization for the utils module
│   ├── data/                 # Data storage and files
│   │   ├── app.db            # SQLite database
│   │   ├── documents/        # Text/document files for retrieval
│   │   ├── embeddings.npy    # Embeddings file for vector database
│   │   └── uploads/          # User-uploaded files (e.g., images, documents)
│   ├── docs/                 # API documentation
│   ├── requirements.txt      # Python dependencies
│   ├── run.py                # Entry point to run the Flask app
│   └── tests/                # Unit tests and test suites
└── frontend/                 # Frontend (React)

```