import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from sklearn.neural_network import MLPClassifier
import json

# This just contains the code from ME 2,
# mainly to just test out functionality with frontend
def model():
  path = "assets/animals.csv"
  df = pd.read_csv(path)

  data = df.drop(labels="class", axis=1)
  target = df[["class"]]

  x_train, x_test, y_train, y_test = train_test_split(data, target, random_state=420)
  scaler = MinMaxScaler()
  scaler.fit(data)
  scaler.transform(data)
  
  mlp = MLPClassifier(random_state=420)
  mlp.fit(x_train, y_train.values.ravel())
  
  predictions = mlp.predict(x_test)
  return json.dumps(predictions.tolist())