import requests
import atexit
import schedule
import time
from threading import Thread
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from bs4 import BeautifulSoup
import re
import os
from datetime import datetime
from mailjet_rest import Client
import base64
import json
import sys
from datetime import datetime, timedelta


print("Script started!")

# Global variables to hold the scraped data and count
scraped_data = {
    'status': 'pending',
    'data': None
}
scrape_count = 0
# Limit of scraping times per day
SCRAPE_LIMIT = 500

def reset_counter():
    global scrape_count
    scrape_count = 0

# Schedule the counter reset at midnight every day
schedule.every().day.at("00:00").do(reset_counter)

# This function will keep the scheduled tasks running in the background
def run_schedule():
    while True:
        current_time = datetime.now().time()
        # Reset the counter at 00:00
        if current_time.hour == 0 and current_time.minute == 0:
            reset_counter()
            # Sleep for a minute to prevent multiple resets in the same minute
            time.sleep(60)
        time.sleep(10)  # Check every 10 seconds

# Convert american odds to european odds

def american_to_european(american_odds):
    # Check if the odds are in American format
    if american_odds.startswith("+"):
        return round((int(american_odds[1:]) / 100) + 1, 2)
    elif american_odds.startswith("-"):
        return round((100 / abs(int(american_odds))) + 1, 2)
    else:
        # If not in American format, assume they are already in European format
        return round(float(american_odds), 2)

# Start the background thread for scheduled tasks
thread = Thread(target=run_schedule)
thread.start()

# Register the function to be called on exit
atexit.register(lambda: thread.join())


# Oldbets script beginning

def fetch_oldbets():

    response = requests.get(
    url='https://proxy.scrapeops.io/v1/',
    params={
        'api_key': '26052b57-03c7-499e-abd3-c38571cddb15',
        'url': 'https://www.oddsportal.com/rugby-union/world/world-cup/results/', 
        'wait': 5000,
        'scroll': 3000,
        'wait': 5000,
    },
    )

    # Parse the HTML content using BeautifulSoup
    soup = BeautifulSoup(response.text, 'html.parser')

    main_div = soup.find("div", attrs={"data-v-012eb9f0": ""})
    if not main_div:
        print("Failed to find the main div. The website structure might have changed.")
        return []

    odds_dict = {}
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

        # Store odds with teams as keys
        odds_dict[(team1, team2)] = {
            "team_a": team1,
            "team_b": team2,
            "score_a": score1,
            "score_b": score2,
            "team_a_odds": odd_team1,
            "oddDraw": oddDraw,
            "team_b_odds": odd_team2,
            "time": match_time,
            "date": current_date,
        }

    return odds_dict

# Oldbets script finish


# Rugby World Cup and Unibet beginning

