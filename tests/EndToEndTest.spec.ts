import { expect, Page, test } from '@playwright/test'
import { HeaderPage } from "../pages/HeaderPage";
import { RegistrationPage } from "../pages/RegistrationPage";
import { testConfig } from "../test.cofing";
import { RandomDataUtils } from "../utils/randomDataGenerator"
import { AccountPage } from '../pages/AccountPage';
import { LogoutPage } from '../pages/LogoutPage';
import { NewsletterPage } from '../pages/NewsletterPage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { PasswordPage } from '../pages/passwordPage';
import { create } from 'node:domain';

let noChecked = "No"


test.only('Execute end to end test @end-to-end', async ({ page }) => {

    const config = new testConfig();

    await page.goto(config.localHost);

  /*  await wrongEmailAndPhoneFormat(page);
    console.log("Correct form for email and telephone checked");

    let [email, password] = await createNewUserAndFieldSpecVerification(page);

    await logout(page);
    console.log("User loged out and is on Home Page");
*/
    await login(page);
    console.log("User is logged in and on My Account page")


})

test('Warring message @end-to-end', async ({ page }) => {

    const config = new testConfig();

    page.goto(config.baseUrl);




})

async function createNewUserAndFieldSpecVerification(page: Page) {


    let emailUsed = " Pete_Wyman63@gmail.com";
    // let password = "test123";
    let email: string = RandomDataUtils.getEmail();
    let password: string = RandomDataUtils.getPassword();
    console.log(email);
    console.log(password);

    const headerPage = new HeaderPage(page);
    await headerPage.clickMyAccount();

    const registrationPage: RegistrationPage = await headerPage.clickRegister();

    await registrationPage.clickContinue();
    expect(await registrationPage.confirmPwdPlaceholder()).toContain("Password Confirm");
    expect(await registrationPage.cnfPassword(password)).toContain("password");

    await registrationPage.clickContinue();
    
    expect(await registrationPage.warningMsgConfirmPwd()).toContain("Password confirmation does not match password!")

    expect(await registrationPage.warningMsgFirstName()).toContain("First Name must be between 1 and 32 characters!");
    expect(await registrationPage.setFirstName(RandomDataUtils.getFirstName())).toContain('First Name');

    expect(await registrationPage.warningMsgLastName()).toContain("Last Name must be between 1 and 32 characters");
    expect(await registrationPage.setLastName(RandomDataUtils.getLastName())).toContain("Last Name");

    expect(await registrationPage.warningPrivacyMsg()).toContain("Warning: You must agree to the Privacy Policy!");
    await registrationPage.confirmPrivacy();

    expect(await registrationPage.emailWarningMsgPresent()).toContain("E-Mail Address does not appear to be valid!");

    await registrationPage.setEmail(emailUsed);
    await registrationPage.clickContinue();
    expect(await registrationPage.emailRegistered()).toContain("Warning: E-Mail Address is already registered!");


    expect(await registrationPage.setEmail(email)).toContain("E-Mail");


    expect(await registrationPage.warningMsgTelephone()).toContain("Telephone must be between 3 and 32 characters!");
    expect(await registrationPage.setPhoneNumber(RandomDataUtils.getPhoneNumber())).toContain("Telephone");

    let { placeholder, warningMsg } = await registrationPage.setPassword(password);
    expect(warningMsg).toContain("Password must be between 4 and 20 characters!");
    expect(placeholder).toContain("Password");
    await registrationPage.setPassword(password);



    // await registrationPage.cnfPassword(password);


    expect(await registrationPage.newsletterSubscribe(noChecked)).toContain("No");


    await registrationPage.clickContinue();
    expect(await registrationPage.accCreatedMsg()).toContain("Your Account Has Been Created!");

    const accountPage: AccountPage = await registrationPage.continueAftreRegistration();
    expect(await accountPage.isOnAccountPage()).toBe(true);

    if (await accountPage.isOnAccountPage()) {

        const newsletter: NewsletterPage = await accountPage.clickNewletterLink();
        await page.waitForTimeout(5000);
        const noIsChecked = await newsletter.checkedValue(noChecked);
        expect(noIsChecked).toBeChecked()
    }
    else {
        expect(await registrationPage.isOnRegistartionPage()).toContain("Register Account");
    }

    return [email, password]


}

