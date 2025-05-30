# <p align="center">🎓 StudentProgress API 📊</p>
<p align="center">
  <img src="assets/images/Logo%20StudentProgress.png" alt="StudentProgress Logo">
</p>

**StudentProgress** is a Spring Boot application for managing and tracking student data, including grades and academic status.  
It provides an API for registering, updating, and monitoring student records, calculating averages, and offering real-time insights into student performance.  
This helps educational institutions streamline their processes efficiently.

---

## ✨ Features
- 📌 Register and update student records
- 🧮 Automatically calculate grade averages
- 🌐 RESTful API design for easy integration
- 🔗 HATEOAS support for enhanced API navigation
- 🛠️ Database version control with Flyway

---

## 🚀 How to Use

1. **Clone the repository:**
   ```bash
   git clone git@github.com:henriiqueaze/StudentProgress.git
   cd StudentProgress
   ```

2. **Set up environment variables:**
   Copy the example file and customize it:
   ```bash
   cp .env.example .env
   ```

3. **Build the application (.jar) with Maven:**
   This step compiles the code and generates the .jar file inside the target/ folder:
   ```bash
   ./mvnw clean package
   ```

4. **Run the application using Docker Compose:**
   ```bash
   docker-compose up --build
   ```

5. **Access the API documentation (Swagger):**
   ```bash
   http://localhost:8080/swagger-ui.html
   ```

---

## 🔗 API Endpoints
- 🆕 `POST /student` - Register a new student  
- 📄 `GET /student` - Retrieve student details  
- ✏️ `PUT /student` - Update student information  
- ❌ `DELETE /student` - Remove a student record  
- 📊 `GET /student/average/{id}` - Get student grade average
- 🧮 `GET /student/filter/{status}` — Filter students by academic status

---

## 🌐 CORS Configuration

This API supports **CORS (Cross-Origin Resource Sharing)** to enable integration with front-end applications hosted on different domains.

CORS is configured globally in the backend using the following setup:
- Allowed Origins: Defined via CORS_ALLOWED_ORIGINS
- Allowed Methods: All (GET, POST, PUT, DELETE, etc.)
- Credentials: Enabled (allowCredentials=true) — supports cookies and authorization headers

In your .env file, define:
```bash
CORS_ALLOWED_ORIGINS=http://localhost:3000
   ```

To allow multiple domains, separate them with commas:
```bash
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend.com
   ```

---

## 🛠️ Technologies Used
- ☕ Java (Spring Boot)  
- 🗄️ MySQL (Database)  
- 🏗️ Hibernate (ORM)  
- 🔗 HATEOAS (Hypermedia API support)  
- 🧪 JUnit (Testing framework) 
- 📂 Flyway (Database migrations)  
- 🐳 Docker & Docker Compose  
- 📑 Swagger (API documentation)  

---

## 📜 License
This project is licensed under the MIT License.  
Feel free to use and modify it according to your needs.

---

For contributions or support, please contact me via email at [henriqueeaze.dev@gmail.com](mailto:henriqueeaze.dev@gmail.com)  
or connect with me on [LinkedIn](https://www.linkedin.com/in/henrique-azevedo-b2195b2b0/).