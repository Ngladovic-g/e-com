import { Locator, Page, expect } from "@playwright/test";
import { AccountPage } from "./AccountPage";
import { RegistrationPage } from "./RegistrationPage";

export class LoginPage {

    private readonly page: Page;
    private readonly emailInputField: Locator;
    private readonly passwordInputField: Locator;
    private readonly loginButton: Locator;
    private readonly loginTitle: Locator;
    private readonly warningMessage: Locator;
    private readonly exceededAmountMsg: Locator;
    private readonly confirmationLinkMsg: Locator;
    private readonly newCustomerButton: Locator;
    private readonly breadcrumb: Locator;


    constructor(page: Page) {
        this.page = page;
        this.emailInputField = page.locator("#input-email");
        this.passwordInputField = page.locator("#input-password");
        this.loginButton = page.locator("input[value='Login']");
        this.loginTitle = page.locator("div>ul>li>a:has-text('Login')");
        this.warningMessage = page.locator(".alert.alert-danger.alert-dismissible");
        this.exceededAmountMsg = page.getByText("Warning: Your account has exceeded allowed number of login attempts. Please try again in 1 hour.", { exact: true });
        this.confirmationLinkMsg = page.locator(".alert.alert-success.alert-dismissible");
        this.newCustomerButton = page.locator("a:has-text('Continue')");
        this.breadcrumb = page.locator(".breadcrumb>li");


    }

    async isOnLoginPage(): Promise<string> {
        const title = await this.loginTitle.innerText();
        return title;
    }

    async pageHasTitle():Promise<boolean>{
        
        let title:string = await this.page.title();

        if(title){
            return true;
        }
        console.log("No title on page")
        return false;

    }

    async newCustomerContinueButton(): Promise<RegistrationPage> {
        await this.newCustomerButton.click();
        return new RegistrationPage(this.page);
    }

    async customerEmail(email: string): Promise<void> {

        await this.emailInputField.fill(email);
    }

    async clearEmail(): Promise<void> {
        await this.emailInputField.clear();
    }

    async customerPassword(password: string): Promise<void> {

        await this.passwordInputField.fill(password);
    }

    async customerLoginButton(): Promise<void> {
        await this.loginButton.click();
    }

    async warningMessagePresent(): Promise<string> {
        //returns text "Warning: No match for E-Mail Address and/or Password."
        if (await this.warningMessage.isVisible()) {
            return await this.warningMessage.innerText() ?? "";
        }
        return "";
    }

    async exceededAttempts(): Promise<string> {

        const exceedeMsg = await this.exceededAmountMsg.isVisible();

        if(!exceedeMsg){
            await this.loginButton.click();
        }
       
        return await this.exceededAmountMsg.innerText();
       // return await this.exceededAmountMsg.innerText() ?? "";
    }

    async confirmationMsg(): Promise<string> {
        return this.confirmationLinkMsg.innerText() ?? "";
    }

    async customerLogin(email: string, password: string): Promise<AccountPage> {
        await this.emailInputField.fill(email);
        await this.passwordInputField.fill(password);
        await this.loginButton.click();
        return new AccountPage(this.page);

    }

    async pressTabKey(email: string): Promise<void> {


        const emailField = this.emailInputField;

        for (let i = 0; i < 50; i++) {
            await this.page.keyboard.press('Tab');

            try {
                await expect(emailField).toBeFocused({ timeout: 200 });
                await emailField.fill(email);
                return; // success → exit function
            } catch (e) {
                // ignore and continue tabbing
            }
        }

        // final assertion (will fail the test)
        await expect(emailField).toBeFocused();

    }

    async passwordValueAttribur(): Promise<string> {

        return await this.passwordInputField.getAttribute('value') ?? '';

    }

    async breadcrumbsList(value: string): Promise<string> {

        const count = await this.breadcrumb.count();

        for (let i = 0; i < count; i++) {
            const options = this.breadcrumb.nth(i);
            const list = await options.textContent()

            if (value === list) {
                return value;
            }
        }
        return `${value} is not present`;
    }

}

