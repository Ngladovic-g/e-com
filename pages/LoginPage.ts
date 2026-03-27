import { Locator, Page } from "@playwright/test";
import { AccountPage } from "./AccountPage";

export class LoginPage{

    private readonly page: Page;
    private readonly emailInputField: Locator;
    private readonly passwordInputField: Locator;
    private readonly loginButton: Locator;
    private readonly loginTitle: Locator;
    private readonly warningMessage: Locator;
    private readonly exceededAmountMsg: Locator;
    private readonly confirmationLinkMsg: Locator;


    constructor(page: Page){
        this.page = page;
        this.emailInputField = page.locator("#input-email");
        this.passwordInputField = page.locator("#input-password");
        this.loginButton = page.locator("input[value='Login']");
        this.loginTitle = page.locator("div>ul>li>a:has-text('Login')");
        this.warningMessage = page.locator(".alert.alert-danger.alert-dismissible");
        this.exceededAmountMsg = page.getByText("Warning: Your account has exceeded allowed number of login attempts. Please try again in 1 hour.", {exact: true});
        this.confirmationLinkMsg = page.locator(".alert.alert-success.alert-dismissible");
}

    async isOnLoginPage():Promise<string>{
        const title = await this.loginTitle.innerText();
        return title;
    }

    async customerEmail(email:string):Promise<void>{
         await this.emailInputField.fill(email);
    }

    async clearEmail():Promise<void>{
         await this.emailInputField.clear();
    }

    async customerPassword(password:string):Promise<void>{
        await this.passwordInputField.fill(password);
    }

    async customerLoginButton():Promise<void>{
         await this.loginButton.click();
    }

    async warningMessagePresent():Promise<string>{
    //returns text "Warning: No match for E-Mail Address and/or Password."
        if(await this.warningMessage.isVisible()){
            return await this.warningMessage.innerText() ?? "";
        }
        return "";
    }

    async exceededAttempts():Promise<string>{
        
        return await this.exceededAmountMsg.innerText() ?? "";
    }

    async confirmationMsg():Promise<string>{
       return this.confirmationLinkMsg.innerText() ?? "";
    }

    async customerLogin(email:string, password: string):Promise<AccountPage>{
        await this.emailInputField.fill(email);
        await this.passwordInputField.fill(password);
        await this.loginButton.click();
        return new AccountPage(this.page);

    }
}