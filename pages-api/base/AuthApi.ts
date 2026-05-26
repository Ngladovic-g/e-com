import { APIRequestContext } from "@playwright/test";

export class AuthApi {

    constructor(private request: APIRequestContext) { }

    async login(username:string, password:string){

        const response = await this.request.post("/auth/login",{
            data: {username, password},
        });
        if(!response.ok()){
            throw new Error(`Login failed: ${response.status()} ${await response.text()}`)
        }

        const body = await response.json();
        return body.token()
    }

    async refreshToken(token:string):Promise<string>{

        const response = await this.request.post("/auth/refresh", {
            headers: { Authorization: `Bearer ${token}`},
        });

        const body = await response.json();
        return body.token;
    }



}