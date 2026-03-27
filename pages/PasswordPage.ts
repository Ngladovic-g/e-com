import { Page, Locator, expect } from "@playwright/test";
import { LoginPage } from "./LoginPage";

export class PasswordPage{

    private readonly page:Page;
    private readonly emailAddres: Locator;
    private readonly emailAddresnotFound: Locator;
    private readonly confirmationLinkMsg: Locator;
    private readonly forgotPasswordContinueBtn: Locator;


    constructor(page:Page){

        this.page = page;
        this.emailAddres = page.locator("#input-email");
        this.emailAddresnotFound = page.getByText(" Warning: The E-Mail Address was not found in our records, please try again!");
        this.confirmationLinkMsg = page.locator(".alert.alert-success.alert-dismissible");
        this.forgotPasswordContinueBtn = page.locator(".btn.btn-primary");

    }

    async isOnForgitYourPasswordPage():Promise<boolean>{

        await expect(this.page).toHaveTitle("Forgot Your Password?");
        return true
    }

    async emailInputForForgotenEmail(value:string):Promise<void>{
        
        await this.emailAddres.clear();
        await this.emailAddres.fill(value);
    }

    async emailNotFound():Promise<string>{

        return this.emailAddresnotFound.innerText() ?? "";

    }

    async forgotenPasswordContniuBtn():Promise<LoginPage>{

        await this.forgotPasswordContinueBtn.click();
        return new LoginPage(this.page);
    }

    async successEmail():Promise<string>{

        return this.confirmationLinkMsg.innerText() ?? "";

    }


}