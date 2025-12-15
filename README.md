# 🎓 Exam Platform Backend 🚀

An intelligent examination platform that leverages Large Language Models (LLMs) to generate multiple-choice exams, perform automatic grading, and recommend learning courses and resources based on each user’s skill level.

The system enables students to track their progress and accumulated points across exams, providing continuous feedback on their learning journey.

Administrators can create structured assessments for each topic by generating three difficulty levels (easy, medium, and hard). Exam content can be produced either from an uploaded PDF or from a textual topic description. Admins also have full visibility into user performance, progress, and exam results.

## 🚀 Key Features

- **User Authentication:** Secure user registration and login using JWT (JSON Web Tokens).
- **Role-Based Access Control:** Differentiated access for admins and students, ensuring proper authorization for various functionalities.
- **Subject Management:** Admins can create, retrieve, update, and delete subjects.
- **Exam Management:** Creation, retrieval, and submission of exams with varying difficulty levels.
- **AI-Powered Question Generation:** Integration with Google Gemini via the `AIService` to dynamically generate multiple-choice questions.
- **User Statistics:** Comprehensive tracking of user progress, including exams taken, scores, and subject levels.
- **Exam Access Control:** Control access to exams based on user level and difficulty.
- **Error Handling:** Centralized error handling middleware for consistent error responses.
- **Rate Limiting:** Implemented to prevent abuse and ensure server stability.

## 🛠️ Tech Stack

- **Backend:**
    - Node.js
    - Express.js
- **Database:**
    - MongoDB
    - Mongoose (ODM)
- **Authentication:**
    - JSON Web Tokens (JWT)
    - bcryptjs (Password Hashing)
- **AI Integration:**
    - Google Gemini via `@google/generative-ai`
- **Middleware:**
    - cors
    - express-rate-limit
    - morgan
    - express-validator
- **Environment Variables:**
    - dotenv
- **Build Tools:**
    - npm

## 📦 Getting Started / Setup Instructions

### Prerequisites

- Node.js
- npm (Node Package Manager)
- MongoDB installed and running
- Google Cloud project with Gemini API enabled and API key

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/alyHusseinn/Examing-platform
    cd backend
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Create a `.env` file in the root directory and add the following environment variables:

    ```
    PORT=5000
    MONGO_URI=<Your MongoDB Connection String>
    JWT_SECRET=<Your JWT Secret Key>
    OPENAPI_ROUTER_API_KEY=<Your Gemini API Key>
    NODE_ENV=development
    ```

    Replace the placeholders with your actual values.

### Running Locally

1.  Start the development server:

    ```bash
    npm run dev
    ```

    This will start the server using `nodemon`, which automatically restarts the server on file changes.

2.  The server will be running at `http://localhost:5000` (or the port specified in your `.env` file).

## 📂 Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── examController.ts
│   │   ├── subjectController.ts
│   │   └── userController.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── checkRole.ts
│   │   └── errorHandler.ts
│   ├── models/
│   │   ├── Exam.ts
│   │   ├── Subject.ts
│   │   ├── User.ts
│   │   └── UserSubjectLevel.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── chatbot.ts
│   │   ├── exam.ts
│   │   ├── subject.ts
│   │   └── user.ts
│   ├── services/
│   │   └── gemini.ts
│   ├── server.ts
│   └── utils/
│       └── asyncHandler.ts
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

