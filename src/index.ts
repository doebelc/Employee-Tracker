import { pool, connectToDb } from './connection.js';
import inquirer from 'inquirer';

await connectToDb();

// inquirer
//     .prompt([
//         {
//             type: 'list',
//             name: 'action',
//             message: 'What would you like to do?',
//             choices: ['View all employees', 'View all roles', 'View all departments', 'Add an employee', 'Add a role', 'Add a department', 'Update an employee role']
//         },
//     ])
//     .then((answers) => {
//         console.log(answers);
//     })
//     .catch((err) => {
//         console.error(err);
//     });

async function main() {
    try {
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: ['View all employees', 'View all roles', 'View all departments', 'Add an employee', 'Add a role', 'Add a department', 'Update an employee role']
            },
        ]);
        console.log('Hello,', answers.username);
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
