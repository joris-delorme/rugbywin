import firebase_admin
from firebase_admin import credentials, firestore

print("Script started!")

# Initialize Firebase
cred = credentials.Certificate('scraper/rugby-win-1696856418173-firebase-adminsdk-8levh-527e01b9b3.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

# Retrieve all documents from the 'teams' collection
team_docs = db.collection("teams").stream()

# Create a mapping from English name to ID
name_to_id = {doc.to_dict()["name"]: doc.id for doc in team_docs}

# Update 'matches' collection
match_docs = db.collection("matches").stream()
for doc in match_docs:
    data = doc.to_dict()
    if "teams" in data:
        if "team_a" in data["teams"]:
            data["teams"]["team_a"] = name_to_id.get(data["teams"]["team_a"], data["teams"]["team_a"])
        if "team_b" in data["teams"]:
            data["teams"]["team_b"] = name_to_id.get(data["teams"]["team_b"], data["teams"]["team_b"])
    doc.reference.update(data)

print("Documents updated successfully!")