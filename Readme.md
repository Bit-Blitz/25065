# Machine Learning Model Interface Definitions
This document specifies the exact input and output formats for the trained machine learning models (.pkl files). This is the interface your backend code will use to get predictions from the models after processing the raw API request.

# Model 1: Runoff Coefficient Predictor (runoff_model.pkl)
This model predicts a roof's runoff efficiency based on its physical and environmental characteristics.

# Input Format
The model expects a Pandas DataFrame with the following three columns:

Column Name

Data Type

Description

Example

roof_type

String

The type of roofing material. Must match one of the trained categories.

"Concrete Roof"

roof_age

Integer

The age of the roof in years.

15

region

String

The classified environmental region, either "Urban" or "Rural".

"Urban"

Example (Python Code):

import pandas as pd

# The input must be a DataFrame, even for a single prediction.
model1_input = pd.DataFrame({
    'roof_type': ['Concrete Roof'],
    'roof_age': [15],
    'region': ['Urban']
})

# runoff_coefficient = runoff_model.predict(model1_input)

Output Format
The model returns a NumPy array containing a single floating-point number.

Data Type: float64

Value: The predicted runoff coefficient, typically between 0.5 and 0.95.

Example Output:

[0.6845]

To use this value, you will need to access the first element of the array (e.g., prediction[0]).

Model 3: Water Loss Predictor (water_loss_model.pkl)
This model is the second part of the hybrid system. It specifically predicts the volume of water lost due to inefficiencies like the first flush, which are primarily influenced by the roof's condition.

Input Format
The model expects a Pandas DataFrame with the following two columns:

Column Name

Data Type

Description

Example

roof_type

String

The type of roofing material.

"Concrete Roof"

roof_age

Integer

The age of the roof in years.

15

Example (Python Code):

import pandas as pd

# The input for the loss model.
model3_input = pd.DataFrame({
    'roof_type': ['Concrete Roof'],
    'roof_age': [15]
})

# predicted_loss = water_loss_model.predict(model3_input)

Output Format
The model returns a NumPy array containing a single floating-point number.

Data Type: float64

Value: The predicted volume of water lost in Liters.

Example Output:

[4589.5]

This value represents the predicted_loss that should be subtracted from the potential_water calculated by the physical formula.