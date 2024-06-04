from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
from model_test import model

app = Flask(__name__)
cors = CORS(app, origins="*") 
# Enabled for all origins, change if deployed
# Note that client-side CORS is normally disabled on Firefox

years = [year for year in range(2014, 2024)]
drivers = pd.read_csv("assets/drivers.csv")
races = pd.read_csv("assets/races.csv")
results = pd.read_csv("assets/results-dataset.csv")

# Mock data
# races = {
#     2022: ['Race 1', 'Race 2', 'Race 3'],
#     2023: ['Race 1', 'Race 2', 'Race 3'],
#     2024: ['Race 1', 'Race 2', 'Race 3']
# }
# drivers = {
#     'Race 1': ['Driver A', 'Driver B', 'Driver C'],
#     'Race 2': ['Driver D', 'Driver E', 'Driver F'],
#     'Race 3': ['Driver G', 'Driver H', 'Driver I']
# }

# Test API
@app.route("/", methods=['GET'])
def test():
  return model()

@app.route('/years', methods=['GET'])
def get_years():
  return jsonify(years)


@app.route('/races/<int:year>', methods=['GET'])
def get_races(year):
  races_in_year = races.loc[races['year'] == year, ['round', 'name']]
  races_data = races_in_year.to_dict(orient='records')
  # print(races_data)
  # races_data = races_in_year['name'].tolist()
  return jsonify(races_data)


@app.route('/drivers/<int:year>/<int:race>', methods=['GET'])
def get_drivers(year, race):
  drivers_in_race = results.loc[(results['year'] == year) & (results['round'] == race), ['driverId', 'grid', 'forename', 'surname']]
  drivers_in_race['name'] = drivers_in_race['forename'] + " " + drivers_in_race['surname']
  drivers_in_race.drop(['forename', 'surname'], axis=1, inplace=True)
  drivers_data = drivers_in_race.to_dict(orient='records')
  # print(drivers_data)
  return jsonify(drivers_data)


@app.route('/predict', methods=['POST'])
def predict():
  data = request.json
  print(data)
  return jsonify(data['drivers'])
  # return jsonify(data['drivers'])

if __name__ == "__main__":
  app.run(debug=True)
  