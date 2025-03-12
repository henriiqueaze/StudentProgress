# <p align="center">🎓 StudentProgress API 📊</p>
<p align="center">
  <img src="assets/images/Logo%20StudentProgress.png" alt="StudentProgress Logo">
</p>

StudentProgress is a Spring Boot application for managing and tracking student data, including grades and academic status. It provides an API for registering, updating, and monitoring student records, calculating averages, and offering real-time insights into student performance. This helps educational institutions streamline their processes efficiently.

## ✨ Features
- 📌 Register and update student records
- 📊 Monitor academic performance in real-time
- 🧮 Calculate grade averages automatically
- 🔒 Secure authentication and authorization
- 🌐 RESTful API design for easy integration
- 🔗 HATEOAS support for enhanced API navigation
- 🛠️ Database version control with Flyway
  
## 🚀 How to use

1. Clone the repository:
   ```sh
   git clone git@github.com:henriiqueaze/StudentProgress.git
   cd StudentProgress
   ```
2. **Set up environment variables:**
   Create a `.env` file and define your database credentials:
    ```bash
    DB_USERNAME=root
    DB_PASSWORD=yourpassword
    ```

3. **Build the project:**
    ```bash
    mvn clean install
    ```

4. **Run the project:**
    ```bash
    mvn spring-boot:run
    ```

## 🔗 API Endpoints
- 🆕 `POST /student` - Register a new student
- 📄 `GET /student` - Retrieve student details
- ✏️ `PUT /student` - Update student information
- ❌ `DELETE /student` - Remove a student record
- 📊 `GET /student/average/{id}` - Retrieve the student's grade average

## 🛠️ Technologies Used
- ☕ Java (Spring Boot)
- 🗄️ MySQL (Database)
- 🏗️ Hibernate (ORM)
- 🔗 HATEOAS (Hypermedia API support)
- 📂 Flyway (Database migrations)

## 📜 License
This project is licensed under the MIT License. Feel free to use and modify it according to your needs.

---
For contributions or support, please contact the development team or open an issue in the repository.

