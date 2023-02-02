import express from 'express';
import admin from './admin';

const router = express.Router({ mergeParams: true });

// simple logger for this router's requests
// all requests to this router will first hit this middleware
router.use((req, res, next) => {
    console.log('%s %s', req.method, req.url);
    next();
});

router.use('/admin', admin);

export default router;
