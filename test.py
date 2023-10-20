import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate('./rugby-win-firebase-adminsdk.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

def add_document(data):
    # Add a new document to "myCollection"
    doc_ref = db.collection('matches').add(data)
    print(f"Document added with ID: {doc_ref}")



data_to_add = {
    "teams": {
        "team_a": "Italy",
        "team_b": "Namibia",
        "score_a": "52",
        "score_b": "8",
        "bet_a": "1.01",
        "bet_b": "14.67"
    }
}

add_document(data_to_add)
