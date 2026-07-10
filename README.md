<b>Inspiration</b>

Most placement prep resources — LeetCode lists, YouTube playlists, generic "roadmaps" — tell you what to do but never tell you where you actually stand. As a student preparing for placements myself, I kept running into the same question: is solving 70 DSA problems and having 2 projects actually enough to get placed, or am I behind? There was no way to benchmark my own preparation against people who had actually been placed, and no easy way to learn from senior's real experiences instead of scattered, unverified advice. I wanted to build something that turns "am I ready?" into a data-backed answer instead of a guess.
<br>

<b>Solution</b>

PrepPath, a full-stack platform that combines real senior placement experiences with a machine learning model to give students an honest, personalized placement-readiness report.
1. Placed seniors can log their placement journey — company, DSA/interview/project/mock experience, and tips — building a searchable, filterable database of real experiences instead of generic advice.
2. Juniors enter their current stats (DSA problems solved, projects, mock interviews, internships, hackathons), and PrepPath runs them through a trained Logistic Regression model to predict placement probability and a readiness level (High/Medium/Low).
3. Beyond just a score, the app generates targeted suggestions by comparing the student against three signals: the aggregate training dataset of placed candidates, the seniors registered on the platform, and the closest-matching placed seniors (nearest-neighbor comparison) along with their actual tips.

Under the hood, this is three cooperating services: a React frontend for the UI, an Express/MongoDB backend for auth and business logic, and a separate Flask microservice that only serves the trained scikit-learn model — the Express backend calls it internally and merges the ML output with the dataset/senior comparisons before returning the final report.

<b>Technology Stack</b>

1. HTML
2. CSS
3. Javascript
4. React
5. Python
6. MongoDB
7. Node.js
8. Express 5

<b>Setup</b>

To get a local copy of the project up and running, follow these steps :
1. <b>Clone the repository:</b>

    ```
     Copy code
     git clone
     https://github.com/AnanyaSamanta1952/PrepPath
    ```
2. <b>Navigate into the frontend directory:</b>

    ```
      Copy code
      cd frontend
    ```
3. <b>Install frontend dependencies:</b>
    ```
      Copy code
      npm install
    ```
4. <b>Start the frontend server:</b>
    ```
      Copy code
      npm run dev
    ```
5. <b>Open your browser and navigate to</b>
     `http://localhost:5173` <b>to view the application</b>
6. <b>Navigate  into the backend directory:</b>
     ```
       Copy code
       cd backend
     ```
7. <b>Install backend dependencies and start server:</b>
    ```
       Copy code
       npm install
       npm start
    ```
8. <b>The backend server will start running at</b>
    ```
        http://localhost:5000
    ```
9. <b>Navigate  into the ml-model directory:</b>
     ```
       Copy code
       cd ml-model
     ```
10. <b>Install ml-model dependencies and start the server:</b>
    ```
       Copy code
      pip install flask scikit-learn pandas
      python predict.py 
    ```
