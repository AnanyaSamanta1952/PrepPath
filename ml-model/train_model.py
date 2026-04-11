import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
import pickle

# 📊 Load dataset
df = pd.read_csv("placement.csv")   # your file name

# 🧹 Select columns
df = df[[
    "coding_skill_score",
    "projects_count",
    "mock_interview_score",
    "hackathons_participated",
    "internships_count",
    "study_hours_per_day",
    "placement_status"
]]

# 🔄 Convert output to numeric
df["placement_status"] = df["placement_status"].map({
    "Placed": 1,
    "Not Placed": 0
})

# ❗ Remove missing values (important)
df = df.dropna()

# 🎯 Features & target
X = df[[
    "coding_skill_score",
    "projects_count",
    "mock_interview_score",
    "hackathons_participated",
    "internships_count",
    "study_hours_per_day"
]]

y = df["placement_status"]

# ✂️ Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# 🤖 Train model
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

# 📈 Accuracy
y_pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))

# 💾 Save model
with open("model.pkl", "wb") as f:
    pickle.dump(model, f)

print("Model trained & saved!")