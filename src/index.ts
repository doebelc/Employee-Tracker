import { pool, connectToDb } from './connection.js';
import inquirer from 'inquirer';


async function main() {
    await connectToDb();

    try {
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: ['View all employees', 'View all roles', 'View all departments', 'Add an employee', 'Add a role', 'Add a department', 'Update an employee role']
            },
        ]);

        switch (answers.action) {
            case 'View all employees':
                await viewAllEmployees();
                break;
            case 'View all roles':
                await viewAllRoles();
                break;
            case 'View all departments':
                await viewAllDepartments();
                break;
            case 'Add an employee':
                await addEmployee();
                break;
            case 'Add a role':
                await addRole();
                break;
            case 'Add a department':
                await addDepartment();
                break;
            case 'Update an employee role':
                await updateEmployeeRole();
                break;
            default:
                console.log('Invalid action');
                break;
        }
    } catch (err) {
        console.error(err);
    }
}

// FUNCTION TO VIEW ALL EMPLOYEES
async function viewAllEmployees() {
    const employees = await pool.query('SELECT * FROM employee');
    console.table(employees);
}

// FUNCTION TO VIEW ALL ROLES
async function viewAllRoles() {
    const roles = await pool.query('SELECT * FROM role');
    console.table(roles);
}

// FUNCTION TO VIEW ALL DEPARTMENTS
async function viewAllDepartments() {
    const departments = await pool.query('SELECT * FROM department');
    console.table(departments);
}

// FUNCTION TO ADD AN EMPLOYEE
async function addEmployee() {
    const roles = await pool.query('SELECT * FROM role');
    const employees = await pool.query('SELECT * FROM employee');

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Enter employee first name:'
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Enter employee last name:'
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Select employee role:',
            choices: roles.map(role => ({ name: role.title, value: role.id }))
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'Select employee manager:',
            choices: employees.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }))
        }
    ]);

    await pool.query('INSERT INTO employee SET ?', answers);
    console.log('Employee added successfully');
}


// FUNCTION TO ADD A ROLE
async function addRole() {
    const departments = await pool.query('SELECT * FROM department');

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter role title:'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter role salary:'
        },
        {
            type: 'list',
            name: 'department_id',
            message: 'Select role department:',
            choices: departments.map(department => ({ name: department.name, value: department.id }))
        }
    ]);

    await pool.query('INSERT INTO role SET ?', answers);
    console.log('Role added successfully');
}


// FUNCTION TO ADD A DEPARTMENT
async function addDepartment() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter department name:'
        }
    ]);

    await pool.query('INSERT INTO department SET ?', answers);
    console.log('Department added successfully');
}


// FUNCTION TO UPDATE AN EMPLOYEE ROLE
async function updateEmployeeRole() {
    const employees = await pool.query('SELECT * FROM employee');
    const roles = await pool.query('SELECT * FROM role');

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee_id',
            message: 'Select employee to update:',
            choices: employees.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }))
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Select new role:',
            choices: roles.map(role => ({ name: role.title, value: role.id }))
        }
    ]);

    await pool.query('UPDATE employee SET role_id = ? WHERE id = ?', [answers.role_id, answers.employee_id]);
    console.log('Employee role updated successfully');
}


main();
