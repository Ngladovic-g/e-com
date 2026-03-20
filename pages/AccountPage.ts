import {Page, expect, Locator} from "@playwright/test"
import { LogoutPage } from "./LogoutPage";
import { NewsletterPage } from "../tests/Newsletter.spec";

export class AccountPage{
    private readonly page: Page;
    
    //Locators
    private readonly myAccountPage: Locator; 
    private readonly logoutBtn: Locator;
    private readonly newsletterLink: Locator;



    constructor(page:Page){

        this.page  = page;
        this.myAccountPage = page.locator("div>h2:has-text('My Account')");
        this.logoutBtn = page.locator("a:has-text('Logout')").nth(1);
        this.newsletterLink = page.locator("div>a:has-text('Newsletter')");



    }

    async isOnAccountPage():Promise<boolean>{
        try{
            const accountMessage = await this.myAccountPage.isVisible();
            return accountMessage;
        }
        catch(error){
            console.log(`User is not on My Account page: ${error}`);
            return false;
        }
    }
    async clickLogoutBtn():Promise<LogoutPage>{
        try{
        await this.logoutBtn.click();
        return new LogoutPage(this.page);
        }
        catch(error){
            console.log(`Logout page not present ${error}`);
            throw(error);
        }

    }
    async clickNewletterLink():Promise<NewsletterPage>{

        await this.newsletterLink.click();
        return new NewsletterPage(this.page);

    }
}