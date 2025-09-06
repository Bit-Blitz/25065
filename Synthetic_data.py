import pandas as pd
import numpy as np
import random

# --- Configuration for Models 1 & 3 ---

# 1. Baseline runoff coefficients for each roof type.
ROOF_TYPE_COEFFICIENTS = {
    "Galvanized Iron Sheet": 0.90, "Asbestos Sheet": 0.80, "Tiled Roof": 0.75,
    "Concrete Roof": 0.70, "Ceramic Tiles": 0.85, "Terracotta and Clay Tiles": 0.85,
    "Metal Roofs": 0.90, "Stone Slabs": 0.75, "Modern Composite Sheets": 0.88,
    "Lime-Finished Roofs": 0.70
}

# 2. SIMPLIFIED Regional Modifiers: Urban vs. Rural
REGION_MODIFIERS = {
    "Urban": -0.03,  # Penalty for grime, pollutants
    "Rural": -0.05   # Higher penalty for dust, organic matter
}

# 3. Consolidated City Data: Includes Region Type and Annual Rainfall (mm)
# EXPANDED to be more representative of India's diverse climatic zones.
CITY_DATA = {
    # --- Urban Cities (12) ---
    "Delhi":     {"region": "Urban", "state": "Delhi", "rainfall": 780},
    "Mumbai":    {"region": "Urban", "state": "Maharashtra", "rainfall": 2250},
    "Bengaluru": {"region": "Urban", "state": "Karnataka", "rainfall": 970},
    "Chennai":   {"region": "Urban", "state": "Tamil Nadu", "rainfall": 1400},
    "Kolkata":   {"region": "Urban", "state": "West Bengal", "rainfall": 1800},
    "Hyderabad": {"region": "Urban", "state": "Telangana", "rainfall": 800},
    "Ahmedabad": {"region": "Urban", "state": "Gujarat", "rainfall": 800},
    "Pune":      {"region": "Urban", "state": "Maharashtra", "rainfall": 720},
    "Jaipur":    {"region": "Urban", "state": "Rajasthan", "rainfall": 650},
    "Lucknow":   {"region": "Urban", "state": "Uttar Pradesh", "rainfall": 1000},
    "Bhopal":    {"region": "Urban", "state": "Madhya Pradesh", "rainfall": 1150},
    "Patna":     {"region": "Urban", "state": "Bihar", "rainfall": 1200},

    # --- Rural/Agricultural Locations (12) ---
    "Hisar":      {"region": "Rural", "state": "Haryana", "rainfall": 500},
    "Anantapur":  {"region": "Rural", "state": "Andhra Pradesh", "rainfall": 560},
    "Wardha":     {"region": "Rural", "state": "Maharashtra", "rainfall": 1060},
    "Purnia":     {"region": "Rural", "state": "Bihar", "rainfall": 1350},
    "Tezpur":     {"region": "Rural", "state": "Assam", "rainfall": 1850},
    "Jaisalmer":  {"region": "Rural", "state": "Rajasthan", "rainfall": 210},
    "Bathinda":   {"region": "Rural", "state": "Punjab", "rainfall": 420},
    "Gorakhpur":  {"region": "Rural", "state": "Uttar Pradesh", "rainfall": 1250},
    "Raichur":    {"region": "Rural", "state": "Karnataka", "rainfall": 620},
    "Shillong":   {"region": "Rural", "state": "Meghalaya", "rainfall": 2900},
    "Sambalpur":  {"region": "Rural", "state": "Odisha", "rainfall": 1400},
    "Sagar":      {"region": "Rural", "state": "Madhya Pradesh", "rainfall": 1100}
}


def generate_runoff_data(num_samples=10000):
    """
    Generates a synthetic dataset for predicting the runoff coefficient (Model 1)
    with a simplified Urban/Rural region classification.
    """
    print(f"Generating {num_samples} samples for the Runoff Coefficient dataset...")
    data = []
    roof_types = list(ROOF_TYPE_COEFFICIENTS.keys())
    locations = list(CITY_DATA.keys())

    for _ in range(num_samples):
        roof_type = random.choice(roof_types)
        location = random.choice(locations)
        region = CITY_DATA[location]["region"]
        roof_age = random.randint(1, 50)

        base_coeff = ROOF_TYPE_COEFFICIENTS[roof_type]

        age_decay = 0.0002 * roof_age
        age_adjusted_coeff = base_coeff * (1 - age_decay)

        region_modifier = REGION_MODIFIERS[region]
        final_coeff = age_adjusted_coeff + region_modifier

        noise = np.random.normal(0, 0.015)
        noisy_coeff = final_coeff + noise
        
        runoff_coefficient = np.clip(noisy_coeff, 0.5, 0.95)

        data.append({
            "roof_type": roof_type,
            "roof_age": roof_age,
            "region": region,
            "location": location,
            "runoff_coefficient": round(runoff_coefficient, 4)
        })

    return pd.DataFrame(data)


def generate_harvesting_data(runoff_df):
    """
    Generates a synthetic dataset for predicting harvestable water (Model 3),
    simulating first flush and other system losses.
    """
    print(f"Generating {len(runoff_df)} samples for the Water Harvesting dataset...")
    data = []

    for index, row in runoff_df.iterrows():
        roof_area_sq_m = random.randint(40, 600)
        location = row['location']
        annual_rainfall_mm = CITY_DATA[location]["rainfall"]

        potential_water_liters = roof_area_sq_m * annual_rainfall_mm * row['runoff_coefficient']

        base_first_flush_loss = 0.02
        age_based_flush_penalty = 0.001 * row['roof_age']
        total_first_flush_loss = min(base_first_flush_loss + age_based_flush_penalty, 0.10)
        
        water_after_flush = potential_water_liters * (1 - total_first_flush_loss)

        other_inefficiency_factor = random.uniform(0.97, 0.99)
        harvestable_water_liters = water_after_flush * other_inefficiency_factor

        data.append({
            "roof_area_sq_m": roof_area_sq_m,
            "roof_type": row['roof_type'],
            "roof_age": row['roof_age'],
            "runoff_coefficient": row['runoff_coefficient'],
            "location": location,
            "annual_rainfall_mm": annual_rainfall_mm,
            "annual_harvestable_water_liters": int(harvestable_water_liters)
        })

    return pd.DataFrame(data)


if __name__ == "__main__":
    NUMBER_OF_SAMPLES = 20000

    runoff_dataset = generate_runoff_data(NUMBER_OF_SAMPLES)
    runoff_dataset_path = "Runoff_coeff_dataset.csv"
    runoff_dataset.to_csv(runoff_dataset_path, index=False)
    
    print(f"\nSuccessfully generated '{runoff_dataset_path}'")
    print("--- Sample of Model 1 Dataset ---")
    print(runoff_dataset.head())
    print("-" * 33)

    harvesting_dataset = generate_harvesting_data(runoff_dataset)
    harvesting_dataset_path = "Harvesting_dataset.csv"
    harvesting_dataset.to_csv(harvesting_dataset_path, index=False)
    
    print(f"\nSuccessfully generated '{harvesting_dataset_path}'")
    print("--- Sample of Model 3 Dataset ---")
    print(harvesting_dataset.head())
    print("-" * 33)

