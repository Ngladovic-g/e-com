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


    }

    async isOnRegistartionPage(): Promise<string | null> {
        
            const onRegistrationpage = await this.registrationTitle.textContent();
            return onRegistrationpage;
        
        
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

    async warningMsgFirstName():Promise<string>{

       const fNwarning =  
       await this.firstNameWarningMsg.innerText();
       return fNwarning;
      
       
       // console.log(warning);
    }

    async warningMsgLastName():Promise<string>{
        const lNwarning = await this.lastNameWarningMsg.innerText();
        return lNwarning;

    }

    async warningMsEmail():Promise<string>{
        const warningEmail = await this.emailWarningMsg.innerHTML();
        return warningEmail;
    }

    async warningMsgTelephone():Promise<string>{
        const warningTelephone = await this.telephoneWarningMsg.innerText();
        return warningTelephone;
    }
    async warningMsgPwd():Promise<string>{
        const warningPwd = await this.pwdWarningMsg.innerText();
        return warningPwd;
    }

    async showMsgToConfirmPwdField():Promise<void>{
         await this.confirmPwdField.fill('.')

    }
    async warningMsgConfirmPwd():Promise<string>{
    const warningConfirmPwd = await this.pwdConfirmWarningMsg.innerText();
    return warningConfirmPwd;

    }

   /* async subscribeToYes():Promise<string>{
        const isChecked =  this.checkYesSubscribe;
        await isChecked.check();
        const yesRadio = isChecked.innerText();
        return yesRadio
        
       // expect(yesRadio).toContain('Yes')
        await expect(isChecked).toBeChecked();
    }
        */
       async newsletterSubscribe(value:string):Promise<string>{
        if(value === "Yes"){
            const isChecked =   this.checkYesSubscribe;
            await isChecked.check()
            const notChecked = this.checkNoSubscribe.isChecked();
            expect(await notChecked).toBe(false)
            const yesRadio = isChecked.innerText();
            return yesRadio
        }
        else{
            const noChecked = this.checkNoSubscribe;
            const noString = await noChecked.innerText();
            const notChecked = await noChecked.isChecked();
            expect(notChecked).toBe(true);
            return noString;
        }
       }
}