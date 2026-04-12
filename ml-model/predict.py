from flask import Flask, request, jsonify
import pickle
import numpy as np

app = Flask(__name__)

# load model
model = pickle.load(open("model.pkl", "rb"))

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    features = np.array([[
        data["dsa"],
        data["projects"],
        data["mock"],
        data["hackathons"],
        data["internships"],
        data["hours"]   # if using
    ]])

    prediction = model.predict(features)[0]
    probability = model.predict_proba(features)[0][1]

    return jsonify({
        "prediction": int(prediction),
        "probability": float(probability)
    })

if __name__ == "__main__":
    app.run(port=5001)