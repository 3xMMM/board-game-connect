import nodeMocksHttp from 'node-mocks-http';
import { AppSession, AppSessionType } from './session';

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(); // hide expected error logs
});

describe('the regenerate function', () => {
    describe('a successful regeneration', () => {
        const userId = 1;
        const username = 'test.user';
        const setup = () => {
            const request = nodeMocksHttp.createRequest({
                session: {
                    save: jest.fn((callbackFunction?: (err: any) => void): AppSessionType => {
                        if (callbackFunction) {
                            callbackFunction(null);
                        }
                        return request.session;
                    }),
                    regenerate: jest.fn((callbackFunction: (err: any) => void): AppSessionType => {
                        callbackFunction(null);
                        return request.session;
                    }),
                },
            });

            const sessionRegenerate = jest.spyOn(request.session, 'regenerate');
            const sessionSave = jest.spyOn(request.session, 'save');

            AppSession.regenerate(request.session, userId, username);

            return {
                request,
                sessionRegenerate,
                sessionSave,
            };
        };

        it('regenerates the session', () => {
            const result = setup();
            expect(result.sessionRegenerate).toHaveBeenCalled();
        });
        it('sets the session\'s `userId` to the provided userId', () => {
            const result = setup();
            expect(result.request.session.userId).toEqual(userId);
        });
        it('sets the session\'s `username` to the provided username', () => {
            const result = setup();
            expect(result.request.session.username).toEqual(username);
        });
        it('saves the session', () => {
            const result = setup();
            expect(result.sessionSave).toHaveBeenCalled();
        });
    });

    describe('an unsuccessful regeneration due to a failed session.regenerate() call', () => {
        const userId = 1;
        const username = 'test.user';
        const setup = () => {
            const request = nodeMocksHttp.createRequest({
                session: {
                    save: jest.fn((callbackFunction?: (err: any) => void): AppSessionType => {
                        if (callbackFunction) {
                            callbackFunction(null);
                        }
                        return request.session;
                    }),
                    regenerate: jest.fn((callbackFunction: (err: any) => void): AppSessionType => {
                        callbackFunction('something broke here');
                        return request.session;
                    }),
                },
            });

            const sessionRegenerate = jest.spyOn(request.session, 'regenerate');
            const sessionSave = jest.spyOn(request.session, 'save');

            AppSession.regenerate(request.session, userId, username);

            return {
                request,
                sessionRegenerate,
                sessionSave,
            };
        };

        it('throws an error', () => {
            expect(() => {
                setup();
            }).toThrowError();
        });
    });
});

describe('the clear function', () => {
    describe('a successful clear', () => {
        const userId = 1;
        const username = 'test.user';

        const setup = () => {
            const request = nodeMocksHttp.createRequest({
                session: {
                    userId,
                    username,
                    save: jest.fn((callbackFunction?: (err: any) => void): AppSessionType => {
                        if (callbackFunction) {
                            callbackFunction(null);
                        }
                        return request.session;
                    }),
                    regenerate: jest.fn((callbackFunction: (err: any) => void): AppSessionType => {
                        callbackFunction(null);
                        return request.session;
                    }),
                },
            });

            const sessionRegenerate = jest.spyOn(request.session, 'regenerate');
            const sessionSave = jest.spyOn(request.session, 'save');
            const localCallbackFunction = jest.fn();

            AppSession.clear(request.session, localCallbackFunction);

            return {
                request,
                sessionRegenerate,
                sessionSave,
                localCallbackFunction,
            };
        };

        it('clears the `userId` session variable', () => {
            const result = setup();
            expect(result.request.session.userId).toEqual(null);
        });
        it('clears the `username` session variable', () => {
            const result = setup();
            expect(result.request.session.username).toEqual('');
        });
        it('saves the session', () => {
            const result = setup();
            expect(result.sessionSave).toHaveBeenCalled();
        });
        it('regenerates the session and then calls the provided callback', () => {
            const result = setup();
            expect(result.sessionRegenerate).toHaveBeenCalled();
            expect(result.localCallbackFunction).toHaveBeenCalled();
        });
    });

    describe('an unsuccessful clear due to a failed session.save() call', () => {
        const userId = 1;
        const username = 'test.user';
        const setup = () => {
            const request = nodeMocksHttp.createRequest({
                session: {
                    userId,
                    username,
                    save: jest.fn((callbackFunction?: (err: any) => void): AppSessionType => {
                        if (callbackFunction) {
                            callbackFunction('Something broke here');
                        }
                        return request.session;
                    }),
                    regenerate: jest.fn((callbackFunction: (err: any) => void): AppSessionType => {
                        callbackFunction(null);
                        return request.session;
                    }),
                },
            });

            const sessionRegenerate = jest.spyOn(request.session, 'regenerate');
            const sessionSave = jest.spyOn(request.session, 'save');
            const localCallbackFunction = jest.fn();

            AppSession.clear(request.session, localCallbackFunction);

            return {
                request,
                sessionRegenerate,
                sessionSave,
                localCallbackFunction,
            };
        };

        it('throws an error', () => {
            expect(() => {
                setup();
            }).toThrowError();
        });
    });

    describe('an unsuccessful clear due to a failed session.regenerate() call', () => {
        const userId = 1;
        const username = 'test.user';
        const setup = () => {
            const request = nodeMocksHttp.createRequest({
                session: {
                    userId,
                    username,
                    save: jest.fn((callbackFunction?: (err: any) => void): AppSessionType => {
                        if (callbackFunction) {
                            callbackFunction(null);
                        }
                        return request.session;
                    }),
                    regenerate: jest.fn((callbackFunction: (err: any) => void): AppSessionType => {
                        callbackFunction('Something broke here');
                        return request.session;
                    }),
                },
            });

            const sessionRegenerate = jest.spyOn(request.session, 'regenerate');
            const sessionSave = jest.spyOn(request.session, 'save');
            const localCallbackFunction = jest.fn();

            AppSession.clear(request.session, localCallbackFunction);

            return {
                request,
                sessionRegenerate,
                sessionSave,
                localCallbackFunction,
            };
        };

        it('throws an error', () => {
            expect(() => {
                setup();
            }).toThrowError();
        });
    });
});
