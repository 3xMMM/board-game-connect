import express from 'express';
import authenticationRouter from './authentication.router';
import tagsRouter from './tags.router';

const router = express.Router({ mergeParams: true });

router.use('/authentication', authenticationRouter);
router.use('/tags', tagsRouter);

export default router;
