import { APIRequestContext, errors } from "@playwright/test";
import { AuthApi } from "../pages-api/base/AuthApi";
import { testConfig } from "../test.cofing";

export class ApiSession {
    private token: string = ""
    private authApi: AuthApi;
    private config: testConfig;

    constructor(private request: APIRequestContext) {
        this.authApi = new AuthApi(request);
        this.config = new testConfig();
    }

    async login(
        username = this.config.apiUsername,
        password = this.config.apiPassword) {

        this.token = await this.authApi.login(username, password);
        return this.token;

    }
    getToken() {
        if (!this.token) throw new Error(`Not logged in. Call session.login() first.`)
        return this.token;
    }
}