from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import os

app = Flask(__name__)
CORS(app)

# Path setup
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models")

# Load models
import joblib

txn_model = joblib.load(os.path.join(MODEL_PATH, "txn_model.pkl"))
msg_model = joblib.load(os.path.join(MODEL_PATH, "msg_model.pkl"))
web_model = joblib.load(os.path.join(MODEL_PATH, "web_model.pkl"))
vectorizer = joblib.load(os.path.join(MODEL_PATH, "vectorizer.pkl"))

# Health check
@app.route("/")
def home():
    return "AI Service Running 🚀"

# Transaction Fraud Detection
@app.route("/predict/transaction", methods=["POST"])
def predict_transaction():
    try:
        data = request.json.get("features")
        prediction = txn_model.predict([data])[0]

        return jsonify({
            "fraud": int(prediction),
            "type": "transaction"
        })
    except Exception as e:
        return jsonify({"error": str(e)})

# Message Fraud Detection
@app.route("/predict/message", methods=["POST"])
def predict_message():
    try:
        text = request.json.get("message")
        vec = vectorizer.transform([text])
        prediction = msg_model.predict(vec)[0]

        return jsonify({
            "fraud": int(prediction),
            "type": "message"
        })
    except Exception as e:
        return jsonify({"error": str(e)})

# Web Fraud Detection
@app.route("/predict/web", methods=["POST"])
def predict_web():
    try:
        features = request.json.get("features")
        prediction = web_model.predict([features])[0]

        return jsonify({
            "fraud": int(prediction),
            "type": "web"
        })
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(port=5000, debug=True)