import os
from dotenv import load_dotenv
import requests

load_dotenv()
OBVIOUSLY_AI_API_KEY = os.getenv('OBVIOUSLY_AI_API_KEY')
url = "https://api.obviously.ai/v3/model/automl/predict/single/ffc23890-6117-11ee-a611-4715fb958c39"

payload = {
	"home_team": "France",
	"away_team": "Italy",
	"neutral": "False",
	"world_cup": "True"
}

headers = {
   "Accept": "application/json",
   "Authorization": "ApiKey " + OBVIOUSLY_AI_API_KEY,
   "Content-Type": "application/json"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())