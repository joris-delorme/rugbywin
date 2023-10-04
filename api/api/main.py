from flask import Flask, request, jsonify
from textblob import TextBlob
import requests

app = Flask(__name__)

SUBREDDITS = [
    "environment", "climate", "climatechange", "ClimateActionPlan", 
    "EcoInternet", "sustainability", "GlobalWarming", 
    "ZeroWaste", "Green", "RenewableEnergy"
]

REDDIT_URL = "http://www.reddit.com/r/{}/.json?t=day"

def get_sentiment(text):
    return TextBlob(text).sentiment.polarity

def fetch_and_analyze(subreddit):
    response = requests.get(REDDIT_URL.format(subreddit), headers={'User-agent': 'Mozilla/5.0'})
    
    if response.status_code == 200:
        posts = response.json().get('data', {}).get('children', [])
        
        sentiments = []
        post_count = 0
        for post in posts:
            post_data = post.get('data', {})
            created_utc = post_data.get('created_utc', 0)
            title = post_data.get('title', '')
            
            post_count += 1
            sentiments.append(get_sentiment(title))
                
        if post_count > 0:
            avg_sentiment = sum(sentiments) / post_count
        else:
            avg_sentiment = 0.0
        
        return {
            'subreddit': subreddit,
            'post_count': post_count,
            'average_sentiment': avg_sentiment
        }
    else:
        return {
            'subreddit': subreddit,
            'error': 'Failed to fetch data'
        }

@app.route('/', methods=['GET'])
def climate_sentiment():
    results = []
    for subreddit in SUBREDDITS:
        results.append(fetch_and_analyze(subreddit))
    
    return jsonify(results)