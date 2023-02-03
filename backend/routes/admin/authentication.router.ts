import express from 'express';
import AdminAuthenticationController from '../../features/admin/authentication/AdminAuthenticationController';

const router = express.Router({ mergeParams: true });

router.post('/login', (request, response) => {
    void AdminAuthenticationController.login(request, response);
});
router.post('/logout', AdminAuthenticationController.logout);
router.get('/session-check', (request, response) => {
    void AdminAuthenticationController.sessionCheck(request, response);
});

export default router;
