import { Page, expect, Locator } from "@playwright/test";



export class NewsletterPage{ 


    private readonly page:Page; 
    private readonly newsletterHeader: Locator;
    private readonly subscriptionYes: Locator;
    private readonly subscriptionNo: Locator;



    constructor(page:Page){
        this.page = page;
        this.newsletterHeader = page.locator("h1:has-text('Newsletter Subscription')");
        this.subscriptionYes = page.locator("//label[normalize-space()='Yes']");
        this.subscriptionNo = page.locator("//label[normalize-space()='No']");
    }

    async isOnNewletterPage():Promise<string>{
     const newsletter =  await this.newsletterHeader.innerText();
     return newsletter;
    }

    /*
    async yesIsChecked():Promise<Locator>{
        const isYesChecked =  this.subscriptionYes;
        return isYesChecked;

    }

    async noIsChecked():Promise<Locator>{
        const isNoChecked = this.subscriptionNo;
        return isNoChecked;
    }
    */

    async checkedValue(value: string):Promise<Locator>{
        if(value === 'Yes'){
            const isYesChecked =  this.subscriptionYes;
            return isYesChecked
        }
        else{
            const isNoChecked = this.subscriptionNo;
            return isNoChecked;
        }
    }

}