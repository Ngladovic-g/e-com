import { expect, Page, test } from '@playwright/test'
import { HomePage } from "../pages/HomePage";
import { RegistrationPage } from "../pages/RegistrationPage";
import { testConfig } from "../test.cofing";
import { RandomDataUtils } from "../utils/randomDataGenerator"
import { AccountPage } from '../pages/AccountPage';
import { LogoutPage } from '../pages/LogoutPage';

test('Execute end to end test @end-to-end', async ({ page }) => {

    const config = new testConfig();

    page.goto(config.baseUrl);

    await createNewUser(page);
    console.log("New user is created!")

    await performeLogout(page);
    console.log("User loged out and is on Home Page")

})

test('Warring message @end-to-end' , async ({ page }) => {

    const config = new testConfig();

    page.goto(config.baseUrl);

    await warningMsgForRegistration(page);
    console.log("First name warning message displayed")


})


async function createNewUser(page: Page): Promise<string> {

    const homePage = new HomePage(page);
    await homePage.clickMyAccount();
    await homePage.clickRegister();

    const registrationPage = new RegistrationPage(page);



    let email: string = RandomDataUtils.getEmail();
    let password: string = "test123";

    await registrationPage.setFirstName(RandomDataUtils.getFirstName());
    await registrationPage.setLastName(RandomDataUtils.getLastName());
    await registrationPage.setEmail(email);
    await registrationPage.setPhoneNumber(RandomDataUtils.getPhoneNumber());
    await registrationPage.setPassword(password);
    await registrationPage.cnfPassword(password);
    await registrationPage.subscribeToYes();
    
    await registrationPage.confirmPrivacy();
    await registrationPage.clickContinue();
    const newUserCreated = await registrationPage.accCreatedMsg()
    expect(newUserCreated).toContain('Your Account Has Been Created!');

    console.log(email)
    return email;

}

async function performeLogout(page: Page) {

    const registrationPage = new RegistrationPage(page);
    const accountPage: AccountPage = await registrationPage.continueAftreRegistration()

    //const accountPage = new AccountPage(page);
    expect(await accountPage.isOnAccountPage()).toBe(true);


    const logoutPage: LogoutPage = await accountPage.clickLogoutBtn()
    expect(await logoutPage.isContinueBtnVisible()).toBe(true)

    const homePage: HomePage = await logoutPage.clickContinueBtn()
    expect(await homePage.isOnHomePage()).toBe(true);

}

async function warningMsgForRegistration(page: Page) {

    const homePage = new HomePage(page);
    await homePage.clickMyAccount();
    const registrationPage: RegistrationPage = await homePage.clickRegister()

    //const registrationPage = new RegistrationPage(page);

    expect(await registrationPage.isOnRegistartionPage()).toContain("Register Account");
    
    await registrationPage.showMsgToConfirmPwdField();
    await registrationPage.clickContinue();

    const warningConfirmPwd =await registrationPage.warningMsgConfirmPwd();
    expect(warningConfirmPwd).toContain("Password confirmation does not match password!");


    const fNwarning = await registrationPage.warningMsgFirstName();
    expect(fNwarning).toContain("First Name must be between 1 and 32 characters!");

    expect(await registrationPage.warningMsgLastName()).toContain("Last Name must be between 1 and 32 characters");
    
    expect(await registrationPage.warningMsEmail()).toContain("E-Mail Address does not appear to be valid!");
    expect(await registrationPage.warningMsgTelephone()).toContain("Telephone must be between 3 and 32 characters!");
    expect(await registrationPage.warningMsgPwd()).toContain("Password must be between 4 and 20 characters!");





}