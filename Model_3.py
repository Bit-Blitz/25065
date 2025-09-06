import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import r2_score, mean_absolute_error
import lightgbm as lgb # type: ignore
import pickle

def train_water_loss_model():
    """
    Implements the physics-informed hybrid model. It trains a model to predict
    the amount of water *lost* due to inefficiencies like first flush.
    """
    print("--- Training Model 3: Water Loss Predictor (Hybrid Approach) ---")

    # 1. Load the dataset
    try:
        df = pd.read_csv("water_harvesting_dataset_simplified.csv")
        print("Dataset loaded successfully.")
    except FileNotFoundError:
        print("Error: 'water_harvesting_dataset_simplified.csv' not found.")
        print("Please run the data generation script first.")
        return

    # 2. Physics-Based Calculation
    df['potential_water_liters'] = df['roof_area_sq_m'] * df['annual_rainfall_mm'] * df['runoff_coefficient']

    # 3. Define Target for the ML Correction Model
    df['water_loss_liters'] = df['potential_water_liters'] - df['annual_harvestable_water_liters']

    # 4. Define Features (X) and Target (y) for the loss model
    features = ['roof_type', 'roof_age']
    target = 'water_loss_liters'
    X = df[features]
    y = df[target]

    # 5. Preprocessing Pipeline
    categorical_features = ['roof_type']
    numerical_features = ['roof_age']

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', 'passthrough', numerical_features),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ],
        remainder='passthrough'
    )

    # 6. Define the model
    model = lgb.LGBMRegressor(n_estimators=50, learning_rate=0.1, random_state=42)

    # 7. Create the full pipeline
    pipeline = Pipeline(steps=[('preprocessor', preprocessor),
                               ('regressor', model)])

    # 8. Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    print(f"Data split: {len(X_train)} training samples, {len(X_test)} testing samples.")

    # 9. Train the loss prediction model
    print("Training the water loss prediction model...")
    pipeline.fit(X_train, y_train)
    print("Training complete.")

    # 10. Evaluate the model
    print("\n--- Model Evaluation ---")
    y_pred = pipeline.predict(X_test)
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)

    print(f"R-squared (R²): {r2:.4f}")
    print(f"Mean Absolute Error (MAE): {mae:.2f} liters")

    # 11. Save the trained model pipeline using pickle
    model_filename = "water_loss_model.pkl"
    with open(model_filename, 'wb') as file:
        pickle.dump(pipeline, file)
    print(f"\nModel saved successfully as '{model_filename}'")
    
    print("\n--- How to Use This Hybrid Model ---")
    print("1. Calculate 'potential_water_liters' using the physical formula.")
    print("2. Load 'water_loss_model.pkl' and use it to predict the 'predicted_loss'.")
    print("3. Final Prediction = potential_water_liters - predicted_loss")

if __name__ == "__main__":
    train_water_loss_model()

