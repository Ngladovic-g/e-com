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

import { KeyboardKeysPage } from '../pages/keyboardKeysPage';
import { PasswordPage } from '../pages/passwordPage';
import { SearchPage } from '../pages/SearchPage';
import { ProductDisplaypage } from '../pages/ProductDisplayPage';




let noChecked = "No"


test('Execute end to end test @end-to-end', async ({ page }) => {

    const config = new testConfig();

    await page.goto(config.localHost);
    
    await searchOption(page);
    await page.waitForTimeout(5000)
    //   await wrongEmailAndPhoneFormat(page);
    //   console.log("Correct form for email and telephone checked");

//    let [email, password] = await createNewUserAndFieldSpecVerification(page);

//    await logout(page, email, password);
 //   console.log("User loged out and is on Home Page");

    //   await login(page, email, password);
    //    console.log("User is logged in and on My Account page");


})


async function createNewUserAndFieldSpecVerification(page: Page):Promise<string[]> {


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

async function logout(page: Page, email: string, password: string):Promise<void> {

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
        expect(await loginPage.isOnLoginPage()).toContain("Login");
        const myAccount: AccountPage = await loginPage.customerLogin(email, password);
        expect(await myAccount.isOnAccountPage()).toBe(true);
    }

    await userLogin(email, password)
    const myAccount = new AccountPage(page);
    await myAccount.choseOptionfromSidebar("Logout");
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
    expect(await loginPage.isOnLoginPage()).toContain("Login");

    //TC_LG_005
    await header.clickMyAccount();
    expect(await header.logoutButtonVisible()).toBe(false);

    //TC_LG_005

    const register: RegistrationPage = await header.clickRegister();
    expect(await register.isOnRegistartionPage()).toContain("Register Account");
    const logoutPresent = await account.choseOptionfromSidebar("Logout");
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
    expect(await logout.breadCrumbsList("Logout")).toContain("Logout");
    expect(await logout.pageURL()).toContain("http://localhost/opencart/upload/index.php?route=account/logout");
    



}

