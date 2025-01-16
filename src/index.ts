import { pool, connectToDb } from './connection.js';
import inquirer from 'inquirer';
import { Pool } from 'pg';


async function main(): Promise<void> {
    await connectToDb();

    try {
        const answers: { action: string } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: [
                    'View all employees',
                    'View all roles',
                    'View all departments',
                    'Add an employee',
                    'Add a role',
                    'Add a department',
                    'Update an employee role'
                ]
            },
        ]);

        switch (answers.action) {
            case 'View all employees':
                await viewAllEmployees(pool);
                break;
            case 'View all roles':
                await viewAllRoles(pool);
                break;
            case 'View all departments':
                await viewAllDepartments(pool);
                break;
            case 'Add an employee':
                await addEmployee(pool);
                break;
            case 'Add a role':
                await addRole(pool);
                break;
            case 'Add a department':
                await addDepartment(pool);
                break;
            case 'Update an employee role':
                await updateEmployeeRole(pool);
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
async function viewAllEmployees(pool: Pool): Promise<void> {
    try {
        const result = await pool.query('SELECT * FROM employee');
        const employees = result.rows;

        // Check if there are employees to display
        if (employees.length > 0) {
            console.log('Employee Data:');
            employees.forEach((employee) => {
                console.log(`ID: ${employee.id}, Name: ${employee.first_name} ${employee.last_name}, Role ID: ${employee.role_id}, Manager ID: ${employee.manager_id || 'N/A'}`);
            });
        } else {
            console.log('No employees found.');
        }
    } catch (error) {
        console.error('Error fetching employee data:', error);
    }
}

// Call the function to view all employees
viewAllEmployees(pool);

// FUNCTION TO VIEW ALL ROLES
async function viewAllRoles(pool: Pool): Promise<void> {
    try {
        const result = await pool.query('SELECT * FROM role');
        const roles = result.rows;
        console.log(roles);
    } catch (error) {
        console.error('Error fetching role data:', error);
    } finally {
        await pool.end();
    }
}

// Call the function to view all roles
viewAllRoles(pool);

// FUNCTION TO VIEW ALL DEPARTMENTS
async function viewAllDepartments(pool: Pool): Promise<void> {
    try {
        const result = await pool.query('SELECT * FROM department'); // Adjust the table name as needed
        const departments = result.rows; // Get the rows from the result
        console.log(departments); // Display the department data
    } catch (error) {
        console.error('Error fetching department data:', error);
    } finally {
        await pool.end(); // Close the pool connection when done
    }
}

// // Call the function to view all departments
viewAllDepartments(pool);

// FUNCTION TO ADD AN EMPLOYEE
interface Employee {
    firstName: string;
    lastName: string;
    roleId: number;
    managerId?: number | undefined;
}

async function addEmployee(pool: Pool): Promise<void> {
    try {
        const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: 'Enter the employee\'s first name:',
                validate: (input) => input ? true : 'First name cannot be empty.',
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'Enter the employee\'s last name:',
                validate: (input) => input ? true : 'Last name cannot be empty.',
            },
            {
                type: 'input',
                name: 'roleId',
                message: 'Enter the employee\'s role ID:',
                validate: (input) => !isNaN(Number(input)) ? true : 'Role ID must be a number.',
            },
            {
                type: 'input',
                name: 'managerId',
                message: 'Enter the employee\'s manager ID (optional):',
                validate: (input) => input === '' || !isNaN(Number(input)) ? true : 'Manager ID must be a number or left empty.',
            },
        ]);

        const employee: Employee = {
            firstName,
            lastName,
            roleId: Number(roleId),
            managerId: managerId ? Number(managerId) : undefined,
        };

        const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)';
        const values = [employee.firstName, employee.lastName, employee.roleId, employee.managerId];

        await pool.query(query, values);
        console.log(`Employee ${employee.firstName} ${employee.lastName} added successfully!`);

    } catch (error) {
        console.error('Error adding employee:', error);
    }
}
// Call the function to add an employee
addEmployee(pool);


// FUNCTION TO ADD A ROLE
async function addRole(pool: Pool): Promise<void> {
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
            choices: departments.rows.map(department => ({ name: department.name, value: department.id }))
        }
    ]);

    const query = 'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)';
    const values = [answers.title, answers.salary, answers.department_id];
    await pool.query(query, values);
    console.log('Role added successfully');
}
addRole(pool);

// FUNCTION TO ADD A DEPARTMENT
async function addDepartment(pool: Pool): Promise<void> {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter department name:'
        }
    ]);

    await pool.query('INSERT INTO department (name) VALUES ($1)', [answers.name]);
    console.log('Department added successfully');
}
addDepartment(pool);


// FUNCTION TO UPDATE AN EMPLOYEE ROLE
async function updateEmployeeRole(pool: Pool): Promise<void> {
    const employeesResult = await pool.query('SELECT * FROM employee');
    const rolesResult = await pool.query('SELECT * FROM role');

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee_id',
            message: 'Select employee to update:',
            choices: employeesResult.rows.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }))
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Select new role:',
            choices: rolesResult.rows.map(role => ({ name: role.title, value: role.id }))
        }
    ]);

    await pool.query('UPDATE employee SET role_id = ? WHERE id = ?', [answers.role_id, answers.employee_id]);
    console.log('Employee role updated successfully');
}
updateEmployeeRole(pool);


main();
