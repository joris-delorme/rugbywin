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

driver.get('https://www.oddsportal.com/rugby-union/world/world-cup/results/')

# Get page source and parse it with BeautifulSoup
soup = BeautifulSoup(driver.page_source, 'html.parser')

# Initialize list to store results
matches = []

# Loop through each div with class 'eventRow'
for event in soup.find_all('div', class_='eventRow'):
    a = soup.find('a')
    match = {}
    
    # Get teams from anchor tags
    teams = a.select('a')[:2]   # Gets the first 2 anchor tags inside the div
    match['team1'] = teams[0].get_text(strip=True)
    match['team2'] = teams[1].get_text(strip=True)
    
    # Get odds from paragraph tags
    odds = a.select('p')[:3:2]  # Gets the 1st and 3rd paragraph tags inside the div
    match['odd_team1'] = odds[0].get_text(strip=True)
    match['odd_team2'] = odds[1].get_text(strip=True)
    
    matches.append(match)

# Print the results
for match in matches:
    print(f"{match['team1']} ({match['odd_team1']}) - {match['team2']} ({match['odd_team2']})")