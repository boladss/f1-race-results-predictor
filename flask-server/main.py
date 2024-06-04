from flask import Flask, jsonify, request
from flask_cors import CORS
from model_test import model

app = Flask(__name__)
cors = CORS(app, origins="*") 
# Enabled for all origins, change if deployed
# Note that client-side CORS is normally disabled on Firefox

years = [year for year in range(2022, 2025)]

# Mock data
races = {
    2022: ['Race 1', 'Race 2', 'Race 3'],
    2023: ['Race 1', 'Race 2', 'Race 3'],
    2024: ['Race 1', 'Race 2', 'Race 3']
}
drivers = {
    'Race 1': ['Driver A', 'Driver B', 'Driver C'],
    'Race 2': ['Driver D', 'Driver E', 'Driver F'],
    'Race 3': ['Driver G', 'Driver H', 'Driver I']
}

# Test API
@app.route("/", methods=['GET'])
def test():
  return model()

@app.route('/years', methods=['GET'])
def get_years():
  return jsonify(years)


@app.route('/races/<int:year>', methods=['GET'])
def get_races(year):
  return jsonify(races.get(year, []))


@app.route('/drivers/<string:race>', methods=['GET'])
def get_drivers(race):
  return jsonify(drivers.get(race, []))


@app.route('/predict', methods=['POST'])
def predict():
  data = request.json
  print(data['drivers'])
  data['drivers'].sort(reverse=True)
  return jsonify(data['drivers'])

if __name__ == "__main__":
  app.run(debug=True)
  