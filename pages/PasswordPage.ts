import { Page, Locator, expect } from "@playwright/test";
import { LoginPage } from "./LoginPage";

export class PasswordPage {

    private readonly page: Page;
    private readonly emailAddres: Locator;
    private readonly emailAddresnotFound: Locator;
    private readonly confirmationLinkMsg: Locator;
    private readonly forgotPasswordContinueBtn: Locator;
    private readonly changePassword: Locator;
    private readonly confirmChangePassword: Locator;
    private readonly changePwdContinueButton: Locator;



    constructor(page: Page) {

        this.page = page;
        this.emailAddres = page.locator("#input-email");
        this.changePassword = page.locator("#input-password");
        this.confirmChangePassword = page.locator("#input-confirm");
        this.changePwdContinueButton = page.locator("input[value='Continue']");
        this.emailAddresnotFound = page.getByText(" Warning: The E-Mail Address was not found in our records, please try again!");
        this.confirmationLinkMsg = page.locator(".alert.alert-success.alert-dismissible");
        this.forgotPasswordContinueBtn = page.locator(".btn.btn-primary");

    }

    async isOnForgotYourPasswordPage(): Promise<boolean> {

        await expect(this.page).toHaveTitle("Forgot Your Password?");
        return true
    }

    async emailInputForForgotenEmail(value: string): Promise<void> {

        await this.emailAddres.clear();
        await this.emailAddres.fill(value);
    }

    async emailNotFound(): Promise<string> {

        return this.emailAddresnotFound.innerText() ?? "";

    }

    async forgotenPasswordContniuBtn(): Promise<LoginPage> {

        await this.forgotPasswordContinueBtn.click();
        return new LoginPage(this.page);
    }

    async successEmail(): Promise<string> {

        return this.confirmationLinkMsg.innerText() ?? "";

    }

    async passwordChange(password: string): Promise<void> {

        await this.changePassword.clear();
        await this.changePassword.fill(password);

    }

    async passwordConfirm(password: string): Promise<void> {

        await this.confirmChangePassword.clear();
        await this.confirmChangePassword.fill(password);

    }

    async continueButton(): Promise<LoginPage> {
        await this.forgotPasswordContinueBtn.click();
        return new LoginPage(this.page)
    }



}