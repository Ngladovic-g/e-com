import { Page, Locator, expect } from "@playwright/test"
import { HomePage } from "./HomePage";
import { truncate } from "node:fs";

export class LogoutPage {

    private readonly page: Page;

    //Locators

    private readonly logoutContinuBtn: Locator;
    private readonly accountLogoutPage: Locator;
    private readonly logoutBreadCrumbs: Locator;


    constructor(page: Page) {
        this.page = page;

        //Locators
        this.logoutContinuBtn = page.locator(".btn.btn-primary");
        this.accountLogoutPage = page.locator("h1:has-text('Account Logout')")
        this.logoutBreadCrumbs = page.locator(".breadcrumb>li");

    }

    async logoutTitle():Promise<boolean>{

        let title:string = await this.page.title();
        if(title){
            return true;
        }
        return false;
    }

    async pageURL():Promise<string>{

        return this.page.url();
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

    async breadCrumbsList(crumbs:string):Promise<string>{

        const count = await this.logoutBreadCrumbs.count();

        for(let i=0; i < count; i++){

            const list =  this.logoutBreadCrumbs.nth(i);
            const value = await list.textContent();
            if(value === crumbs){
                return value;
            }
        }
        return `Not present`;
    }

}