import express from 'express';
import routes from './routes';
import AppMiddleware from './middleware/AppMiddleware';

const app = express();
const port = process.env.PORT ?? 4000;

app.use(AppMiddleware.useCORS);
app.use(AppMiddleware.useSession);
app.use(express.json());
app.use(AppMiddleware.contentTypeIsJSONByDefault);

app.get('/', AppMiddleware.requireUserSession, (req, res) => {
    res.send('Logged in');
});

app.get('/', (req, res) => {
    res.send('You need to log in');
});

app.use('/api', routes);

// app.get('/api/admin/authentication/session-check', (request, response, next) => {
//     const sessionIsValid = request.session.userId !== null;
//     response.contentType('application/json');
//     response.status(200).send({
//         sessionIsValid,
//         // TODO Need to send the logged in user from here. Re-use the getter in the login
//     });
// });

app.listen(port, () => {
    console.log(`Server running on port ${port}, http://localhost:${port}`);
});
