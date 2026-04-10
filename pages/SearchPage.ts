import { Page, expect, Locator } from "@playwright/test";
import { ProductDisplaypage } from "./ProductDisplayPage";
import { ProductComparisonPage } from "./ProductComparisonPage";


export class SearchPage {

    private readonly page: Page;
    private readonly productCount: Locator;
    private readonly productHeader: Locator;
    private readonly noProductMsg: Locator;
    private readonly searchKeywordInputField: Locator;
    private readonly keySearchButton: Locator;
    private readonly productDescriptionCheckbox: Locator;
    private readonly categoryDropdown: Locator;
    private readonly openDropdown: Locator;
    private readonly subcategoryCheck: Locator;
    private readonly listView: Locator;
    private readonly gridView: Locator;
    private readonly productLayout: Locator;
    private readonly productName: Locator;
    private readonly addToCart: Locator;
    private readonly addToWish: Locator;
    private readonly compareProductBtn: Locator;
    private readonly productComparisonLink: Locator;
    private readonly sortByOptions: Locator;
    private readonly sortBy: Locator;
    private readonly showNumber: Locator;
    private readonly showNumberOptions: Locator;
    private readonly breadcrumbs: Locator;
    private readonly breadcrumbList: Locator;
    private readonly tooltip: Locator;







    constructor(page: Page) {

        this.page = page;
        this.productCount = page.locator("div.product-thumb");
        this.productHeader = page.locator("h4>a");
        this.noProductMsg = page.getByText('There is no product that matches the search criteria.', { exact: true });
        this.searchKeywordInputField = page.locator("#input-search");
        this.keySearchButton = page.locator("#button-search");
        this.productDescriptionCheckbox = page.locator("#description");
        this.openDropdown = page.locator("select[name='category_id']")
        this.categoryDropdown = page.locator("select[class='form-control']>option");
        this.subcategoryCheck = page.locator("input[name='sub_category']");
        this.listView = page.locator("#list-view");
        this.gridView = page.locator("#grid-view");
        this.productLayout = page.locator(".product-layout");
        this.addToCart = page.locator("span:has-text('Add to Cart')")
        this.addToWish = page.locator("button[data-original-title='Add to Wish List']");
        this.compareProductBtn = page.locator("button[data-original-title='Compare this Product']");
        this.productComparisonLink = page.getByRole('link', { name: 'product comparison' });
        this.sortByOptions = page.locator("#input-sort>option");
        this.sortBy = page.locator("#input-sort");
        this.showNumber = page.locator("#input-limit");
        this.showNumberOptions = page.locator("#input-limit>option");
        this.breadcrumbs = page.locator(".breadcrumb");
        this.breadcrumbList = page.locator("ul.breadcrumb>li>a");
        this.productName = page.locator("div.product-thumb h4 a");
        this.tooltip = page.locator(".tooltip-inner")


    }


    async isOnSearchPage(): Promise<boolean> {
        await this.page.title();
        return true

    }

    async resultProduct(): Promise<number> {

        return await this.productCount.count()

    }

    async clearSearchCriteria(): Promise<string> {
        await this.searchKeywordInputField.clear();
        return await this.searchKeywordInputField.inputValue();
    }

    async getSearchCriteriaAttribut(): Promise<string> {

        return await this.searchKeywordInputField.getAttribute('placeholder') ?? '';
    }

    async productTitle(product: string): Promise<string[]> {

        const count = await this.productHeader.count();
        const matches: string[] = [];

        for (let i = 0; i < count; i++) {

            const list = this.productHeader.nth(i);
            const name = await list.textContent();

            if (name?.toLowerCase().includes(product.toLowerCase())) {

                matches.push(name.trim())


            }
            if (matches.length === 0)
                throw new Error(`Product containing "${product}" not found`)

        }
        return matches;

    }

    async noProductAvailableMsg(): Promise<boolean> {

        return await this.noProductMsg.isVisible();

    }

    async buttonKeywordSearch(): Promise<void> {

        await this.keySearchButton.click();

    }

    async keywordInputField(product: string): Promise<string> {

        await this.searchKeywordInputField.fill(product);
        return this.searchKeywordInputField.inputValue();

    }

    async tickCheckbox(): Promise<Locator> {

        const checkbox = await this.productDescriptionCheckbox.isChecked();

        if (!checkbox) {

            await this.productDescriptionCheckbox.check()

        }
        return this.productDescriptionCheckbox;
    }

    async subCheck(): Promise<Locator> {

        const checkbox = await this.subcategoryCheck.isChecked();

        if (!checkbox) {

            await this.subcategoryCheck.check()

        }
        return this.subcategoryCheck;
    }

