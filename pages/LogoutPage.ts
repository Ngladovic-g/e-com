import { Page, Locator } from "@playwright/test"
import { HomePage } from "./HomePage";

export class LogoutPage {

    private readonly page: Page;

    //Locators

    private readonly logoutContinuBtn: Locator;
    private readonly accountLogoutPage: Locator;


    constructor(page: Page) {
        this.page = page;

        //Locators
        this.logoutContinuBtn = page.locator(".btn.btn-primary");
        this.accountLogoutPage = page.locator("h1:has-text('Account Logout')")
    }

    async isOnLogoutPage(): Promise<boolean> {
        try {
            const isVisible = await this.accountLogoutPage.isVisible();
            return isVisible;
        }
        catch (error) {
            console.log(`Logout page is not present ${error}`)
            return false;
        }

    }
    
    async isContinueBtnVisible():Promise<boolean>{
        return this.logoutContinuBtn.isVisible();
        
    }

    async clickContinueBtn():Promise<HomePage>{
        await this.logoutContinuBtn.click();
        return new HomePage(this.page);
    }

}