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
import { create } from 'node:domain';

let checked = "No"


test.only('Execute end to end test @end-to-end', async ({ page }) => {

    const config = new testConfig();

    await page.goto(config.localHost);

    // TC TS_0010, TS_011
    //await useWrongEmail(page);

    //TS_0013
    let [email, password] = await createNewUser(page);
   // console.log("New user is created!")

    //TS_0021
    //await fieldButtonVerification(page);

   // await logout(page);
    //  console.log("User loged out and is on Home Page")

   // await login(page, email, password)

    //TS_009
    // await verifyExistingUser(page, email, password);


})

test('Warring message @end-to-end', async ({ page }) => {

    const config = new testConfig();

    page.goto(config.baseUrl);

    await fieldButtonVerification(page);

})

async function createNewUser(
    page: Page,
    useremail?: string,
    userpassword?: string
): Promise<[string, string]> {

    const headerPage = new HeaderPage(page);
    await headerPage.clickMyAccount();
    await headerPage.clickRegister();

    const registrationPage = new RegistrationPage(page);



    let email: string = RandomDataUtils.getEmail();
    let password: string = "test123";

   // expect(await registrationPage.fNamePlaceholder()).toContain("First Name");
    await registrationPage.setFirstName(RandomDataUtils.getFirstName());
    expect(await registrationPage.fNamePlaceholder()).toContain("First Name");

    expect(await registrationPage.lNamePlaceholder()).toContain("Last Name");
    await registrationPage.setLastName(RandomDataUtils.getLastName());

    expect(await registrationPage.eMailPlaceholder()).toContain("E-Mail");
    await registrationPage.setEmail(email);

    expect(await registrationPage.phonePlaceholder()).toContain("Telephone");
    await registrationPage.setPhoneNumber(RandomDataUtils.getPhoneNumber());

    expect(await registrationPage.pwdPlaceholder()).toContain("Password")
    expect(await registrationPage.setPassword(password)).toContain("password")

    //TC (TS_008)  Register Functionality

    expect(await registrationPage.confirmPwdPlaceholder()).toContain("Password Confirm")
    await registrationPage.cnfPassword(RandomDataUtils.getPassword());

    await registrationPage.newsletterSubscribe(checked);
    await page.waitForTimeout(5000);

    await registrationPage.confirmPrivacy();
    await registrationPage.clickContinue();
    expect(await registrationPage.warningMsgConfirmPwd()).toContain("Password confirmation does not match password!")
    expect(await registrationPage.cnfPassword(password)).toContain("password");
    await registrationPage.clickContinue();

    const newUserCreated = await registrationPage.accCreatedMsg()
    expect(newUserCreated).toContain('Your Account Has Been Created!');
    const myAccount: AccountPage = await registrationPage.continueAftreRegistration();

    if (myAccount.isOnAccountPage) {
        await myAccount.isOnAccountPage()

        const newsletter: NewsletterPage = await myAccount.clickNewletterLink();
        await page.waitForTimeout(5000);
        const whatIsChecked = await newsletter.checkedValue(checked);
        expect(whatIsChecked).toBeChecked()
    }
    else {
        expect(await registrationPage.isOnRegistartionPage()).toContain("Register Account");
    }

    console.log(email)
    return [email, password];
}

async function logout(page: Page) {

    const headerPage = new HeaderPage(page);
    await headerPage.clickMyAccount();
    const logoutPage: LogoutPage = await headerPage.clickLogout();
    expect(logoutPage.isContinueBtnVisible).toBeTruthy();
    const homePage: HomePage = await logoutPage.clickContinueBtn();
    expect(homePage.isOnHomePage).toBeTruthy()

}

async function login(page: Page, email: string, password: string) {

    const headerPage = new HeaderPage(page);

    await headerPage.clickMyAccount();
    const loginPage: LoginPage = await headerPage.clickLogin();
    const myAccount: AccountPage = await loginPage.customerLogin(email, password);
    await myAccount.isOnAccountPage();

    /*
        await loginPage.customerEmail(email);
        await loginPage.customerPassword(password);
        await loginPage.customerLoginButtons();
        const accountPage = new AccountPage(page);
        await accountPage.isOnAccountPage();
      */
}

async function fieldButtonVerification(page: Page) {

    const headerPage = new HeaderPage(page);
    await headerPage.clickMyAccount();
    const registrationPage: RegistrationPage = await headerPage.clickRegister()

    expect(await registrationPage.isOnRegistartionPage()).toContain("Register Account");

    await registrationPage.showMsgToConfirmPwdField();
    await registrationPage.clickContinue();

    const warningConfirmPwd = await registrationPage.warningMsgConfirmPwd();
    expect(warningConfirmPwd).toContain("Password confirmation does not match password!");

    const fNwarning = await registrationPage.warningMsgFirstName();
    expect(fNwarning).toContain("First Name must be between 1 and 32 characters!");

    expect(await registrationPage.warningMsgLastName()).toContain("Last Name must be between 1 and 32 characters");

    expect(await registrationPage.emailWarningMsgPresent()).toContain("E-Mail Address does not appear to be valid!");
    expect(await registrationPage.warningMsgTelephone()).toContain("Telephone must be between 3 and 32 characters!");
    expect(await registrationPage.warningMsgPwd()).toContain("Password must be between 4 and 20 characters!");
    expect(await registrationPage.warningPrivacyMsg()).toContain("Warning: You must agree to the Privacy Policy!")
    await registrationPage.confirmPrivacy();
    expect(await registrationPage.newsletterSubscribe(checked)).toContain(checked);

}


async function verifyExistingUser(page: Page, email: string, password: string) {

    const homePage = new HomePage(page);
    expect(await homePage.isOnHomePage()).toBe(true);

    const headerPage = new HeaderPage(page);
    await headerPage.clickMyAccount();
    const registrationPage: RegistrationPage = await headerPage.clickRegister();

    await registrationPage.setEmail(email)
    await registrationPage.setFirstName(RandomDataUtils.getFirstName());
    await registrationPage.setLastName(RandomDataUtils.getLastName());
    await registrationPage.setPhoneNumber(RandomDataUtils.getPhoneNumber());
    await registrationPage.setPassword(password);
    await registrationPage.cnfPassword(password);
    await registrationPage.confirmPrivacy();
    await registrationPage.clickContinue();
    expect(await registrationPage.emailRegistered()).toContain('Warning: E-Mail Address is already registered!');
}

async function useWrongEmail(page: Page): Promise<boolean> {

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


