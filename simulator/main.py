import requests
import firebase_admin
from firebase_admin import credentials, firestore
import warnings

# Suppress UserWarning category of warnings
warnings.simplefilter(action='ignore', category=UserWarning)

# Load credentials and initialize app
cred = credentials.Certificate('rugby-win-firebase-adminsdk.json')
firebase_admin.initialize_app(cred)

# Initialize Firestore client
db = firestore.client()

# Choose the teams HERE
team1 = "New Zealand"
team2 = "France"

# AI prediction
def get_prediction(home_team, away_team):
    url = "https://api.obviously.ai/v3/model/automl/predict/single/ffc23890-6117-11ee-a611-4715fb958c39"
    payload = {
        "home_team": home_team,
        "away_team": away_team,
        "neutral": "True",  # Neutral ground
        "world_cup": "False"  # Not a world cup match
    }

    headers = {
       "Accept": "application/json",
       "Authorization": "ApiKey 7d49ef56-6110-11ee-a67f-aed432a5522d",
       "Content-Type": "application/json"
    }

    # Make the POST request to the AI model
    response = requests.post(url, json=payload, headers=headers)
    data = response.json()
    
    # Access the nested probabilities to get the values for home_team and away_team
    home_team_probability = data['probabilities']['home_team']
    away_team_probability = data['probabilities']['away_team']

    return home_team_probability, away_team_probability

# Firebase odds 
def get_match_odds(team1, team2):
    # Format the team names to match the Firestore's document format
    formatted_team1 = team1.lower().replace(" ", "_")
    formatted_team2 = team2.lower().replace(" ", "_")

    # Reference to the 'matches' collection in Firestore
    matches_ref = db.collection("matches")

    # Adjusted code to chain where calls
    query_ref = matches_ref.where("teams.team_a", "==", formatted_team1)\
                        .where("teams.team_b", "==", formatted_team2)\
                        .limit(1)

    docs = query_ref.stream()

    # Return the document data if a match is found
    for doc in docs:
        return doc.to_dict()

    # If no match found, return None
    return None


# 70% for the Odds and 30% for the AI
def calculate_weighted_probability(odds_prob, ai_prob):
    return 0.7 * odds_prob + 0.3 * ai_prob

# Get the AI's prediction probabilities for the match outcomes
home_win_prob_team1, away_win_prob_team1 = get_prediction(team1, team2)
home_win_prob_team2, away_win_prob_team2 = get_prediction(team2, team1)

# Average the AI predictions to consider both team combinations
avg_ai_win_prob_team1 = (home_win_prob_team1 + away_win_prob_team2) / 2
avg_ai_win_prob_team2 = (home_win_prob_team2 + away_win_prob_team1) / 2

# Fetch the match odds from Firestore
match_data = get_match_odds(team1, team2)

if match_data:
    # Convert the odds from Firebase to probabilities
    odds_prob_team1 = 1 / float(match_data['teams']['bet_a'])
    odds_prob_team2 = 1 / float(match_data['teams']['bet_b'])

    # Calculate the combined probabilities using both odds and AI predictions
    combined_prob_team1 = calculate_weighted_probability(odds_prob_team1, avg_ai_win_prob_team1)
    combined_prob_team2 = calculate_weighted_probability(odds_prob_team2, avg_ai_win_prob_team2)
else:
    # If odds are not available in Firebase, just use AI predictions
    combined_prob_team1 = avg_ai_win_prob_team1
    combined_prob_team2 = avg_ai_win_prob_team2

# Print the combined win probabilities for both teams
print(f"{team1}'s combined win probability: {combined_prob_team1}")
print(f"{team2}'s combined win probability: {combined_prob_team2}")