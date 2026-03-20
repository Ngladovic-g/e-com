import { Locator, Page } from "@playwright/test";
import { AccountPage } from "./AccountPage";

export class LoginPage{

    private readonly page: Page;
    private readonly emailInputField: Locator;
    private readonly passwordInputField: Locator;
    private readonly loginButton: Locator;
    private readonly loginTitle: Locator;


    constructor(page: Page){
        this.page = page;
        this.emailInputField = page.locator("#input-email");
        this.passwordInputField = page.locator("#input-password");
        this.loginButton = page.locator("input[value='Login']");
        this.loginTitle = page.locator("div>ul>li>a:has-text('Login')");




    }

    async isOnLoginPage():Promise<string>{
        const title = await this.loginTitle.innerText();
        return(title)
    }

    async customerEmail(email:string):Promise<void>{
         await this.emailInputField.fill(email);
    }

    async customerPassword(password:string):Promise<void>{
        await this.passwordInputField.fill(password);
    }

    async customerLoginButtons():Promise<void>{
         await this.loginButton.click();
    }


    async customerLogin(email:string, password: string):Promise<AccountPage>{
        await this.emailInputField.fill(email);
        await this.passwordInputField.fill(password);
        await this.loginButton.click();
        return new AccountPage(this.page);

    }
}