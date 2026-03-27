import { el } from "@faker-js/faker";
import { Page, expect, Locator } from "@playwright/test";
import { LoginPage } from "./LoginPage";


export class KeyboardKeysPage {

    private readonly page: Page;
    private readonly emailPlaceholder: Locator;
    private readonly passwordInputField: Locator;

    constructor(page: Page) {

        this.page = page;
        this.emailPlaceholder = page.getByPlaceholder("E-Mail Address", { exact: true });
        this.passwordInputField = page.locator("#input-password");
    }

    async pressTabKey(email:string): Promise<void> {

        const loginPage = new LoginPage(this.page);
        const emailField = this.emailPlaceholder;

        for (let i = 0; i < 50; i++) {
            await this.page.keyboard.press('Tab');

            try {
                await expect(emailField).toBeFocused({ timeout: 200 });
                await emailField.fill(email);
                return; // success → exit function
            } catch (e) {
                // ignore and continue tabbing
            }
        }

        // final assertion (will fail the test)
        await expect(emailField).toBeFocused();

    }

    async copyCtrlC():Promise<void>{
        const passwordField =  this.passwordInputField;
        await passwordField.press("Control+A");
        return await passwordField.press("Control+C");
    }

}