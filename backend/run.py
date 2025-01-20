from backend.app import create_app

# Initialize the app with the config class
app = create_app()

if __name__ == '__main__':
    # Run the Flask app
    app.run(debug=True)
