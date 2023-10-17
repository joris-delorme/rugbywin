from flask import Flask, request, jsonify, make_response
from threading import Thread
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from bs4 import BeautifulSoup
import re

chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--disable-dev-shm-usage")
chrome_options.add_argument("--no-sandbox")

driver = webdriver.Chrome(options=chrome_options)

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
print(outcome_bets_dict)
