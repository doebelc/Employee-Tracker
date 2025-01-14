INSERT INTO departments (department_name)
VALUES ('Finance'),
       ('Engineering'),
       ('Sales'),
       ('Human Resources'),
       ('Legal');

INSERT INTO roles (title, salary, department_id)
VALUES  ('Accountant', 60000, 1),
        ('Software Engineer', 80000, 2),
        ('Salesperson', 50000, 3),
        ('HR Specialist', 55000, 4),
        ('Lawyer', 75000, 5),
        ('Manager', 100000, 1),
        ('Director', 120000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Wick', 1, 2),
       ('Jane', 'Smith', 2, 3),
       ('Alice', 'Johnson', 3, 3),
       ('Bob', 'Dylan', 4, 1),
       ('Charlie', 'Brown', 5, 4),
       ('Tom', 'Brady', 6, 2),
       ('Grace', 'Moore', 7, 4);

