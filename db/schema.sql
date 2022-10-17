DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;



CREATE TABLE departments(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(30) NOT NULL,
)

CREATE TABLE roles(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    role_title VARCHAR(30) NOT NULL,
    salary DECIMAL
    REFERENCES departments(id)
)

CREATE TABLE employees (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  REFERENCES roles(id)
  --make an id for manager? DEFAULT 'NULL'
);