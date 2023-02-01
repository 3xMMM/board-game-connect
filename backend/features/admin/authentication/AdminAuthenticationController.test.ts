import AdminAuthenticationController from './AdminAuthenticationController';
import bcrypt from 'bcrypt';
import AdminUser from '../user/AdminUser';
import AdminUserRepository from '../user/AdminUserRepository';
import AppSession from '../../../utils/session';
import nodeMocksHttp from 'node-mocks-http';
import SpyInstance = jest.SpyInstance;

afterEach(() => {
    jest.clearAllMocks();
});

describe('the login handler', () => {
    const userRawPassword = 'password';
    const user = new AdminUser({
        email: 'test.user@test.com',
        first_name: 'Test',
        id: 1,
        last_login: 'sometime',
        last_name: 'User',
        password: userRawPassword, // will be hashed in the setup function
        username: 'test.user',
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('a successful login', () => {
        const request = nodeMocksHttp.createRequest({
            body: {
                username: user.username,
                password: user.password,
            },
        });
        const response = nodeMocksHttp.createResponse();

        let updateLastLogin: SpyInstance;
        let sessionRegenerate: SpyInstance;

        beforeEach(async () => {
            updateLastLogin = jest.spyOn(AdminUserRepository, 'updateLastLogin').mockImplementation();
            sessionRegenerate = jest.spyOn(AppSession, 'regenerate').mockImplementation();
            user.password = await bcrypt.hash(userRawPassword, 10);
            jest.spyOn(AdminUserRepository, 'getByUsername').mockResolvedValueOnce(user);
            await AdminAuthenticationController.login(request, response);
        });

        it('updates the last login date for the User', () => {
            expect(updateLastLogin).toHaveBeenCalled();
        });
        it('creates/regenerates the session for the User', () => {
            expect(sessionRegenerate).toHaveBeenCalled();
        });
        it('returns a 200 response', () => {
            expect(response.statusCode).toEqual(200);
        });
        it('returns the logged-in User in a client-safe JSON format', () => {
            const jsonResponse = response._getData();
            expect(jsonResponse).toEqual(user.toClientSafeJSON());
        });
    });

    describe('an unsuccessful login with a user that does not exist', () => {
        const request = nodeMocksHttp.createRequest({
            body: {
                username: 'wrong_username',
                password: user.password,
            },
        });
        const response = nodeMocksHttp.createResponse();

        beforeEach(async () => {
            jest.spyOn(console, 'error').mockImplementation(); // hide expected error logs
            user.password = await bcrypt.hash(userRawPassword, 10);
            // @ts-expect-error
            jest.spyOn(AdminUserRepository, 'getByUsername').mockResolvedValueOnce(() => {
                throw new Error('User not found by Username');
            });
            await AdminAuthenticationController.login(request, response);
        });

        it('returns a 400 response', () => {
            expect(response.statusCode).toEqual(400);
        });
        it('does not return anything in the response body', () => {
            const jsonResponse = response._getData();
            expect(jsonResponse).not.toEqual(user.toClientSafeJSON());
        });
    });

    describe('an unsuccessful login with the wrong password', () => {
        const request = nodeMocksHttp.createRequest({
            body: {
                username: user.username,
                password: 'wrong_password',
            },
        });
        const response = nodeMocksHttp.createResponse();

        beforeEach(async () => {
            jest.spyOn(console, 'error').mockImplementation(); // hide expected error logs
            user.password = await bcrypt.hash(userRawPassword, 10);
            jest.spyOn(AdminUserRepository, 'getByUsername').mockResolvedValueOnce(user);
            await AdminAuthenticationController.login(request, response);
        });

        it('returns a 400 response', () => {
            expect(response.statusCode).toEqual(400);
        });
        it('does not return anything in the response body', () => {
            const jsonResponse = response._getData();
            expect(jsonResponse).not.toEqual(user.toClientSafeJSON());
        });
    });
});

describe('the logout handler', () => {
    // TODO
});

describe('the session check handler', () => {
    // TODO
});
