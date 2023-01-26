import AdminUserRepository from '../../models/AdminUserRepository';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import AdminUser from '../../models/AdminUser';
import AppSession from '../../utils/session';

interface LoginRequest {
    username: string
    password: string
}

export const AdminAuthenticationController = {
    login: async (request: Request, response: Response) => {
        const requestBody: LoginRequest = request.body;
        try {
            const user = await AdminUserRepository.getByUsername(requestBody.username);
            const passwordMatch = await bcrypt.compare(requestBody.password, user.password);

            if (!passwordMatch) {
                throw new Error('Password mismatch');
            }

            AdminUserRepository.updateLastLogin(user);
            AppSession.regenerate(request.session, user.id, user.username);
            response.status(200).send(user.toClientSafeJSON());
        } catch (e) {
            console.error(e);
            response.status(400).send({
                message: 'Could not login. Please try again.',
            });
        }
    },

    logout: (request: Request, response: Response) => {
        AppSession.clear(request.session, () => {
            response.status(200).send({
                message: 'Logged out successfully',
            });
        });
    },

    /**
     * Returns the logged-in User if they have a valid session. Else, returns nothing.
     */
    sessionCheck: (request: Request, response: Response) => {
        const sessionIsValid = request.session.userId;
        const userId = request.session.userId as number;

        if (sessionIsValid) {
            AdminUserRepository.getById(userId)
                .then(result => {
                    response.status(200).send({
                        sessionIsValid,
                        user: result,
                    });
                    return;
                }).catch(e => {
                    console.error(e);
                    response.status(400).send({
                        message: 'Could not check login status. Please try again.',
                    });
                    return;
                });
        } else {
            response.status(200).send({
                sessionIsValid,
                user: {},
            });
        }
    },
};

export default AdminAuthenticationController;
