import { Page, expect, Locator } from '@playwright/test'
import { RegistrationPage } from './RegistrationPage';

export class HomePage {

    private readonly page: Page;

    //Locators

    private readonly myAccountLink: Locator;
    private readonly registerLink: Locator;




    constructor(page: Page) {
        this.page = page;
        this.myAccountLink = page.locator("span:has-text('My Account')");
        this.registerLink = page.locator("a:has-text('Register')");


    }

    async isOnHomePage():Promise<boolean> {
        let title: string = await this.page.title();
        if (title) {
            return true;
        }
        return false;
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

    //this was added by use nglad3
    async userNglad3AddedThis():Promise<void>{
       
    }
    // this was added by user nglad2 branch
    async nglad2Userfunction():Promise<void>{
        
    }

}