async function logout(page: Page) {

    const headerPage = new HeaderPage(page);
    await headerPage.clickMyAccount();
    const logoutPage: LogoutPage = await headerPage.clickLogout();
    expect(logoutPage.isContinueBtnVisible).toBeTruthy();
    const homePage: HomePage = await logoutPage.clickContinueBtn();
    expect(homePage.isOnHomePage).toBeTruthy()

}

async function login(page: Page, email?: string, password?: string) {

    const headerPage = new HeaderPage(page);

    await headerPage.clickMyAccount();
    const loginPage: LoginPage = await headerPage.clickLogin();
    const loginString = await loginPage.isOnLoginPage();
    expect(loginString).toContain("Login");

    const myAccount = new AccountPage(page);
    await myAccount.choseOptionfromSidebar("Forgotten Password");
    const passwordPage = new PasswordPage(page);
    await passwordPage.isOnChangePasswordPage();

/*
    // TC_LF_003 -  email and password empty
    await loginPage.customerLoginButtons();
    expect(await loginPage.warningMessagePresent()).toContain("Warning: No match for E-Mail Address and/or Password.");

    // TC_LF_004 - only email
    await loginPage.customerEmail(RandomDataUtils.getEmail());
    await loginPage.customerLoginButtons();
    expect(await loginPage.warningMessagePresent()).toContain("Warning: No match for E-Mail Address and/or Password.");

    // TC_LF_005 - both email and password
    await loginPage.customerEmail(RandomDataUtils.getPassword());
    await loginPage.customerLoginButtons();
    expect(await loginPage.warningMessagePresent()).toContain("Warning: No match for E-Mail Address and/or Password.");

    // TC_LF_005 - only password
     loginPage.clearEmail
    await loginPage.customerLoginButtons();
    expect(await loginPage.warningMessagePresent()).toContain("Warning: No match for E-Mail Address and/or Password.");
*/

    /*const myAccount: new AccountPage; = await loginPage.customerLogin(email, password);
    expect(await myAccount.isOnAccountPage()).toBe(true);
    await myAccount.choseOptionfromSidebar("Password");
    const passwordPage = new PasswordPage(page);
    await passwordPage.isOnChangePasswordPage();
*/
     

   
}


async function wrongEmailAndPhoneFormat(page: Page): Promise<boolean> {

    let failedEmailMsg = "E-Mail Address does not appear to be valid!";
    let failedEmail = ["nglad2@adw", "nglad@owdk", "nodwo@gmail.com"];

    let failedPhonemsg = "Telephone must be between 3 and 32 characters!"
    let failedPhone = ["sd", "234sf234sf234sf234sf234sf234sf232", "21343243"];

    let foundInvalid = false;

    const headerPage = new HeaderPage(page);

    await headerPage.clickMyAccount();
    const registrationPage: RegistrationPage = await headerPage.clickRegister();



    for (const emails of failedEmail) {

        await registrationPage.setEmail(emails);
        await registrationPage.clickContinue();

        const msgVisible = await registrationPage.emailWarningMsgPresent();

        if (msgVisible === failedEmailMsg) {

            foundInvalid = true;
            expect(msgVisible).toContain(failedEmailMsg);
            console.log("Wrong email form is used")
        }
        else {
            console.log("Proper email form is used")

        }
    }

    for (const phone of failedPhone) {

        await registrationPage.setPhoneNumber(phone);
        await registrationPage.clickContinue();

        const phoneMsg = await registrationPage.warningMsgTelephone();

        if (phoneMsg === failedPhonemsg) {
            foundInvalid = true;
            expect(phoneMsg).toContain(failedPhonemsg);
            console.log("Wrong phone form used");
        }
        else {
            console.log("Correct phone form used");
        }
    }
    return false
}


