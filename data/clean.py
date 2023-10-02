import pandas as pd

# Read the CSV file into a DataFrame
df = pd.read_csv('../data/rugby_dataset.csv')

print("CSV file start update !")

def winner():
    # Create a new column "winner" and set the values based on the scores
    df['winner'] = 'null'  # default value
    df.loc[df['home_score'] > df['away_score'], 'winner'] = 'home_team'
    df.loc[df['home_score'] < df['away_score'], 'winner'] = 'away_team'

def addID():
    df.insert(0, 'ID', range(1, len(df) + 1))

addID()

# Save the modified DataFrame back to the CSV file
df.to_csv('../data/rugby_dataset.csv', index=False)

print("CSV file has been updated !")

# By ChatGPT