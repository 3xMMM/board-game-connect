import AdminUserRepository from '../user/AdminUserRepository';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import AppSession from '../../../utils/session';

export interface AdminLoginRequest {
    username: string
    password: string
}

export const AdminAuthenticationController = {
    login: async (request: Request, response: Response) => {
        const requestBody: AdminLoginRequest = request.body;
        try {
            const user = await AdminUserRepository.getByUsername(requestBody.username);
            const passwordMatch = await bcrypt.compare(requestBody.password, user.password);

            if (!passwordMatch) {
                throw new Error('Password mismatch');
            }

            AdminUserRepository.updateLastLogin(user);
            AppSession.regenerate(request.session, user.id, user.username);
            return response.status(200).send(user.toClientSafeJSON());
        } catch (e) {
            console.error(e);
            return response.status(400).send({
                message: 'Could not login. Please try again.',
            });
        }
    },

    logout: (request: Request, response: Response) => {
        AppSession.clear(request.session, () => {
            return response.status(200).send({
                message: 'Logged out successfully',
            });
        });
    },

    /**
     * Returns the logged-in User if they have a valid session. Else, returns nothing.
     */
    sessionCheck: async (request: Request, response: Response) => {
        const sessionIsValid = request.session.userId;
        const userId = request.session.userId as number;

        if (sessionIsValid) {
            try {
                const user = await AdminUserRepository.getById(userId);
                return response.status(200).send({
                    sessionIsValid,
                    user: user.toClientSafeJSON(),
                });
            } catch (e) {
                console.error(e);
                return response.status(400).send({
                    message: 'Could not check session status. Please try again.',
                });
            }
        } else {
            return response.status(200).send({
                sessionIsValid,
                user: {},
            });
        }
    },
};

export default AdminAuthenticationController;
