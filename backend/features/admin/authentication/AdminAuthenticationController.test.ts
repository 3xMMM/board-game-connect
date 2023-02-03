import AdminAuthenticationController from './AdminAuthenticationController';
import bcrypt from 'bcrypt';
import AdminUser from '../user/AdminUser';
import AdminUserRepository from '../user/AdminUserRepository';
import AppSession, { AppSessionType } from '../../../utils/session';
import nodeMocksHttp from 'node-mocks-http';
import SpyInstance = jest.SpyInstance;

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(); // hide expected error logs
});

/**
 * @param rawPassword - The unhashed, raw password.
 */
const createTestUserWithPassword = (rawPassword: string = 'password') => {
    return new AdminUser({
        email: 'test.user@test.com',
        first_name: 'Test',
        id: 1,
        last_login: 'sometime',
        last_name: 'User',
        password: rawPassword,
        username: 'test.user',
    });
};

describe('the login handler', () => {
    const userRawPassword = 'password';
    const user = createTestUserWithPassword(userRawPassword);

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
    const setup = () => {
        const request = nodeMocksHttp.createRequest();
        const response = nodeMocksHttp.createResponse();
        const appSessionClear = jest.spyOn(AppSession, 'clear').mockImplementation((session: AppSessionType, callback: Function): void => {
            callback();
        });

        AdminAuthenticationController.logout(request, response);

        return {
            request,
            response,
            appSessionClear,
        };
    };

    it('clears the session', () => {
        const result = setup();
        expect(result.appSessionClear).toHaveBeenCalled();
    });
    it('returns a 200 response', () => {
        const result = setup();
        expect(result.response.statusCode).toEqual(200);
    });
});

describe('the session check handler', () => {
    describe('when a session is valid', () => {
        describe('when a user can be associated with the session', () => {
            const setup = async () => {
                const user = createTestUserWithPassword();
                const request = nodeMocksHttp.createRequest({
                    session: {
                        userId: user.id,
                        username: user.username,
                    },
                });
                const response = nodeMocksHttp.createResponse();
                const repositoryGetById = jest.spyOn(AdminUserRepository, 'getById').mockResolvedValue(user);
                await AdminAuthenticationController.sessionCheck(request, response);

                return {
                    request,
                    response,
                    user,
                    repositoryGetById,
                };
            };

            it('returns a 200 response', async () => {
                const result = await setup();
                expect(result.response.statusCode).toEqual(200);
            });

            describe('the response body', () => {
                it('has a `sessionIsValid` key with a value equal to the User\'s id', async () => {
                    const result = await setup();
                    expect(result.response._getData().sessionIsValid).toBeTruthy();
                });
                it('has a `user` key with a value of equal to the User\'s client-safe JSON object', async () => {
                    const result = await setup();
                    expect(result.response._getData().user).toEqual(result.user.toClientSafeJSON());
                });
            });
        });
        describe('when a user cannot be associated with the session', () => {
            const setup = async () => {
                const user = createTestUserWithPassword();
                const request = nodeMocksHttp.createRequest({
                    session: {
                        userId: user.id,
                        username: user.username,
                    },
                });
                const response = nodeMocksHttp.createResponse();
                const repositoryGetById = jest.spyOn(AdminUserRepository, 'getById').mockImplementation(async () => {
                    return await new Promise(() => {
                        throw new Error('User not found by ID');
                    });
                });
                await AdminAuthenticationController.sessionCheck(request, response);

                return {
                    request,
                    response,
                    user,
                    repositoryGetById,
                };
            };

            it('returns a 400 response', async () => {
                const result = await setup();
                expect(result.response.statusCode).toEqual(400);
            });
        });
    });

    describe('when a session is not valid', () => {
        const setup = async () => {
            const request = nodeMocksHttp.createRequest({
                session: {
                    userId: null,
                    username: '',
                },
            });
            const response = nodeMocksHttp.createResponse();
            await AdminAuthenticationController.sessionCheck(request, response);

            return {
                request,
                response,
            };
        };

        it('returns a 200 response', async () => {
            const result = await setup();
            expect(result.response.statusCode).toEqual(200);
        });
        describe('the response body', () => {
            it('has a `sessionIsValid` key with a value of `null`', async () => {
                const result = await setup();
                expect(result.response._getData().sessionIsValid).toEqual(null);
            });
            it('has a `user` key with a value of `{}', async () => {
                const result = await setup();
                expect(result.response._getData().user).toEqual({});
            });
        });
    });
});
