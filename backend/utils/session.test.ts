import nodeMocksHttp from 'node-mocks-http';
import { AppSession, AppSessionType } from './session';

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(); // hide expected error logs
});

afterAll(() => {
    jest.clearAllMocks();
});

describe('the regenerate function', () => {
    describe('a successful regeneration', () => {
        const userId = 1;
        const username = 'test.user';
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

        it('regenerates the session', () => {
            expect(sessionRegenerate).toHaveBeenCalled();
        });
        it('sets the session\'s `userId` to the provided userId', () => {
            expect(request.session.userId).toEqual(userId);
        });
        it('sets the session\'s `username` to the provided username', () => {
            expect(request.session.username).toEqual(username);
        });
        it('saves the session', () => {
            expect(sessionSave).toHaveBeenCalled();
        });
    });

    describe('an unsuccessful regeneration due to a failed session.regenerate() call', () => {
        const userId = 1;
        const username = 'test.user';
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

        expect(() => {
            AppSession.regenerate(request.session, userId, username);
        }).toThrowError();

        it('attempts to regenerate the session', () => {
            expect(sessionRegenerate).toHaveBeenCalled();
        });
        it('does not set the session\'s `userId` to the provided userId', () => {
            expect(request.session.userId).not.toEqual(userId);
        });
        it('does not set the session\'s `username` to the provided username', () => {
            expect(request.session.username).not.toEqual(username);
        });
        it('does not save the session', () => {
            expect(sessionSave).not.toHaveBeenCalled();
        });
    });
});

describe('the clear function', () => {
    describe('a successful clear', () => {
        const userId = 1;
        const username = 'test.user';
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

        it('clears the `userId` session variable', () => {
            expect(request.session.userId).toEqual(null);
        });
        it('clears the `username` session variable', () => {
            expect(request.session.username).toEqual('');
        });
        it('saves the session', () => {
            expect(sessionSave).toHaveBeenCalled();
        });
        it('regenerates the session and then calls the provided callback', () => {
            expect(sessionRegenerate).toHaveBeenCalled();
            expect(localCallbackFunction).toHaveBeenCalled();
        });
    });

    describe('an unsuccessful clear due to a failed session.save() call', () => {
        const userId = 1;
        const username = 'test.user';
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

        expect(() => {
            AppSession.clear(request.session, localCallbackFunction);
        }).toThrowError();

        it('clears the `userId` session variable', () => {
            expect(request.session.userId).toEqual(null);
        });
        it('clears the `username` session variable', () => {
            expect(request.session.username).toEqual('');
        });
        it('attempts to save the session', () => {
            expect(sessionSave).toHaveBeenCalled();
        });
        it('does not regenerate the session and does not call the provided callback', () => {
            expect(sessionRegenerate).not.toHaveBeenCalled();
            expect(localCallbackFunction).not.toHaveBeenCalled();
        });
    });

    describe('an unsuccessful clear due to a failed session.regenerate() call', () => {
        const userId = 1;
        const username = 'test.user';
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

        expect(() => {
            AppSession.clear(request.session, localCallbackFunction);
        }).toThrowError();

        it('clears the `userId` session variable', () => {
            expect(request.session.userId).toEqual(null);
        });
        it('clears the `username` session variable', () => {
            expect(request.session.username).toEqual('');
        });
        it('saves the session', () => {
            expect(sessionSave).toHaveBeenCalled();
        });
        it('attempts to regenerate the session and does not call the provided callback', () => {
            expect(sessionRegenerate).toHaveBeenCalled();
            expect(localCallbackFunction).not.toHaveBeenCalled();
        });
    });
});
