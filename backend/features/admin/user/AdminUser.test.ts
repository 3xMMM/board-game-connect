import AdminUser from './AdminUser';

it('should have a method that returns a client-safe JSON object without secrets', () => {
    const adminUser = new AdminUser({
        id: 1,
        last_login: 'some time ago',
        first_name: 'Test',
        last_name: 'User',
        username: 'test.user',
        email: 'test.user@test.com',
        password: 'password',
    });

    const json = adminUser.toClientSafeJSON();
    expect('id' in json).toBeTruthy();
    expect('last_login' in json).toBeTruthy();
    expect('first_name' in json).toBeTruthy();
    expect('last_name' in json).toBeTruthy();
    expect('username' in json).toBeTruthy();
    expect('email' in json).toBeTruthy();
    expect('password' in json).toBeFalsy();
});
