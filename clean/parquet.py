import pandas as pd

weather = pd.read_parquet("../data/daily_weather.parquet", engine='pyarrow')
matches = pd.read_csv("../data/rugby_dataset.csv")

#weather_columns = ['station_id', 'city_name', 'date', 'season', 'avg_temp_c', 'min_temp_c', 'max_temp_c', 'precipitation_mm', 'snow_depth_mm', 'avg_wind_dir_deg', 'avg_wind_speed_kmh', 'peak_wind_gust_kmh', 'avg_sea_level_pres_hpa', 'sunshine_total_min']
#matches_columns = ['ID', 'date', 'home_team', 'away_team', 'home_score', 'away_score', 'competition', 'stadium', 'city', 'country', 'neutral', 'world_cup', 'winner']

def get_columns_from_parquet(file):
    return file.columns.tolist()

def get_unique_values(file, column):
    return file[column].unique().tolist()


dates = get_unique_values(matches, 'date')
unique_dates_in_weather = get_unique_values(weather, 'date')
missing_dates = [pd.to_datetime(date).date() for date in dates if pd.to_datetime(date).date() not in unique_dates_in_weather]

cities = get_unique_values(matches, 'city')
unique_cities_in_weather = get_unique_values(weather, 'city_name')
missing_cities = [city for city in cities if city not in unique_cities_in_weather]

#print(len(cities))
#print(len(missing_cities))
#print(weather['date'].iloc[0])

#118
#67
#1874-02-23

# Output results
if missing_cities:
    print(f"The following cities are missing from the parquet file: {len(missing_cities)}")
else:
    print("All cities are present in the parquet file!")

if missing_dates:
    print(f"The following dates are missing from the parquet file: {len(missing_dates)}")
else:
    print("All dates are present in the parquet file!")