async function login(page: Page, email?: string, password?: string):Promise<void> {

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
    expect(await loginPage.exceededAttempts()).toContain("Warning: Your account has exceeded allowed number of login attempts. Please try again in 1 hour.");

    //Passord value not present in Page source(Failing)
    //await loginPage.customerLoginButton();
    //expect(await loginPage.passwordValueAttribur()).not.toContain("");


    //"Warning: The E-Mail Address was not found in our records, please try again!" get before
    // expect(await loginPage.warningMessagePresent()).toContain("Warning: No match for E-Mail Address and/or Password.");


    await myAccount.choseOptionfromSidebar("Forgotten Password");
    expect(await passwordPage.isOnForgotYourPasswordPage()).toBe(true);

    //Wrong email used and message displayed after pressing continue button
    await passwordPage.emailInputForForgotenEmail("wadkoaw");
    await passwordPage.forgotenPasswordContniuBtn();
    expect(await passwordPage.emailNotFound()).toContain("Warning: The E-Mail Address was not found in our records, please try again!");

    //Correct email used, going back to login page and success email message
    await passwordPage.emailInputForForgotenEmail(email ?? "abc@gmail.com");

    await passwordPage.forgotenPasswordContniuBtn();
    expect(await loginPage.isOnLoginPage());
    expect(await loginPage.confirmationMsg()).toContain("An email with a confirmation link has been sent your email address.");

    // select Email field using Tab keystroke
    await loginPage.pressTabKey(email ?? '');
    await keyboard.copyValue();


    //Try copy of password
    await loginPage.customerPassword(password ?? '');
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
    await myAccount.choseOptionfromSidebar("Password");
    await passwordPage.passwordChange(changePassword);
    await passwordPage.passwordConfirm(changePassword)
    await passwordPage.continueButton();
    expect(await myAccount.isOnAccountPage()).toBe(true);
    expect(await myAccount.passwordMsgSuccessChange()).toContain("Success: Your password has been successfully updated.")
    await headerPage.clickMyAccount();
    const logoutPage = await headerPage.clickLogout();
    const homePage = await logoutPage.clickContinueBtn();
    expect(await homePage.isOnHomePage()).toBe(true);
    await headerPage.clickMyAccount();
    await headerPage.clickLogin();
    await loginPage.customerEmail(email ?? "");
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
    expect(await register.isOnRegistartionPage()).toContain("Register Account");
    await page.goBack();
    const account = new AccountPage(page);
    await account.choseOptionfromSidebar("Forgotten Password");
    const pass = new PasswordPage(page);
    expect(await pass.isOnForgotYourPasswordPage()).toBe(true);

    //TC_LF_020 Navigating to login page from different pages
    await account.choseOptionfromSidebar("Register");
    expect(await register.isOnRegistartionPage()).toContain("Register Account");
    await account.choseOptionfromSidebar("Login");
    expect(await login.isOnLoginPage()).toContain("Login");
    await account.choseOptionfromSidebar("Login");
    expect(await login.isOnLoginPage()).toContain("Login");
    await header.clickMyAccount()
    await header.clickLogin();
    expect(await login.isOnLoginPage()).toContain("Login");

    //TC_LF_021 Breadcrumbs, header, url, title

    expect(await login.breadcrumbsList('Login')).toContain("Login");
    expect(await homePage.pageUrl()).toContain('http://localhost/opencart/upload/index.php?route=account/account');
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

async function searchOption(page: Page):Promise<void>{

    const header = new HeaderPage(page);
    const config = new testConfig();
    
let email = config.username1;
let password = config.password1;

const SearchPage: SearchPage = await header.productSearch(`ipod`);
expect(await SearchPage.resultProduct()).toBe(4);
expect(await SearchPage.productTitle(`ipod`)).toHaveLength(4)


async function productCount(name:string, count: number){
const productCount = await SearchPage.resultProduct();
expect(await SearchPage.resultProduct()).toBe(count);
expect(await SearchPage.productTitle(name)).toHaveLength(productCount);

}

//TC_SF_001
const search: SearchPage = await header.productSearch(`Mac`);
await productCount(`Mac`, 4);

//TC_SF_0002

await header.productSearch(`Fitbit`);
await productCount(`Fitbit`, 0);
expect(await search.noProductAvailableMsg()).toBe(true);

//TC_SF_003

await header.productName()
expect(await search.noProductAvailableMsg()).toBe(true);

//TC_SF_004

await header.clickMyAccount();
const loginPage: LoginPage = await header.clickLogin();
expect(await loginPage.isOnLoginPage()).toContain(`Login`);
await loginPage.customerLogin(email, password);
await header.productSearch(`iMac`);
expect(await search.isOnSearchPage()).toBe(true);
await productCount(`iMac`, 1)

//TC_SF_005
await header.productSearch(`ipod`);
await productCount(`ipod`, 4);

//TC_SF_006

expect(await search.clearSearchCriteria()).toBe(``)
expect(await search.getSearchCriteriaAttribut()).toContain(`Keywords`);
expect(await header.clearSearchInput()).toBe(``);
expect(await header.searchInputPlacholder()).toContain(`Search`);

//TC_SF_007

expect(await search.keywordInputField(`ipod`)).toBe(`ipod`)
await search.buttonKeywordSearch();
await productCount(`ipod`, 4);

//TC_SF_008
const homePage: HomePage = await header.goToHomePage();
expect(await homePage.isOnHomePage()).toBe(true);
await header.buttonSearch();
expect(await search.isOnSearchPage()).toBe(true);
expect(await search.tickCheckbox()).toBeChecked();
expect(await search.keywordInputField(`iLife`)).toBe(`iLife`)
await search.buttonKeywordSearch();
await productCount(`iMac`, 1);

//TC_SF_009
await header.goToHomePage();
expect(await homePage.isOnHomePage()).toBe(true);
await header.buttonSearch();
expect(await search.isOnSearchPage()).toBe(true);
await search.keywordInputField("iMac");
expect(await search.selectCategory(`Mac`)).toBe(`Mac`)
await search.buttonKeywordSearch();
await productCount(`iMac`, 1);
expect(await search.selectCategory("PC")).toBe(`PC`);
await search.buttonKeywordSearch();
expect(await search.noProductAvailableMsg()).toBe(true)

//TC_SF_010

expect(await search.selectCategory(`Desktops`)).toBe('Desktops');
await search.buttonKeywordSearch();
expect(await search.noProductAvailableMsg()).toBe(true)
expect(await search.subCheck()).toBeChecked();
await search.buttonKeywordSearch();
await productCount('iMac', 1);

//TC_SF_011

expect(await search.selectView("List")).toContain(`product-list`);
let {addCart, wishlist, compare} = await search.buttonsEnabled() 
expect(addCart).toBe(true);
expect(wishlist).toBe(true);
expect(compare).toBe(true);
const productPage: ProductDisplaypage = await search.clickOnProducImg(`iMac`);
expect(await productPage.productButtons()).toEqual({add:true, wish:true, compareProduct:true});
await page.goBack();
expect(await search.selectView("Grid")).toContain(`product-grid`);
expect(await search.buttonsEnabled()).toEqual({addCart:true, wishlist:true,compare:true})
await search.clickOnProducImg(`iMac`);
expect(await productPage.isOnProductPage()).toContain('iMac');
expect(await productPage.productButtons()).toEqual({add:true, wish:true, compareProduct:true});





}


