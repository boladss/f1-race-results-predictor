# f1-race-results-predictor
 A machine learning model to predict full race results in Formula 1

## What does this predict?
For a specific race in a given season (e.g., the **2021 Abu Dhabi Prix**), the user can rearrange the drivers on the starting grid, and the model will predict the final results of all of the drivers.

## How do I use this predictor?
**Note:** These instructions assume you are using a Windows device. Some commands may differ between operating systems (e.g., `python` vs. `python3`). It also assumes that you already have `npm` and `flask` installed properly.

1. Clone the repository.
2. Navigate into `f1-race-results-predictor`.

### Front-end
3. Navigate into `/client`.
4. Install the necessary dependencies using `npm install`.
5. Build the web app for production using `npm run build`.
6. Launch the front-end local web server using `npm run preview`.

### Back-end
7. Navigate back into the root directory `f1-race-results-predictor`.
8. Navigate into `/flask-server`.
9. Activate the Python virtual environment (for necessary packages) using `./venv/Scripts/activate`.
10. Launch the back-end local web server using `python main.py`.

### Final steps
11. Make sure that both servers are running (from experience, typically `http://localhost:4173` for React and `http://localhost:5000` for Flask).
  - If there are any differences in the ports, make the necessary adjustments.
  - Particularly, changing the following to the appropriate Flask port:
    - `proxy` under `/client/package.json`
    - `flaskServer` under `/client/src/App.tsx`

Great! After following those steps, you should now be seeing the main interface for the machine learning model.