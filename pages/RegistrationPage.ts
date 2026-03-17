import { Page, expect, Locator } from "@playwright/test"
import { AccountPage } from "./AccountPage";
import { LogoutPage } from "./LogoutPage";
import { warn } from "node:console";


export class RegistrationPage {
    private readonly page: Page;

    //Locators
    private readonly firstName: Locator;
    private readonly lastName: Locator;
    private readonly email: Locator;
    private readonly phoneNumber: Locator;
    private readonly password: Locator;
    private readonly confirmPassword: Locator;
    private readonly privacyPolicy: Locator;
    private readonly continueButton: Locator;
    private readonly registrationTitle: Locator;
    private readonly congratMsg: Locator;
    private readonly continueAfterRegistration: Locator;
    private readonly firstNameWarningMsg: Locator;


    constructor(page: Page) {
        this.page = page;
        this.firstName = page.locator("#input-firstname");
        this.lastName = page.locator("#input-lastname");
        this.email = page.locator("#input-email");
        this.phoneNumber = page.locator("#input-telephone");
        this.password = page.locator("#input-password");
        this.confirmPassword = page.locator("#input-confirm");
        this.privacyPolicy = page.locator('input[name="agree"]');
        this.continueButton = page.locator("input[value='Continue']");
        this.registrationTitle = page.locator("div>h1:has-text('Register Account')");
        this.congratMsg = page.locator("div>h1:has-text('Your Account Has Been Created!')");
        this.continueAfterRegistration = page.locator("a:has-text('Continue')");
        //this.firstNameWarningMsg = page.getByText('First Name must be between 1 and 32 characters!', { exact: true })
        this.firstNameWarningMsg = page.locator(".text-danger").nth(0)
    }

    async isOnRegistartionPage(): Promise<boolean> {
        try {
            const onRegistrationpage = await this.registrationTitle.isVisible();
            return onRegistrationpage;
        }
        catch (error) {
            console.log(`Error checking Registartion page: ${error}`);
            return false
        }
    }

    async setFirstName(fname: string): Promise<void> {
        await this.firstName.fill(fname);
    }

    async setLastName(lname: string): Promise<void> {
        await this.lastName.fill(lname);
    }

    async setEmail(email:string):Promise<void>{
        await this.email.fill(email);
    }

    async setPhoneNumber(phnumber:string):Promise<void>{
        await this.phoneNumber.fill(phnumber);
    }

    async setPassword(pwd:string):Promise<void>{
        await this.password.fill(pwd);
    }

    async cnfPassword(cnfPwd:string):Promise<void>{
        await this.confirmPassword.fill(cnfPwd);
    }

    async confirmPrivacy():Promise<void>{
        await this.privacyPolicy.check()

    }

    async clickContinue():Promise<void>{
        await this.continueButton.click()
    }

    async accCreatedMsg():Promise<string>{
       return await this.congratMsg.textContent() ?? '';
    }

    async continueAftreRegistration():Promise<AccountPage>{
        await this.continueAfterRegistration.click();
        return new AccountPage(this.page)

    }

    async completeRegistration(
        firstName: string,
        lastName: string,
        email: string,
        phoneNumber: string,
        password: string,
        cnfPassword: string
        ):Promise<void>{
            this.setFirstName(firstName);
            this.setLastName(lastName);
            this.setEmail(email);
            this.setPhoneNumber(phoneNumber);
            this.setPassword(password);
            this.cnfPassword(cnfPassword);
            this.confirmPrivacy();
            this.clickContinue();
            }

    async warningMsgFirstName():Promise<void>{

       const warning =  await this.firstNameWarningMsg.innerText();
      
       expect(warning).toContain("First Name must be between 1 and 32 characters!")
       // console.log(warning);
    }
}