    async selectCategory(category: string): Promise<string> {


        const options = await this.categoryDropdown.all();

        for (const option of options) {
            const text = await option.textContent();
            const cleanText = text?.replace(/\u00A0/g, '').trim();


            if (cleanText === category) {
                const value = await option.getAttribute('value')
                await this.openDropdown.selectOption({ value: value! });
                return cleanText
            }
        }
        return ``;

    }

    async selectView(view: string): Promise<string> {


        if (view === "List") {

            await this.listView.click();
        }
        else {
            await this.gridView.click();
        }
        return await this.productLayout.nth(0).getAttribute("class") ?? '';


    }

    async addToCartButtonsEnabled(): Promise<boolean> {

        const addCart = await this.addToCart.all();

        for (const cart of addCart) {
            if (!await cart.isEnabled()) return false;
        }
        return true
    }

    async wishlistButtonsEnabled(): Promise<boolean> {

        const wishes = await this.addToWish.all();

        for (const wish of wishes) {
            if (!wish.isEnabled()) return false;
        }
        return true;

    }

    async compareButtonEnabled(): Promise<boolean> {

        const comparing = await this.compareProductBtn.all();

        for (const compare of comparing) {
            if (!compare.isEnabled()) return false;

        }
        return true;
    }

    async clickOnProducImg(product: string): Promise<ProductDisplaypage> {

        await this.page.locator(`img[alt='${product}']`).click();
        return new ProductDisplaypage(this.page)


    }

    async addProductToCompare(value: string): Promise<boolean> {

        const productCards = await this.productLayout.count();

        for (let i = 0; i < productCards; i++) {

            const title = await this.productLayout.nth(i).locator(this.productName).textContent();
            const cleanText = title?.trim();

            if (value === cleanText) {

                await this.productLayout.nth(i).locator(this.compareProductBtn).click();

                const successMsg = this.page.getByText(`Success: You have added ${value} to your product comparison! ×`, { exact: true });
                await successMsg.waitFor({ state: 'visible', timeout: 5000 });
                return await successMsg.isVisible();
            }
        }
        return false;
    }

    async hoverCompareText(value?: string): Promise<string> {

        if (value === `compare`) {
            await this.compareProductBtn.nth(0).hover();
           
            const compareTooltip = this.tooltip.filter({hasText: "Compare this Product"});
            await compareTooltip.waitFor({ state: "visible", timeout: 5000 })
            return await compareTooltip.textContent() ?? ''
        }
        else {
            await this.addToWish.nth(0).hover();
            
            const wishlistTooltip = this.tooltip.filter({hasText: "Add to Wish List"});
            await wishlistTooltip.waitFor({ state: "visible", timeout: 5000});
            return await wishlistTooltip.textContent() ?? ''
        }

    }

    async productComparisonPageLink(): Promise<ProductComparisonPage> {

        await this.productComparisonLink.click();
        return new ProductComparisonPage(this.page);

    }

    async selectSortBy(value: string): Promise<string> {

        const sortByOption = await this.sortByOptions.all();

        for (const option of sortByOption) {

            const name = await option.textContent();
            if (value === name) {
                await this.sortBy.selectOption({ label: name });
                return name;
            }
        }
        return `No option avaliable in sort by`
    }

    async selectShowNumber(value: string): Promise<string> {

        await this.showNumber.click();
        const numbers = await this.showNumberOptions.all();


        for (const number of numbers) {

            const text = await number.textContent();

            if (value === text) {
                await this.showNumber.selectOption({ label: text! });
                return text!;
            }
        }
        return `Number option not available`

    }

    async isBreadcrumbsVisible(): Promise<boolean> {

        const isVisible = await this.breadcrumbs.isVisible();
        if (isVisible) {
            return true
        }
        return false;
    }

    async clickBreadcrumb(linkText: string): Promise<void> {
        const links = await this.breadcrumbList.all();

        for (const link of links) {
            const text = await link.textContent();
            const cleanText = text?.trim();

            if (linkText === 'Home' && await link.locator('i.fa-home').count() > 0) {
                const href = await link.getAttribute('href');
                await this.page.goto(href!); // 
                return;
            }

            if (cleanText === linkText) {
                const href = await link.getAttribute('href');
                await this.page.goto(href!); // 
                return;
            }
        }
        throw new Error(`Breadcrumb link "${linkText}" not found`);
    }

    async navigateToProductByKeyboard(productName: string): Promise<void> {
        const product = this.page.locator(`a:has(img[alt='${productName}'])`);

        //await product.focus();                    // 👈 focus directly
        await this.page.keyboard.press('Tab');    // 👈 one Tab
        await product.focus();
        await this.page.keyboard.press('Enter');  // 👈 open with Enter
    }






}
