import { Page, expect, Locator } from '@playwright/test'
import { RegistrationPage } from './RegistrationPage';
import { LogoutPage } from './LogoutPage';
import { promises } from 'node:dns';
import { LoginPage } from './LoginPage';

export class HeaderPage {

    private readonly page: Page;

    //Locators

    private readonly myAccountLink: Locator;
    private readonly registerLink: Locator;
    private readonly logoutLink: Locator;
    private readonly loginLink: Locator;




    constructor(page: Page) {
        this.page = page;
        this.myAccountLink = page.locator("span:has-text('My Account')");
        this.registerLink = page.locator("a:has-text('Register')");
        this.logoutLink = page.locator("li>a:has-text('Logout')");
        this.loginLink = page.locator("li>a:has-text('Login')");


    }


    async clickMyAccount():Promise<void> {
        try {
            await this.myAccountLink.click()
        }
        catch (error) {
            console.log(`Exception occured while clicking My Account: ${error}`);
            throw error;
        }
    }

    async clickRegister():Promise<RegistrationPage>{
        try {
            await this.registerLink.click();
            return new RegistrationPage(this.page);
        }
        catch (error) {
            console.log(`Expception while clicking on Registration link: ${error}`)
            throw error;
        }
    }
    
    async clickLogout():Promise<LogoutPage>{
        await this.logoutLink.click()
        return new LogoutPage(this.page);

    }

    async clickLogin():Promise<LoginPage>{
        await this.loginLink.click();
        return new LoginPage(this.page)

    }



}