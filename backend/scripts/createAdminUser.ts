import prompts, { PromptObject } from 'prompts';
import { Client } from 'pg';
import bcrypt from 'bcrypt';

console.log('Creating an Admin User...');

interface PromptAnswers {
    firstName: string
    lastName: string
    email: string
    username: string
    password: string
}

const questions: PromptObject[] = [
    {
        type: 'text',
        name: 'firstName',
        message: 'What is the User\'s first name?',
    },
    {
        type: 'text',
        name: 'lastName',
        message: 'What is the User\'s last name?',
    },
    {
        type: 'text',
        name: 'email',
        message: 'What is the User\'s email?',
    },
    {
        type: 'text',
        name: 'username',
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        initial: (prev, values, prompt) => `${values.firstName.toLowerCase()}.${values.lastName.toLowerCase()}`,
        message: 'What is the User\'s username? This will be used for logging in.',
    },
    {
        type: 'text',
        name: 'password',
        message: 'What is the User\'s password? This will be used for logging in.',
    },
];

void (async () => {
    const response = await prompts(questions) as PromptAnswers;

    if (Object.values(response).some(value => value.length === 0)) {
        console.error('❌  All fields are required and cannot be empty. Please try again and fill out all fields.');
        return;
    }

    bcrypt.hash(response.password, 10, async (err, encrypted) => {
        if (err) {
            console.error(err);
            return;
        }

        response.password = encrypted;

        const client = new Client({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: parseInt(process.env.DB_PORT ?? '5432'),
        });

        await client.connect();

        const query = {
            text: 'INSERT INTO admin_users(first_name, last_name, email, username, password) ' +
                'VALUES($1, $2, $3, $4, $5)',
            values: Object.values(response),
        };

        client.query(query, (err, res) => {
            if (err) {
                console.error('❌  User was not added. See below error:');
                console.log(err.stack);
                process.exit(1);
            } else {
                console.log('✔️  User was added successfully');
                process.exit();
            }
        });
    });
})();
