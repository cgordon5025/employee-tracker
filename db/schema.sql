DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;
CREATE TABLE departments(
   id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(30) NOT NULL
);

CREATE TABLE roles(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    role_title VARCHAR(30) NOT NULL,
    salary DECIMAL
);

CREATE TABLE employees (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  manager_id INT DEFAULT NULL,
  FOREIGN KEY(manager_id) REFERENCES employees(id) ON DELETE SET NULL,
  dept_id INT,
  FOREIGN KEY(dept_id) REFERENCES departments(id) ON DELETE SET NULL,
  role_id INT,
  FOREIGN KEY(role_id) REFERENCES roles(id) ON DELETE SET NULL
);
