import pandas as pd

# 1. Load both files
weather_df = pd.read_parquet('../data/daily_weather.parquet')
rugby_df = pd.read_csv('../data/rugby_dataset.csv')

weather_df = weather_df.rename(columns={'city_name': 'city'})

# 2. Clean and preprocess the data

# Convert the date columns to datetime format and extract only the date
weather_df['date'] = pd.to_datetime(weather_df['date']).dt.date
rugby_df['date'] = pd.to_datetime(rugby_df['date']).dt.date

# For weather data, if there are multiple logs for the same city and date, we'll group by city and date and take the first occurrence
weather_df = weather_df.groupby(['city', 'date']).first().reset_index()

# 3. Compare and count the rows

# Merge the two datasets based on 'city' and 'date'
merged_df = pd.merge(rugby_df, weather_df, on=['city', 'date'], how='inner')

# Get the number of rows where we have the weather for a rugby match
num_rows = merged_df.shape[0]

print(f"There are {num_rows} rows where we have the weather for a rugby match.")
merged_df.to_csv('merged_rugby_weather.csv', index=False)
