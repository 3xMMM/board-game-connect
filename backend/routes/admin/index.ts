import express from 'express';
import authenticationRouter from './authentication.router';

const router = express.Router({ mergeParams: true });

router.use('/authentication', authenticationRouter);

export default router;
