Tech Stack & Architecture
Frontend: React (Bootstrapped with Vite), React Router DOM, Tailwind CSS.
Backend: Java 17, Spring Boot 3, Spring Data JPA, H2 In-Memory Database.
Please refer to the architecture diagrams and system design documentation available under the /docs folder for full structural details.

Setup & Installation Instructions
Prerequisites: Node.js (v18+) and Java 17.
Running the Backend (Spring Boot): Open a terminal and navigate to the backend directory. Run the application using the Maven wrapper command: ./mvnw spring-boot:run. Upon startup, the CommandLineRunner will automatically seed the database with dummy data. You can access the H2 Database Console by navigating to http://localhost:8080/h2-console in your browser (JDBC URL: jdbc:h2:mem:testdb, Username: sa, Password left blank).
Running the Frontend (React): Open a new, separate terminal and navigate to the frontend directory. Install the dependencies by running: npm install. Start the development server by running: npm run dev. Open http://localhost:5173 in your browser to access the dashboard.

API Documentation
The system follows best REST practices, utilizing strict JSON Request and Response DTOs, proper HTTP status codes, and global exception handling. The Spring Boot backend exposes three primary REST endpoints:
GET /api/v1/portfolio : Retrieves the complete portfolio including Investor details, Products, and Withdrawal History.
POST /api/v1/withdrawals : Accepts a JSON payload, validates business rules, deducts balance, and records a notice.
GET /api/v1/withdrawals/export : Generates and downloads a raw .csv file of all historical withdrawal transactions.

Screenshots
Screenshots of the fully operational system, including the generic UI and the withdrawal flow, are included in the repository for review.

AI Usage Disclosure
Disclosure: AI assistance tools (Google Antigravity / Gemini) were utilized during the development of this project. One can also make use of spec-driven development for the sake of efficiency, but in this case, the AI was used exclusively to accelerate development by generating repetitive scaffolding, writing boilerplate configuration (such as standard pom.xml dependencies and basic Vite setup), and drafting baseline unit test templates. The core architectural decisions, business logic implementation, strict constraint enforcement, and project structure were manually directed and heavily audited to ensure absolute compliance with the assessment requirements.
