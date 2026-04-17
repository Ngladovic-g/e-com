import { Page, expect, Locator } from '@playwright/test'
import { RegistrationPage } from './RegistrationPage';
import { LogoutPage } from './LogoutPage';
import { SearchPage } from './SearchPage';
import { LoginPage } from './LoginPage';
import { HomePage } from './HomePage';
import { DesktopsPage } from './DesktopsPage';

export class HeaderPage {

    private readonly page: Page;

    //Locators

    private readonly myAccountLink: Locator;
    private readonly registerLink: Locator;
    private readonly logoutLink: Locator;
    private readonly loginLink: Locator;
    private readonly searchInputField: Locator;
    private readonly searchButton: Locator;
    private readonly homePageLogo: Locator;
    private readonly desktopsHover:Locator;
    private readonly showAllDesktopsLink: Locator;





    constructor(page: Page) {
        this.page = page;
        this.myAccountLink = page.locator("span:has-text('My Account')");
        this.registerLink = page.locator("a:has-text('Register')").nth(0);
        this.logoutLink = page.locator("li>a:has-text('Logout')");
        this.loginLink = page.locator(".dropdown-menu>li>a:has-text('Login')");
        this.searchButton = page.locator("button.btn.btn-default.btn-lg");
        this.searchInputField = page.locator("input.form-control").nth(0);
        this.homePageLogo = page.locator("#logo");
        this.desktopsHover = page.locator("li>a:has-text('Desktops')")
        this.showAllDesktopsLink =  page.getByRole('link', { name: 'Show All Desktops' })
        


    }


    async goToHomePage():Promise<HomePage>{

       await this.homePageLogo.click();
       return new HomePage(this.page);
    }
    async pageUrl(): Promise<string> {

        return this.page.url();

    }

    async clickMyAccount(): Promise<void> {
        try {
            await this.myAccountLink.click()
        }
        catch (error) {
            console.log(`Exception occured while clicking My Account: ${error}`);
            throw error;
        }
    }

    async clickRegister(): Promise<RegistrationPage> {
        try {
            await this.registerLink.click();
            return new RegistrationPage(this.page);
        }
        catch (error) {
            console.log(`Expception while clicking on Registration link: ${error}`)
            throw error;
        }
    }

    async logoutButtonVisible(): Promise<boolean> {

        return this.logoutLink.isVisible();

    }

    async clickLogout(): Promise<LogoutPage> {
        await this.logoutLink.click()
        return new LogoutPage(this.page);

    }

    async clickLogin(): Promise<LoginPage> {
        await this.loginLink.click();
        return new LoginPage(this.page)

    }

    async productName(product?: string): Promise<void> {
        await this.searchInputField.clear();
        await this.searchInputField.fill(product ?? '');

    }

    async clearSearchInput():Promise<string>{
        await this.searchInputField.clear();
        return await this.searchInputField.inputValue();
    }

    async searchInputPlacholder():Promise<string>{
        
        return await this.searchInputField.getAttribute('placeholder') ?? ''
    }

    async buttonSearch(): Promise<void> {
        await this.searchButton.click();

    }

    async productSearch(productSearch: string): Promise<SearchPage> {
        await this.searchInputField.clear();
        await this.searchInputField.fill(productSearch);
        await this.searchButton.click();
        return new SearchPage(this.page)

    }

    async openDesktops():Promise<void>{

        await this.desktopsHover.hover();
    }

    async chosseShowAllDesktops():Promise<DesktopsPage>{

        await this.showAllDesktopsLink.click();
        return new DesktopsPage(this.page)
    }

}