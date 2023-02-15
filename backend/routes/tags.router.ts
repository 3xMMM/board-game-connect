import express from 'express';
import { TagController } from '../features/tag/TagController';
import AppMiddleware from '../middleware/AppMiddleware';

const router = express.Router({ mergeParams: true });

router.get('/', (request, response) => {
    void TagController.getAll(request, response);
});

router.post('/', AppMiddleware.requireUserSession, (request, response) => {
    void TagController.postMany(request, response);
});

export default router;
