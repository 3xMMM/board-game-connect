export default class AdminUser {
    private readonly _id: number;
    private _last_login: string;
    public first_name: string;
    public last_name: string;
    public username: string;
    public email: string;
    public password: string;

    constructor (adminUser: AdminUser) {
        this._id = adminUser.id;
        this._last_login = adminUser.last_login;
        this.first_name = adminUser.first_name;
        this.last_name = adminUser.last_name;
        this.username = adminUser.username;
        this.email = adminUser.email;
        this.password = adminUser.password;
    }

    get id (): number {
        return this._id;
    }

    get last_login (): string {
        return this._last_login;
    }

    set last_login (value: string) {
        this._last_login = value;
    }

    /**
     * Returns a JSON object without sensitive fields (like passwords and secrets)
     */
    public toClientSafeJSON (): Record<string, unknown> {
        return {
            id: this.id,
            last_login: this.last_login,
            first_name: this.first_name,
            last_name: this.last_name,
            username: this.username,
            email: this.email,
        };
    }
};
