import { HomePage } from "../pages/HomePage";
import { RegistrationPage } from "../pages/RegistrationPage";
import { testConfig } from "../test.cofing";
import { RandomDataUtils } from "../utils/randomDataGenerator";
import { test, expect } from "@playwright/test";
import { AccountPage } from "../pages/AccountPage";


let homePage: HomePage;
let registrationPage: RegistrationPage;
let config: testConfig;
let accountPage: AccountPage;

test.beforeEach(async ({ page }) => {
    config = new testConfig;
    await page.goto(config.baseUrl);
    homePage = new HomePage(page);
    registrationPage = new RegistrationPage(page)
    accountPage = new AccountPage(page);

})
test.afterEach(async ({ page }) => {
    await page.waitForTimeout(5000);
    await page.close();
})

test("Visit url and Register user", async ({ page }) => {

    await homePage.isOnHomePage();
    await homePage.clickMyAccount();
    await homePage.clickRegister()
    await expect(page.locator("div>h1:has-text('Register Account')")).toContainText(("Register Account"));

    let pwd = RandomDataUtils.getPassword()
    await registrationPage.setFirstName(RandomDataUtils.getFirstName());
    await registrationPage.setLastName(RandomDataUtils.getLastName());
    await registrationPage.setEmail(RandomDataUtils.getEmail());
    await registrationPage.setPhoneNumber(RandomDataUtils.getPhoneNumber());
    await registrationPage.setPassword(pwd);
    await registrationPage.cnfPassword(pwd);
    await registrationPage.confirmPrivacy();
    await registrationPage.clickContinue();

    const accCreated = await registrationPage.accCreatedMsg();
    expect(accCreated).toContain("Your Account Has Been Created!")

    await registrationPage.continueAftreRegistration();
    expect(await accountPage.isOnAccountPage()).toBeTruthy();
})





