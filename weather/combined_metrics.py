import matplotlib.pyplot as plt
import pandas as pd

# Load the dataset
data = pd.read_csv('../clean-data/merged_rugby_weather.csv')

# Calculate the score difference
data['score_difference'] = data['home_score'] - data['away_score']

# Drop rows with missing values in the specified columns
clean_data = data.dropna(subset=['avg_temp_c', 'precipitation_mm', 'avg_wind_speed_kmh'])

# Normalize the three weather metrics
clean_data['normalized_temp'] = (clean_data['avg_temp_c'] - clean_data['avg_temp_c'].min()) / (clean_data['avg_temp_c'].max() - clean_data['avg_temp_c'].min())
clean_data['normalized_precipitation'] = (clean_data['precipitation_mm'] - clean_data['precipitation_mm'].min()) / (clean_data['precipitation_mm'].max() - clean_data['precipitation_mm'].min())
clean_data['normalized_wind_speed'] = (clean_data['avg_wind_speed_kmh'] - clean_data['avg_wind_speed_kmh'].min()) / (clean_data['avg_wind_speed_kmh'].max() - clean_data['avg_wind_speed_kmh'].min())

# Compute the combined weather index
clean_data['weather_index'] = clean_data[['normalized_temp', 'normalized_precipitation', 'normalized_wind_speed']].mean(axis=1)

# Compute the Pearson correlation coefficient for the score difference and the combined weather index
correlation_combined = clean_data[['score_difference', 'weather_index']].corr().iloc[0, 1]
print("")
print("")
print("Pearson correlation coefficient (Score Difference vs. Combined Weather Index):", round(correlation_combined, 2))
print("")

# Plot the score difference against the combined weather index
plt.figure(figsize=(12, 6))
plt.scatter(clean_data['weather_index'], clean_data['score_difference'], alpha=0.5)
plt.title('Score Difference vs. Combined Weather Index')
plt.xlabel('Combined Weather Index')
plt.ylabel('Score Difference')
plt.show()


