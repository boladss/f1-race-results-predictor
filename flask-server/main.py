from flask import Flask, jsonify
from flask_cors import CORS
from model_test import model

app = Flask(__name__)
cors = CORS(app, origins="*") 
# Enabled for all origins, change if deployed
# Note that client-side CORS is normally disabled on Firefox

# Test API
@app.route("/api/test", methods=['GET'])
def test():
    
  return model()

if __name__ == "__main__":
  app.run(debug=True)
  