def fetch_rugby_data():
    try:
        global scrape_count, scraped_data

        if scrape_count >= SCRAPE_LIMIT:
            return scraped_data

        # Setup Chrome options for headless mode
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--no-sandbox")

        driver = webdriver.Chrome(options=chrome_options)

        # Navigate to the website
        driver.get('https://www.rugbyworldcup.com/2023/matches')

        # You might want to add explicit waits for specific elements if necessary, using WebDriverWait.

        # Get page source and parse it with BeautifulSoup
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        matches = soup.find_all(attrs={"data-match-id": True})

        all_matches_info = []  # List to store match information

        # Assuming the first match is on 2023-09-16
        current_date = datetime.strptime("2023-09-16", "%Y-%m-%d")
        last_parsed_day = ""

        month_mapping = {
            'January': '01', 'February': '02', 'March': '03', 'April': '04',
            'May': '05', 'June': '06', 'July': '07', 'August': '08',
            'September': '09', 'October': '10', 'November': '11', 'December': '12'
        }

        last_month = None

        venue_coordinates = {
            "Stade de France": {"latitude": 48.924616030178335, "longitude": 2.3601927223996904},
            "Stade Geoffroy-Guichard": {"latitude": 45.4609237493091, "longitude": 4.389990173069196},
            "Stade de Bordeaux": {"latitude": 44.89771562933145, "longitude": -0.5615408209790559},
            "Stade de Marseille": {"latitude": 43.27031915830572, "longitude": 5.395865019644995},
            "Stadium de Toulouse": {"latitude": 43.58348366335547, "longitude": 1.434015820866475},
            "Stade Pierre-Mauroy": {"latitude": 50.61204649881558, "longitude": 3.1304847355182903},
            "Stade de Nice": {"latitude": 43.69116635863224, "longitude": 7.192383203129796},
            "Stade de la Beaujoire": {"latitude": 47.256147034714175, "longitude": -1.5246642655352083},
            "OL Stadium": {"latitude": 45.76534657731965, "longitude": 4.982036016957022}
        }

        for matche in matches:
            
            day_name_element = matche.find(class_="fixture__day")
            day_name = day_name_element.get_text(strip=True)  # Gets "Friday,"

            # Extract day number and month by using next_sibling
            day_number_month = day_name_element.next_sibling.strip()  # Gets "8 September"
            day_number, month = day_number_month.split()

            month_number = month_mapping.get(month)
            time_str = matche.find(class_="bolder").find_next_sibling("span").get_text(strip=True)

            formatted_date_time = f"2023-{month_number}-{day_number} {time_str}"

            # In match_info dictionary
            
            score_a = int(matche.find(class_="js-team-a-score").get_text(strip=True))
            score_b = int(matche.find(class_="js-team-b-score").get_text(strip=True))
            status = matche.find(class_="match-status").get_text(strip=True)

            if status.lower() == "upcoming":
                winner = "upcoming"
            elif score_a > score_b:
                winner_raw = matche.find_all(class_="fixture__team")[0].get_text(strip=True)
                winner = re.sub(r'[\d\s]+$', '', winner_raw).strip()
            elif score_b > score_a:
                winner_raw = matche.find_all(class_="fixture__team")[1].get_text(strip=True)
                winner = re.sub(r'[\d\s]+$', '', winner_raw).strip()
            else:
                winner = "draw"


            venue_name_html = matche.find(class_="fixture__venue").get_text(strip=True)
            
            # Determine the appropriate venue key from the venue_coordinates dictionary
            venue_key = next((key for key in venue_coordinates if key in venue_name_html), None)
            coordinates = venue_coordinates.get(venue_key, {"latitude": None, "longitude": None})   

            team_a_raw = matche.find_all(class_="fixture__team")[0].get_text(strip=True)
            team_b_raw = matche.find_all(class_="fixture__team")[1].get_text(strip=True)

            team_a_cleaned = re.sub(r'[\d\s]+$', '', team_a_raw).strip()
            team_b_cleaned = re.sub(r'[\d\s]+$', '', team_b_raw).strip()

            match_info = {
                "match_id": matche["data-match-id"],
                "date": formatted_date_time,        
                "phase": matche.find(class_="event-phase-label").get_text(strip=True),
                "status": status,
                "winner": winner,  # This is the new addition
                "teams": {
                    "team_a": team_a_cleaned,
                    "team_b": team_b_cleaned,
                    "score_a": str(score_a),
                    "score_b": str(score_b)
                },
                "venue": venue_name_html,        
                "latitude": coordinates["latitude"],
                "longitude": coordinates["longitude"],
                "watch_link": matche.find(class_="js-broadcasters").find("a")["href"],
                "match_centre_link": matche.find_all(class_="button")[0]["href"],
                "predictor_link": matche.find_all(class_="button")[1]["href"],
                "highlights_link": matche.find_all(class_="button")[2]["href"],
            }

            all_matches_info.append(match_info)  # Append each match's info to the list



        # Script for Unibet with the Bets

        # Navigate to the website
        driver.get('https://www.unibet.com/betting/sports/filter/rugby_union/rugby_world_cup_2023/all/matches')

        # Get page source and parse it with BeautifulSoup
        soup = BeautifulSoup(driver.page_source, 'html.parser')

        # Step 1: Extracting the bets

        outcome_bets_dict = {}

        for div in soup.find_all(class_="_79bb0"):
    
            # Iterate through each match inside the div
            for match_div in div.find_all('div', attrs={"data-test-name": "matchEvent"}):
                
                # Extract cleaned team names
                team_names_divs = match_div.find_all('div', attrs={"data-test-name": "teamName"})
                team1 = re.sub(r'[\d\s]+$', '', team_names_divs[0].get_text(strip=True)) if team_names_divs else 'N/A'
                team2 = re.sub(r'[\d\s]+$', '', team_names_divs[1].get_text(strip=True)) if len(team_names_divs) > 1 else 'N/A'
                
                # Extract the first group's outcome bets
                bet_groups = match_div.find_all('div', attrs={"data-test-name": "outcomeBet"})
                
                # Default values for bets
                bet1, bet2 = 'N/A', 'N/A'
                
                # Consider only the first bet group
                try:
                    if bet_groups:
                        bet1 = bet_groups[0].find('span').get_text()
                except IndexError:
                    print("Error: Some bet groups are missing!")
                except Exception as e:
                    print(f"Unexpected error: {e}")

                try:
                    if bet_groups:
                        bet2 = bet_groups[1].find('span').get_text()
                except IndexError:
                    print("Error: Some bet groups are missing!")
                except Exception as e:
                    print(f"Unexpected error: {e}")


                # Update the dictionary
                outcome_bets_dict[(team1, team2)] = (bet1, bet2)

        driver.quit()
        # End of the unibet script

        odds = fetch_oldbets()  # Fetch odds data

        # Assigning bets to matches in all_matches_info
        for match_info in all_matches_info:
            team_a = match_info["teams"]["team_a"]
            team_b = match_info["teams"]["team_b"]

            # Check if the match has finished
            if match_info["status"].lower() == "result":
                # Get the odds for the specific finished match from the old bets data
                odds_for_match = odds.get((team_a, team_b), None)

                # If there's odds data for the finished match, assign it
                if odds_for_match:
                    match_info["teams"]["bet_a"] = odds_for_match.get('team_a_odds', "N/A")
                    match_info["teams"]["bet_b"] = odds_for_match.get('team_b_odds', "N/A")
                else:
                    # If there's no old odds data for the finished match, mark it as closed
                    match_info["teams"]["bet_a"] = "Closed"
                    match_info["teams"]["bet_b"] = "Closed"

            # For upcoming matches, fetch the odds data from the outcome_bets_dict
            else:
                upcoming_odds = outcome_bets_dict.get((team_a, team_b), (None, None))
                match_info["teams"]["bet_a"] = upcoming_odds[0] if upcoming_odds[0] else "N/A"
                match_info["teams"]["bet_b"] = upcoming_odds[1] if upcoming_odds[1] else "N/A"

        # After iterating through all matches, we'll have updated the old odds for finished matches
        scraped_data = {
            'status': 'success',
            'data': all_matches_info
        }

        scrape_count += 1
        print("The scrape count is : ", scrape_count, "/500")

        return scraped_data
    
    
    except requests.RequestException as e:
        return {
            'status': 'error',
            'message': f"Failed to fetch data. Reason: {e}"
        }

