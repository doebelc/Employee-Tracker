DROP DATABASE IF EXISTS departments_db;
CREATE DATABASE departments_db;

-- Connect to the newly created database
\c departments_db;

-- Tables for the departments_db database
CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  department_name VARCHAR(100) NOT NULL
);

CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(30) UNIQUE NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT, 
  FOREIGN KEY (department_id) REFERENCES departments(id) --Connecting the role to the department
);

CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL, -- Connecting the employee to the role
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL -- Connecting the employee to the manager
);



-- DROP DATABASE IF EXISTS departments_db;
-- CREATE DATABASE departments_db;

-- -- Connect to the newly created database
-- \c departments_db;

-- -- Tables for the departments_db database
-- CREATE TABLE departments (
--   id SERIAL PRIMARY KEY,
--   department_name VARCHAR(100) NOT NULL
-- );

-- CREATE TABLE roles (
--   id SERIAL PRIMARY KEY,
--   title VARCHAR(100) NOT NULL,
--   salary DECIMAL NOT NULL,
--   department_id INT, 
--   FOREIGN KEY (department_id) REFERENCES departments(id) --Connecting the role to the department
-- );


-- CREATE TABLE employee (
--     id SERIAL PRIMARY KEY,
--     first_name VARCHAR(100) NOT NULL,
--     last_name VARCHAR(100) NOT NULL,
--     role_id INT,
--     manager_id INT,
--     FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL, -- Connecting the employee to the role
--     FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL -- Connecting the employee to the manager
-- );

-- select * from departments;


-- INSERT INTO departments (department_name)
-- VALUES ('Finance'),
--        ('Engineering'),
--        ('Sales'),
--        ('Human Resources'),
--        ('Legal');

-- INSERT INTO roles (title, salary, department_id)
-- VALUES  ('Accountant', 60000, 1),
--         ('Software Engineer', 80000, 2),
--         ('Salesperson', 50000, 3),
--         ('HR Specialist', 55000, 4),
--         ('Lawyer', 75000, 5),
--         ('Manager', 100000, 1),
--         ('Director', 120000, 2);

-- INSERT INTO employee (first_name, last_name, role_id, manager_id)
-- VALUES ('John', 'Wick', 1, 2),
--        ('Jane', 'Smith', 2, 3),
--        ('Alice', 'Johnson', 3, 3),
--        ('Bob', 'Dylan', 4, 1),
--        ('Charlie', 'Brown', 5, 4),
--        ('Tom', 'Brady', 6, 2),
--        ('Grace', 'Moore', 7, 4);

-- select * from departments;

-- select * from roles;

-- select * from employee;