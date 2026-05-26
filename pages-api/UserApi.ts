import { APIRequestContext } from "@playwright/test";
import { BaseApi } from "./base/BaseApi";

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export class UserApi extends BaseApi {
    constructor(request: APIRequestContext, token: string) {
        super(request, token)
    }

    async getUser(id: number): Promise<User> {

        const res = await this.get(`/users/${id}`);
        await this.expectOk(res, 'getUser');
        return res.json();
    }

    async createUser(data: Omit<User, 'id'>): Promise<User> {

        const res = await this.post('/users', data);
        await this.expectOk(res, "createUser");
        return res.json();
    }

    async updateUser(id: number, data: Partial<User>): Promise<User> {

        const res = await this.put(`/users/${id}`, data);
        await this.expectOk(res, 'updateUser');
        return res.json()
    }

    async deleteUser(id: number): Promise<void> {
        const res = await this.delete(`/users/${id}`);
        await this.expectOk(res, 'deleteUser');
    }

    async listUsers(): Promise<User[]> {
        const res = await this.get('/users');
        await this.expectOk(res, 'listUsers');
        return res.json();
    }
}