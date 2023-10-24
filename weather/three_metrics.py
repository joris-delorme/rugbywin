import matplotlib.pyplot as plt
import pandas as pd

# Load the dataset
data = pd.read_csv('../clean-data/merged_rugby_weather.csv')

# Calculate the score difference
data['score_difference'] = data['home_score'] - data['away_score']

# Drop rows with missing values in the specified columns
clean_data = data.dropna(subset=['avg_temp_c', 'precipitation_mm', 'avg_wind_speed_kmh'])

correlation_temp = clean_data['avg_temp_c'].corr(clean_data['score_difference'])
correlation_precipitation = clean_data['precipitation_mm'].corr(clean_data['score_difference'])
correlation_wind_speed = clean_data['avg_wind_speed_kmh'].corr(clean_data['score_difference'])

print("")
print("Pearson correlation coefficient (Score Difference vs. Average Temperature):", round(correlation_temp, 2))
print("")
print("Pearson correlation coefficient (Score Difference vs. Precipitation):", round(correlation_precipitation, 2))
print("")
print("Pearson correlation coefficient (Score Difference vs. Average Wind Speed):", round(correlation_wind_speed, 2))
print("")

fig, axs = plt.subplots(3, 1, figsize=(12, 18))

# Score difference vs. average temperature
axs[0].scatter(clean_data['avg_temp_c'], clean_data['score_difference'], alpha=0.5)
axs[0].set_title('Score Difference vs. Average Temperature')
axs[0].set_xlabel('Average Temperature (°C)')
axs[0].set_ylabel('Score Difference')

# Score difference vs. precipitation
axs[1].scatter(clean_data['precipitation_mm'], clean_data['score_difference'], alpha=0.5)
axs[1].set_title('Score Difference vs. Precipitation')
axs[1].set_xlabel('Precipitation (mm)')
axs[1].set_ylabel('Score Difference')

# Score difference vs. average wind speed
axs[2].scatter(clean_data['avg_wind_speed_kmh'], clean_data['score_difference'], alpha=0.5)
axs[2].set_title('Score Difference vs. Average Wind Speed')
axs[2].set_xlabel('Average Wind Speed (km/h)')
axs[2].set_ylabel('Score Difference')

plt.tight_layout()
plt.subplots_adjust(hspace=0.5, bottom=0.05, top=0.97)
plt.show()
