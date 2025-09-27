import pandas as pd
import numpy as np
import pickle
import tensorflow as tf
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.metrics import r2_score


df = pd.read_csv("Datasets/Runoff_coeff_dataset.csv")


# ==============================================================================
#  2. PREPARE THE DATA
# ==============================================================================
# Separate features (X) and the target variable (y)
X = df.drop('runoff_coefficient', axis=1)
y = df['runoff_coefficient']

# Define the preprocessing steps
categorical_features = ['roof_type', 'region', 'location']
numerical_features = ['roof_age']
numeric_transformer = StandardScaler()
categorical_transformer = OneHotEncoder(handle_unknown='ignore', sparse_output=False)

preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numerical_features),
        ('cat', categorical_transformer, categorical_features)])

# Split data
X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.2, random_state=42)
X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42)

# Apply the preprocessing
X_train_processed = preprocessor.fit_transform(X_train)
X_val_processed = preprocessor.transform(X_val)
X_test_processed = preprocessor.transform(X_test)


# ==============================================================================
#  3. BUILD AND TRAIN THE TENSORFLOW MODEL
# ==============================================================================
# Define the model architecture
model = Sequential([
    Dense(128, activation='relu', input_shape=[X_train_processed.shape[1]]),
    Dropout(0.2),
    Dense(64, activation='relu'),
    Dense(1)
])
model.compile(optimizer='adam', loss='mean_squared_error')
early_stopping = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)

# Train the model
print("Training the TensorFlow model...")
model.fit(
    X_train_processed, y_train,
    validation_data=(X_val_processed, y_val),
    epochs=200,
    callbacks=[early_stopping],
    verbose=0
)
print("Training complete.")


# ==============================================================================
#  4. EVALUATE THE MODEL
# ==============================================================================
y_pred = model.predict(X_test_processed).flatten()
r2 = r2_score(y_test, y_pred)
print(f"\nModel R-squared (R2 Score) on Test Data: {r2:.4f}\n")


# ==============================================================================
#  5. SAVE THE PREPROCESSOR AND THE MODEL
# ==============================================================================
# Save the preprocessor using pickle
preprocessor_filename = 'preprocessor.pkl'
print(f"Saving preprocessor to {preprocessor_filename}...")
with open(preprocessor_filename, 'wb') as f:
    pickle.dump(preprocessor, f)
print("Preprocessor saved successfully!")

# Save the TensorFlow model using its built-in function
model_filename = 'tensorflow_runoff_model.h5'
print(f"Saving model to {model_filename}...")
model.save(model_filename)
print("Model saved successfully!")


# ==============================================================================
#  6. HOW TO LOAD AND USE THE SAVED FILES (EXAMPLE)
# ==============================================================================
#
# print("\n--- Loading and using the saved files ---")
# # Load the preprocessor
# with open(preprocessor_filename, 'rb') as f:
#     loaded_preprocessor = pickle.load(f)
#
# # Load the TensorFlow model
# loaded_model = load_model(model_filename)
#
# # Create new data for prediction
# new_data = pd.DataFrame({
#     'roof_type': ['Concrete Roof'],
#     'roof_age': [10],
#     'region': ['Urban'],
#     'location': ['Pune']
# })
#
# # First, process the new data using the loaded preprocessor
# new_data_processed = loaded_preprocessor.transform(new_data)
#
# # Then, make a prediction with the loaded model
# prediction = loaded_model.predict(new_data_processed).flatten()
# print(f"Predicted Runoff Coefficient for new data: {prediction[0]:.4f}")
# ------------------------------------------------------------------------------