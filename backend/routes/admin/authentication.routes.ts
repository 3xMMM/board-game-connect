import express from 'express';
import AdminAuthenticationController from '../../controllers/admin/AdminAuthenticationController';

const router = express.Router({ mergeParams: true });

router.post('/login', (request, response) => {
    void AdminAuthenticationController.login(request, response);
});

router.post('/logout', AdminAuthenticationController.logout);

export default router;
