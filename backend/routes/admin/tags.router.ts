import express from 'express';
import { TagController } from '../../features/tag/TagController';

const router = express.Router({ mergeParams: true });

router.get('/', (request, response) => {
    void TagController.getAll(request, response);
});

export default router;