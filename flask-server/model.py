import pandas as pd
import json
import joblib

df = pd.read_csv("assets/results-dataset.csv")
results = df[(df.year >= 2014) & (df.year < 2024)]

def query_dataset(year, round, drivers):
  categorical_cols = ['driverId', 'constructorId', 'circuitId']
  
  # Set up dummy data (for preserving one-hot encoding columns)
  categorical_data = results[categorical_cols].copy()
  dummy_data = pd.get_dummies(categorical_data, columns=categorical_cols)
  # print(dummy_data)
  
  # Get relevant entries
  drivers_set = set(driver['driverId'] for driver in drivers)
  query = results[
    (results['year'] == year) &
    (results['round'] == round) &
    (results['driverId'].isin(drivers_set))
  ].set_index('resultId')

  # Drop unnecessary columns, including grid
  query.drop(["positionOrder", "raceId","constructorName", "raceName", "driverRef", "forename", "surname", "grid", ], axis=1, inplace=True)
  
  # Update grid values to front-end
  for driver in drivers:
    driverId = driver['driverId']
    new_grid = int(driver['grid'])
    query.loc[query['driverId'] == driverId, 'grid'] = new_grid
  
  # One-hot encoded query
  final_columns = ['grid', 'year', 'round'] + list(dummy_data.columns)
  one_hot_encoded_data = pd.get_dummies(query, columns=categorical_cols)  
  one_hot_encoded_data = one_hot_encoded_data.reindex(columns=final_columns, fill_value=False)
  
  return one_hot_encoded_data

def model(year, round, drivers):
  # print(year)
  # print(round)
  # print(drivers)
  
  query = query_dataset(year, round, drivers)
  
  model = joblib.load('models/mlp_model.joblib')
  results = []
  
  for index, row in query.iterrows():
    prediction = model.predict(row.values.reshape(1,-1))
    results.append({"grid": row['grid'], "result": prediction[0]})

  # Get grid values of drivers
  paired_drivers = {driver['grid']: driver for driver in drivers}
  
  # Pair result grid value to drivers grid value
  sorted_drivers = [paired_drivers[result['grid']] for result in sorted(results, key=lambda x: x['result'])]
  # final_results = [driver['name'] for driver in sorted_drivers]
  return sorted_drivers
  
  