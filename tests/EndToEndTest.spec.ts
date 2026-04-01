import { expect, Page, test, BrowserContext } from '@playwright/test'
import { HeaderPage } from "../pages/HeaderPage";
import { RegistrationPage } from "../pages/RegistrationPage";
import { testConfig } from "../test.cofing";
import { RandomDataUtils } from "../utils/randomDataGenerator"
import { AccountPage } from '../pages/AccountPage';
import { LogoutPage } from '../pages/LogoutPage';
import { NewsletterPage } from '../pages/NewsletterPage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';

import { KeyboardKeysPage } from '../pages/keyboardKeysPage';
import { PasswordPage } from '../pages/passwordPage';



let noChecked = "No"


test('Execute end to end test @end-to-end', async ({ page }) => {

    const config = new testConfig();

    await page.goto(config.localHost);

    //   await wrongEmailAndPhoneFormat(page);
    //   console.log("Correct form for email and telephone checked");

    let [email, password] = await createNewUserAndFieldSpecVerification(page);

    await logout(page, email, password);
    console.log("User loged out and is on Home Page");

    //   await login(page, email, password);
    //    console.log("User is logged in and on My Account page");


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

async function logout(page: Page, email: string, password: string) {

    //TC_LG_001

    const headerPage = new HeaderPage(page);
    await headerPage.clickMyAccount();
    const logoutPage: LogoutPage = await headerPage.clickLogout();
    expect(await logoutPage.isContinueBtnVisible()).toBe(true);
    const homePage: HomePage = await logoutPage.clickContinueBtn();
    expect(await homePage.isOnHomePage()).toBe(true);

    //TC_LG_002
    async function userLogin(email: string, password: string) {
        await headerPage.clickMyAccount();
        const loginPage: LoginPage = await headerPage.clickLogin();
        expect(await loginPage.isOnLoginPage()).toContain(`Login`);
        const myAccount: AccountPage = await loginPage.customerLogin(email, password);
        expect(await myAccount.isOnAccountPage()).toBe(true);
    }

    await userLogin(email, password)
    const myAccount = new AccountPage(page);
    await myAccount.choseOptionfromSidebar(`Logout`);
    expect(await logoutPage.isOnLogoutPage()).toBe(true);
    await headerPage.clickMyAccount();
    expect(await headerPage.logoutButtonVisible()).toBe(true);
    await logoutPage.clickContinueBtn();
    expect(await homePage.isOnHomePage()).toBe(true);

    //TC_LG_008 was also done with 151 line 
    await userLogin(email, password);
    page = await homePage.reopen();

    const account = new AccountPage(page);
    const header = new HeaderPage(page);
    expect(await account.isOnAccountPage()).toBe(true);

    //TC_LG_004

    await header.clickMyAccount();
    await header.clickLogout();
    await page.goBack();
    const loginPage = new LoginPage(page);
    expect(await loginPage.isOnLoginPage()).toContain(`Login`);

    //TC_LG_005
    await header.clickMyAccount();
    expect(await header.logoutButtonVisible()).toBe(false);

    //TC_LG_005

    const register: RegistrationPage = await header.clickRegister();
    expect(await register.isOnRegistartionPage()).toContain(`Register Account`);
    const logoutPresent = await account.choseOptionfromSidebar(`Logout`);
    expect(logoutPresent).toBe(false);

    //TC_LG_009
    const logout = new LogoutPage(page);
    await header.clickMyAccount();
    await header.clickLogin();
    await loginPage.customerLogin(email, password);
    expect(await account.isOnAccountPage()).toBe(true);
    await header.clickMyAccount();
    await header.clickLogout();
    expect(await logout.logoutTitle()).toBe(true);
    expect(await logout.breadCrumbsList(`Logout`)).toContain(`Logout`);
    expect(await logout.pageURL()).toContain(`http://localhost/opencart/upload/index.php?route=account/logout`);

}

async function login(page: Page, email?: string, password?: string) {

    const changePassword = '12345';
    const headerPage = new HeaderPage(page);
    const passwordPage = new PasswordPage(page);
    const myAccount = new AccountPage(page);
    const config = new testConfig();

    await headerPage.clickMyAccount();
    const loginPage: LoginPage = await headerPage.clickLogin();
    const keyboard = new KeyboardKeysPage(page);

    const loginString = await loginPage.isOnLoginPage();
    expect(loginString).toContain("Login");


    await loginPage.customerLoginButton();

    // Exceeded allowed number of login attempts
    expect(await loginPage.exceededAttempts()).toContain(`Warning: Your account has exceeded allowed number of login attempts. Please try again in 1 hour.`);

    //Passord value not present in Page source(Failing)
    //await loginPage.customerLoginButton();
    //expect(await loginPage.passwordValueAttribur()).not.toContain("");


    //"Warning: The E-Mail Address was not found in our records, please try again!" get before
    // expect(await loginPage.warningMessagePresent()).toContain("Warning: No match for E-Mail Address and/or Password.");


    await myAccount.choseOptionfromSidebar(`Forgotten Password`);
    expect(await passwordPage.isOnForgotYourPasswordPage()).toBe(true);

    //Wrong email used and message displayed after pressing continue button
    await passwordPage.emailInputForForgotenEmail(`wadkoaw`);
    await passwordPage.forgotenPasswordContniuBtn();
    expect(await passwordPage.emailNotFound()).toContain(`Warning: The E-Mail Address was not found in our records, please try again!`);

    //Correct email used, going back to login page and success email message
    await passwordPage.emailInputForForgotenEmail(email ?? `abc@gmail.com`);

    await passwordPage.forgotenPasswordContniuBtn();
    expect(await loginPage.isOnLoginPage());
    expect(await loginPage.confirmationMsg()).toContain(`An email with a confirmation link has been sent your email address.`);

    // select Email field using Tab keystroke
    await loginPage.pressTabKey(email ?? ``);
    await keyboard.copyValue();


    //Try copy of password
    await loginPage.customerPassword(password ?? ``);
    await keyboard.clipboardBeforeCopy();
    await keyboard.copyValue();
    await keyboard.clipboardAftereCopy();
    expect(await keyboard.clipboardBeforeCopy()).toBe(await keyboard.clipboardAftereCopy());

    // Use browser back button
    await loginPage.customerLoginButton();
    expect(await myAccount.isOnAccountPage()).toBe(true);
    await page.goBack();
    expect(await myAccount.isOnAccountPage()).toBe(true);

    //Change password while logged in
    await myAccount.choseOptionfromSidebar(`Password`);
    await passwordPage.passwordChange(changePassword);
    await passwordPage.passwordConfirm(changePassword)
    await passwordPage.continueButton();
    expect(await myAccount.isOnAccountPage()).toBe(true);
    expect(await myAccount.passwordMsgSuccessChange()).toContain(`Success: Your password has been successfully updated.`)
    await headerPage.clickMyAccount();
    const logoutPage = await headerPage.clickLogout();
    const homePage = await logoutPage.clickContinueBtn();
    expect(await homePage.isOnHomePage()).toBe(true);
    await headerPage.clickMyAccount();
    await headerPage.clickLogin();
    await loginPage.customerEmail(email ?? ``);
    await loginPage.customerPassword(changePassword);
    await loginPage.customerLoginButton();
    expect(await myAccount.isOnAccountPage()).toBe(true);


    //Closing browser should not log user out
    page = await homePage.reopen();
    const header = new HeaderPage(page);
    const logout = new LogoutPage(page);
    const login = new LoginPage(page);

    await header.clickMyAccount();
    expect(await header.logoutButtonVisible()).toBe(true);


    //await headerPage.clickMyAccount(); Due to closing of page new istances of classes are created
    await header.clickLogout();
    expect(await logout.isOnLogoutPage()).toBe(true);
    await page.goBack();
    expect(await login.isOnLoginPage());

    //TC_LF_ 019, Ckick continue button on new customer page, and slecting different option from sidebar
    const register: RegistrationPage = await login.newCustomerContinueButton();
    expect(await register.isOnRegistartionPage()).toContain(`Register Account`);
    await page.goBack();
    const account = new AccountPage(page);
    await account.choseOptionfromSidebar(`Forgotten Password`);
    const pass = new PasswordPage(page);
    expect(await pass.isOnForgotYourPasswordPage()).toBe(true);

    //TC_LF_020 Navigating to login page from different pages
    await account.choseOptionfromSidebar(`Register`);
    expect(await register.isOnRegistartionPage()).toContain(`Register Account`);
    await account.choseOptionfromSidebar(`Login`);
    expect(await login.isOnLoginPage()).toContain(`Login`);
    await account.choseOptionfromSidebar(`Login`);
    expect(await login.isOnLoginPage()).toContain(`Login`);
    await header.clickMyAccount()
    await header.clickLogin();
    expect(await login.isOnLoginPage()).toContain(`Login`);

    //TC_LF_021 Breadcrumbs, header, url, title

    expect(await login.breadcrumbsList(`Login`)).toContain(`Login`);
    expect(await homePage.pageUrl()).toContain(`http://localhost/opencart/upload/index.php?route=account/account`);
    expect(await login.pageHasTitle()).toBe(true);



    //Insert used all login attempts

    /*
        await loginPage.customerPassword(password ?? "");
        const passwordValue = await keyboard.copyCtrlC();
    
        await loginPage.customerEmail(passwordValue)
    */


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


