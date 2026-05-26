import test, { APIResponse, APIRequestContext } from "@playwright/test";
import { testConfig } from "../../test.cofing"

export class BaseApi {
    private config = new testConfig();


    constructor(
        protected request: APIRequestContext,
        protected token: string = ""
    ) { }

    protected authHeaders() {
        return {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
        };
    }

    protected async get(path: string): Promise<APIResponse> {
        return this.request.get(`${this.config.apiDev}${path}`, {
            headers: this.authHeaders(),
        });
    }

    protected async post(path: string, data: unknown): Promise<APIResponse> {
        return this.request.post(`${this.config.apiDev}${path}`, {
            headers: this.authHeaders(),
            data,
        });
    }

    protected async put(path: string, data: unknown): Promise<APIResponse> {
        return this.request.put(`${this.config.apiDev}${path}`, {
            headers: this.authHeaders(),
            data,
        });
    }
    protected async delete(path: string): Promise<APIResponse> {
        return this.request.delete(`${this.config.apiDev}${path}`, {
            headers: this.authHeaders(),
        });
    }

    protected async expectOk(response: APIResponse, context?: string): Promise<void> {
        if (!response.ok()) {
            const body = await response.text();
            throw new Error(
                `[${context ?? "API"}] ${response.status()} ${response.statusText()}\n${body}`
            );
        }
    }
}