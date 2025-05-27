CREATE TABLE IF NOT EXISTS students (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  birthDate DATE NOT NULL,
  cpf VARCHAR(255),
  email VARCHAR(255),
  registration VARCHAR(255) NOT NULL,
  course VARCHAR(255) NOT NULL,
  class_school VARCHAR(255) NOT NULL,
  notes double precision[] NOT NULL);