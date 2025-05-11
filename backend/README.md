# The Espada Backend

## Description
Python & Flask API – Lightweight yet powerful for handling user requests, price updates, and store data. Flask is chosen for its flexibility and simplicity in building RESTful APIs.

Database: PostgreSQL – A robust relational database that efficiently handles structured data, such as store listings, user price updates, and historical gold price trends. Chosen for its reliability and strong querying capabilities.

## Installation
1. Go into backend directory of the project folder:
    ```
    cd csc33600-repo-the-espada/backend
    ```
1. Create an environment inside the backend folder:
   ```
   python -m venv test
    ```
2. Activate the environment: 
    ```
    source test/bin/activate
    ```
4. Install requirement file:
    ```
    pip3 install -r requirements.txt
    ```
Add a .env file in the backend and add this to it:

SECRET_KEY = 'secret_key'
MYSQL_HOST = 'localhost'
MYSQL_USER = 'root'
MYSQL_PASSWORD = '' #add password
MYSQL_DB = '' #add database name