import express from 'express';
import authenticationRoutes from './authentication.routes';

const router = express.Router({ mergeParams: true });

router.use('/authentication', authenticationRoutes);

export default router;
