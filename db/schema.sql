DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;
CREATE TABLE departments(
   id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(30) NOT NULL
);

CREATE TABLE roles(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    dept_id INT,
    role_title VARCHAR(30) NOT NULL,
    salary DECIMAL
);

CREATE TABLE employees (
  employee_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  dept_id INT,
  FOREIGN KEY(dept_id) REFERENCES departments(id),
  role_id INT,
  FOREIGN KEY(role_id) REFERENCES roles(id)
);

