import { Page, Locator, expect } from "@playwright/test";

export class PasswordPage{

    private readonly page:Page;


    constructor(page:Page){

        this.page = page;
    }

    async isOnChangePasswordPage():Promise<boolean>{

        await expect(this.page).toHaveTitle("Forgot Your Password?");
        return true
    }
}