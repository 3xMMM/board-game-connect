// TODO

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(); // hide expected error logs
});

afterAll(() => {
    jest.clearAllMocks();
});

describe('the regenerate function', () => {
    it('regenerates the session', () => {
        // TODO, will need a mock on session.regenerate and session.save
    });
    it('sets the session\'s `userId` to the provided userId');
    it('sets the session\'s `username` to the provided username');
    it('saves the session');
});

describe('the clear function', () => {
    it('clears the `userId` session variable');
    it('clears the `username` session variable');
    it('saves the session');
    it('regenerates the session and then calls the provided callback');
});
