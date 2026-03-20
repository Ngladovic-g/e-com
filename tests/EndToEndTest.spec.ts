import { expect, Page, test } from '@playwright/test'
import { HeaderPage } from "../pages/HeaderPage";
import { RegistrationPage } from "../pages/RegistrationPage";
import { testConfig } from "../test.cofing";
import { RandomDataUtils } from "../utils/randomDataGenerator"
import { AccountPage } from '../pages/AccountPage';
import { LogoutPage } from '../pages/LogoutPage';
import { NewsletterPage } from './Newsletter.spec';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';

test('Execute end to end test @end-to-end', async ({ page }) => {

    const config = new testConfig();

    page.goto(config.baseUrl);

    let [email, password] = await createNewUser(page);
    console.log("New user is created!")

   await logout(page);
    // console.log("User loged out and is on Home Page")

    await login(page, email, password);
})

test('Warring message @end-to-end' , async ({ page }) => {

    const config = new testConfig();

    page.goto(config.baseUrl);

    await fieldButtonVerification(page);
    


})


async function createNewUser(page: Page): Promise<[string, string]> {

    const headerPage = new HeaderPage(page);
    await headerPage.clickMyAccount();
    await headerPage.clickRegister();

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
    const myAccount: AccountPage = await registrationPage.continueAftreRegistration();
     
    await myAccount.isOnAccountPage()
    
    const newsletter:  NewsletterPage = await myAccount.clickNewletterLink();
    const isYesChecked = await newsletter.yesIsChecked();
    expect(isYesChecked).toBeChecked()


    console.log(email)
    return [email, password];
    

}
async function logout(page: Page) {

    const headerPage = new HeaderPage(page);
    headerPage.clickMyAccount();
    const logoutPage: LogoutPage  = await headerPage.clickLogout();
    expect( logoutPage.isContinueBtnVisible).toBeTruthy();
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
    */






    

}

async function fieldButtonVerification(page: Page) {

    const headerPage = new HeaderPage(page);
    await headerPage.clickMyAccount();
    const registrationPage: RegistrationPage = await headerPage.clickRegister()

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

    expect(await registrationPage.subscribeToYes()).toContain('Yes');
    
}
