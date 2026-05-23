import pandas as pd
import json

# load dataset
df = pd.read_csv("placement.csv")

# convert placement labels into numbers
df["placement_status"] = df["placement_status"].map({
    "Placed": 1,
    "Not Placed": 0
})

stats = {

    "avg_dsa":
        float(df["coding_skill_score"].mean()),

    "avg_projects":
        float(df["projects_count"].mean()),

    "avg_mock":
        float(df["mock_interview_score"].mean()),

    "avg_internships":
        float(df["internships_count"].mean()),

    "avg_hackathons":
        float(df["hackathons_participated"].mean()),

    "avg_study_hours":
        float(df["study_hours_per_day"].mean()),

    "placement_rate":
        float(df["placement_status"].mean())
}

# success rate with internships
internship_success = df[
    df["internships_count"] > 0
]["placement_status"].mean()

stats["internship_success_rate"] = float(internship_success)

# success rate with hackathons
hackathon_success = df[
    df["hackathons_participated"] > 0
]["placement_status"].mean()

stats["hackathon_success_rate"] = float(hackathon_success)

# average DSA of placed students
placed_students = df[df["placement_status"] == 1]

stats["placed_avg_dsa"] = float(
    placed_students["coding_skill_score"].mean()
)

stats["placed_avg_projects"] = float(
    placed_students["projects_count"].mean()
)

stats["placed_avg_mock"] = float(
    placed_students["mock_interview_score"].mean()
)

# save json
with open("dataset_stats.json", "w") as f:
    json.dump(stats, f, indent=4)

print("Dataset stats generated successfully!")