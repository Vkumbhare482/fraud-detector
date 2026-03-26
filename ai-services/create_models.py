import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import CountVectorizer
import numpy as np

# -------------------------
# Transaction Model
# -------------------------
X_txn = np.array([
    [1000, 1, 0, 0],
    [50000, 5, 1, 1],
    [200, 0, 0, 0],
    [70000, 3, 1, 1]
])
y_txn = np.array([0, 1, 0, 1])

txn_model = RandomForestClassifier()
txn_model.fit(X_txn, y_txn)

# -------------------------
# Message Model
# -------------------------
messages = ["win money now", "hello friend", "urgent transfer", "normal message"]
labels = [1, 0, 1, 0]

vectorizer = CountVectorizer()
X_msg = vectorizer.fit_transform(messages)

msg_model = RandomForestClassifier()
msg_model.fit(X_msg, labels)

# -------------------------
# Web Model
# -------------------------
X_web = np.array([
    [1, 1, 0],
    [0, 0, 0],
    [1, 0, 1],
    [0, 1, 0]
])
y_web = np.array([1, 0, 1, 0])

web_model = RandomForestClassifier()
web_model.fit(X_web, y_web)

# Save models
joblib.dump(txn_model, "models/txn_model.pkl")
joblib.dump(msg_model, "models/msg_model.pkl")
joblib.dump(web_model, "models/web_model.pkl")
joblib.dump(vectorizer, "models/vectorizer.pkl")

print("✅ Models created successfully!")