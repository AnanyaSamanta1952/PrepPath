from flask import Flask, request, jsonify
import pickle
import pandas as pd

app = Flask(__name__)

model = pickle.load(open("model.pkl", "rb"))

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        print("DATA RECEIVED:", data)

        features = pd.DataFrame([{
            "coding_skill_score": float(data.get("dsa", 0)),
            "projects_count": float(data.get("projects", 0)),
            "mock_interview_score": float(data.get("mock", 0)),
            "hackathons_participated": float(data.get("hackathons", 0)),
            "internships_count": float(data.get("internships", 0)),
            "study_hours_per_day": float(data.get("hours", 0))
        }])

        prediction = model.predict(features)[0]
        probability = model.predict_proba(features)[0][1]

        return jsonify({
            "prediction": int(prediction),
            "probability": float(probability)
        })

    except Exception as e:
        print("🔥 ERROR:", str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5001)