import express from 'express';
import routes from './routes';
import AppMiddleware from './middleware/AppMiddleware';

const app = express();
const port = process.env.PORT ?? 4000;

app.use(AppMiddleware.useCORS);
app.use(AppMiddleware.useSession);
app.use(AppMiddleware.useCookies);
app.use(AppMiddleware.contentTypeIsJSONByDefault);
app.use(express.json());

app.get('/', AppMiddleware.requireUserSession, (req, res) => {
    res.send('Logged in');
});

app.get('/', (req, res) => {
    res.send('You need to log in');
});

app.use('/api', routes);

app.listen(port, () => {
    console.log(`Server running on port ${port}, http://localhost:${port}`);
});
