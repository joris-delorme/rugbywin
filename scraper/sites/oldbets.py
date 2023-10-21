from bs4 import BeautifulSoup
import requests
import json
import re
from datetime import datetime, timedelta
import time


def american_to_european(american_odds):
    # Check if the odds are in American format
    if american_odds.startswith("+"):
        return round((int(american_odds[1:]) / 100) + 1, 2)
    elif american_odds.startswith("-"):
        return round((100 / abs(int(american_odds))) + 1, 2)
    else:
        # If not in American format, assume they are already in European format
        return round(float(american_odds), 2)
    

def fetch_oldbets():

    response = requests.get(
    url='https://proxy.scrapeops.io/v1/',
    params={
        'api_key': 'ce51357c-46eb-4915-8424-c86624296524',
        'url': 'https://www.oddsportal.com/rugby-union/world/world-cup/results/',
        'wait': 8925,
        'scroll': 3201,
        'wait': 6385,
    },
    )

    # Parse the HTML content using BeautifulSoup
    soup = BeautifulSoup(response.text, 'html.parser')
    
    main_div = soup.find("div", attrs={"data-v-012eb9f0": ""})
    if not main_div:
        print("Failed to find the main div. The website structure might have changed.")
        return []

    matches = []
    current_date = None
    event_rows = main_div.find_all("div", class_="eventRow")
    time_pattern = re.compile(r'^\d{1,2}:\d{2}$')  # A pattern to match formatted times like 14:30

    for event in event_rows:
        # If the date div exists in this event row, update current_date
        date_div = event.find(
            "div",
            class_="text-black-main font-main w-full truncate text-xs font-normal leading-5",
        )
        if date_div:
            date_text = date_div.text.strip().lower()
            
            if "today" in date_text:
                current_date = datetime.now().strftime('%d %b %Y')
            elif "yesterday" in date_text:
                current_date = (datetime.now() - timedelta(days=1)).strftime('%d %b %Y')
            else:
                # Extract the date using regular expression
                match = re.search(r"\d{2} \w{3} \d{4}", date_text)
                if match:
                    current_date = match.group(0)

        # Extracting match time
        match_time = "Unknown"
        for p in event.find_all("p"):
            if time_pattern.match(p.text.strip()):
                match_time = p.text.strip()
                break

        # Extracting the two teams and their scores from the event
        teams = [
            a["title"] for a in event.find_all("a", title=True) if "title" in a.attrs
        ]
        scores = []
        for t in event.find_all("a", title=True):
            all_div = t.find_all("div")
            scores.append(all_div[1].text.strip())

        score1, score2 = "N/A", "N/A"
        if len(scores) == 2:
            score1, score2 = scores

        if len(teams) < 2:
            print("Warning: Less than two teams found for an event. Skipping...")
            continue

        team1, team2 = teams

        # Extracting the odds for each team
        odds = event.find_all("p", class_="height-content", limit=3)

        if len(odds) < 3:
            print("Warning: Less than 3 odds found for an event. Skipping...")
            continue

        # Extracting the odds for each team and convert if necessary
        odds = event.find_all("p", class_="height-content", limit=3)
        odd_team1 = str(american_to_european(odds[0].text.strip()))
        oddDraw = str(american_to_european(odds[1].text.strip()))
        odd_team2 = str(american_to_european(odds[2].text.strip()))

        matches.append({
            "team1": team1,
            "team2": team2,
            "score1": score1,
            "score2": score2,
            "odd_team1": odd_team1,
            "oddDraw": oddDraw,
            "odd_team2": odd_team2,
            "time": match_time,
            "date": current_date,  # Use the current_date for this match
        })

    return matches

data = fetch_oldbets()

# Save data to JSON file
with open("world_cup_data.json", "w") as file:
    json.dump(data, file, indent=4)

print("Data saved to 'world_cup_data.json'.")