# Rugby World Cup and Unibet beginning

def send_email_with_json(data):
    try: 
        # Get your Mailjet API and Secret Key (either from environment variables or securely)
        api_key = '7e44c6be7ce568327b686da8fab7f6d1'
        api_secret = '1c2b62cb3ad179964969155bd94ca3f4'
        
        mailjet = Client(auth=(api_key, api_secret), version='v3.1')
        
        # Create the JSON file
        with open("rugby_data.json", "w") as file:
            json.dump(data, file, indent=4)

        # Email details
        email_data = {
            'Messages': [
                {
                    "From": {
                        "Email": "rugbywin.contact@gmail.com",
                        "Name": "Rugby Win"
                    },
                    "To": [
                        {
                            "Email": "mathurinleo69@gmail.com",
                            "Name": "Leo"
                        },
                        {
                            "Email": "hello@jorisdelorme.fr",
                            "Name": "Joris"
                        }
                    ],
                    "Subject": "Rugby Data Update",
                    "TextPart": "There's a new update on the RugbyWin Data",
                    "Attachments": [
                        {
                            "ContentType": "application/json",
                            "Filename": "rugby_data.json",
                            "Base64Content": base64.b64encode(open("rugby_data.json", "rb").read()).decode("utf-8")
                        }
                    ]
                }
            ]
        }
        
        # Send the email
        result = mailjet.send.create(data=email_data)
        if result.status_code != 200:
            print(f"Error sending email: {result.json()}")
            return False
        return True
    
    except Exception as e:
        # Log the exception for debugging purposes
        print(f"Exception occurred while sending email: {str(e)}", file=sys.stderr)
        return False

def get_rugby_data():
    results = fetch_rugby_data()
    
    if results['status'] == 'success':
        # If fetching was successful, send the JSON data via email
        email_status = send_email_with_json(results['data'])
        if not email_status:
            results['email_status'] = 'failed'
        else:
            results['email_status'] = 'success'

if __name__ == '__main__':
    data = fetch_rugby_data()
    # Save data to JSON file
    with open("data.json", "w") as file:
        json.dump(data, file, indent=4)

    print("Data saved to 'data.json'.")

print("Finished script")

