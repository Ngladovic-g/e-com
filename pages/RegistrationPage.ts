import { Page, expect, Locator } from "@playwright/test"
import { AccountPage } from "./AccountPage";
import { LogoutPage } from "./LogoutPage";



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
    private readonly lastNameWarningMsg: Locator;
    private readonly emailWarningMsg: Locator;
    private readonly telephoneWarningMsg: Locator;
    private readonly pwdWarningMsg: Locator;
    private readonly confirmPwdField: Locator;
    private readonly pwdConfirmWarningMsg: Locator;
    private readonly checkYesSubscribe: Locator;
    private readonly checkNoSubscribe: Locator;
    private readonly emailAddresUsed: Locator;
    private readonly wrongEmail: Locator;
    private readonly privacyWarningMsg: Locator;





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
        this.firstNameWarningMsg = page.locator(".text-danger").nth(0);
        this.lastNameWarningMsg = page.getByText('Last Name must be between 1 and 32 characters!');
        this.emailWarningMsg = page.getByText("E-Mail Address does not appear to be valid!");
        this.telephoneWarningMsg = page.getByText("Telephone must be between 3 and 32 characters!");
        this.pwdWarningMsg = page.getByText("Password must be between 4 and 20 characters!");
        this.pwdConfirmWarningMsg = page.getByText("Password confirmation does not match password!");
        this.confirmPwdField = page.locator("#input-confirm");
        this.checkYesSubscribe = page.locator("//label[normalize-space()='Yes']");
        this.checkNoSubscribe = page.locator("//label[normalize-space()='No']");
        this.emailAddresUsed = page.locator(".alert.alert-danger.alert-dismissible")
        this.wrongEmail = page.getByText("E-Mail Address does not appear to be valid!");
        this.privacyWarningMsg = page.locator(".alert.alert-danger.alert-dismissible");


    }

    async isOnRegistartionPage(): Promise<string | null> {

        const onRegistrationpage = await this.registrationTitle.textContent();
        return onRegistrationpage;
    }


    async setFirstName(fname: string): Promise<string | null> {
        await this.firstName.clear();
        await this.firstName.fill(fname);

        return await this.firstName.getAttribute('placeholder') ?? '';

    }

    async warningMsgFirstName(): Promise<string> {

        return await this.firstNameWarningMsg.innerText() ?? ''

    }


    async setLastName(lname: string): Promise<string> {
        await this.lastName.clear();
        await this.lastName.fill(lname);

        return await this.lastName.getAttribute("placeholder") ?? ''
    }

    async warningMsgLastName(): Promise<string> {

        return await this.lastNameWarningMsg.innerText() ?? '';

    }

    async setEmail(email: string): Promise<string> {

        await this.email.clear();
        await this.email.fill(email);

        return await this.email.getAttribute("placeholder") ?? "";
    }


    async emailWarningMsgPresent(): Promise<string> {
        if (await this.emailWarningMsg.isVisible()) {
            const emailMsg = await this.emailWarningMsg.innerText();
            return emailMsg;
        }
        return ""
    }

    async wrongEmailMsg(): Promise<string> {
        return await this.wrongEmail.innerText();

    }

    async emailRegistered(): Promise<string> {
        return this.emailAddresUsed.innerText();

    }

    async setPhoneNumber(phnumber: string): Promise<string> {
        await this.phoneNumber.clear();
        await this.phoneNumber.fill(phnumber);

        return await this.phoneNumber.getAttribute('placeholder') ?? '';
    }

    async warningMsgTelephone(): Promise<string> {
        if (await this.telephoneWarningMsg.isVisible()) {
            const warningTelephone = await this.telephoneWarningMsg.innerText();
            return warningTelephone;
        }
        return ''
    }


    async setPassword(value: string): Promise<{placeholder:string, warningMsg:string}> {
        await this.password.clear();
        await this.password.fill(value);

        return{
         placeholder:  await this.password.getAttribute('placeholder') ?? '',
         warningMsg:  await this.pwdWarningMsg.innerText() ?? ''
        } 
    }

   /* async warningMsgPwd(): Promise<string> {

        return await this.pwdWarningMsg.innerText() ?? '';

    }
*/
    async cnfPassword(cnfPwd: string): Promise<string> {
        await this.confirmPassword.clear();
        await this.confirmPassword.fill(cnfPwd);

        return await this.confirmPassword.getAttribute('type') ?? '';

    }

    async confirmPwdPlaceholder(): Promise<string> {
        return await this.confirmPassword.getAttribute('placeholder') ?? "";
    }

    async warningMsgConfirmPwd(): Promise<string> {
        return await this.pwdConfirmWarningMsg.innerText() ?? "";

    }

    async showMsgToConfirmPwdField(): Promise<void> {
        await this.confirmPwdField.fill('.');

    }

    async newsletterSubscribe(value: string): Promise<string> {
        if (value === "Yes") {
            const isChecked = this.checkYesSubscribe;
            await isChecked.check()
            const notChecked = this.checkNoSubscribe.isChecked();
            expect(await notChecked).toBe(false)
            const yesRadio = isChecked.innerText();
            return yesRadio
        }
        else {
            const noIsChecked = this.checkNoSubscribe;
            const noRadio = await noIsChecked.innerText();
            const notChecked = await noIsChecked.isChecked();
            expect(notChecked).toBe(true);
            return noRadio;
        }
    }

    async confirmPrivacy(): Promise<void> {

        const isChecked = await this.privacyPolicy.isChecked();

        if (!isChecked) {
            console.log("Privacy is not checked");

            await this.privacyPolicy.check();

            await expect(this.privacyPolicy).toBeChecked()
            console.log("Privacy is checked");
        }

    }

    async warningPrivacyMsg(): Promise<string> {

        return await this.privacyWarningMsg.innerText() ?? "";
    }


    async clickContinue(): Promise<void> {
        await this.continueButton.click()
    }

    async accCreatedMsg(): Promise<string> {
        return await this.congratMsg.textContent() ?? '';
    }

    async continueAftreRegistration(): Promise<AccountPage> {
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
    ) {
        await this.setFirstName(firstName);
        await this.setLastName(lastName);
        await this.setEmail(email);
        await this.setPhoneNumber(phoneNumber);
        await this.setPassword(password);
        await this.cnfPassword(cnfPassword);
        await this.confirmPrivacy();
        await this.clickContinue();

    }


}
