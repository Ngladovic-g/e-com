import { Page, Locator, expect } from "@playwright/test";
import { ProductComparisonPage } from "./ProductComparisonPage";

export class ProductDisplaypage {

    private readonly page: Page;
    private readonly addToCartButton: Locator;
    private readonly wishlistButton: Locator;
    private readonly compareButton: Locator;
    private readonly pageHeader: Locator;
    private readonly tooltip: Locator;
    private readonly relatedProducts: Locator;
    private readonly productComparisonLink: Locator;
    private readonly mainProductCompareButton: Locator;
    private readonly productAddedToComparisonMsg: Locator;
    private readonly productMainImg: Locator;
    private readonly productAdditionalImg: Locator;
    private readonly imagesPageCounter: Locator;
    private readonly nextImgButton: Locator;
    private readonly previousImgButton: Locator;
    private readonly closeImgButton: Locator;
    private readonly priceBeforeTax: Locator;
    private readonly brand: Locator;
    private readonly productCode: Locator;
    private readonly availabilityProduct: Locator;
    private readonly priceAfterTax: Locator;
    private readonly quantityQty: Locator;
    private readonly numberofProducts: Locator;
    private readonly minimumQuantity: Locator;
    private readonly radioButtons: Locator;
    private readonly checkboxes: Locator;
    private readonly selectOption: Locator;
    private readonly textArea: Locator;
    private readonly uploadFile: Locator;
    private readonly dateInput: Locator;
    private readonly dateOptions: Locator;
    private readonly currentMonthYear: Locator;
    private readonly dateBackBtn: Locator;
    private readonly dateNextBtn: Locator;
    private readonly datesInMonth: Locator;
    private readonly timeInputField: Locator;
    private readonly timeButton: Locator;
    private readonly hourPicker: Locator;
    private readonly hourList: Locator;
    private readonly hourUp: Locator;
    private readonly hourDown: Locator;
    private readonly minutePicker: Locator;
    private readonly minuteList: Locator;
    private readonly minuteUp: Locator;
    private readonly minuteDown: Locator;




    constructor(page: Page) {

        this.page = page;
        this.addToCartButton = page.locator("#button-cart");
        this.pageHeader = page.locator("h1")
        //locator bellow will return 2 buttons
        this.wishlistButton = page.locator("button[data-original-title='Add to Wish List']")//.nth(0);
        //locator bellow will return 2 buttons
        this.compareButton = page.locator("button[data-original-title='Compare this Product']")//.nth(0);
        this.tooltip = page.locator(".tooltip-inner");
        this.relatedProducts = page.locator("div.product-thumb.transition");
        this.productComparisonLink = page.getByRole('link', { name: 'product comparison' })
        this.mainProductCompareButton = page.locator(".btn-group>button[data-original-title='Compare this Product']")
        this.productAddedToComparisonMsg = page.locator(".alert.alert-success.alert-dismissible")
        this.productMainImg = page.locator(".thumbnail").nth(0);
        this.productAdditionalImg = page.locator(".thumbnail").nth(1)
        this.imagesPageCounter = page.locator(".mfp-counter");
        this.nextImgButton = page.locator("button[title='Next (Right arrow key)']");
        this.previousImgButton = page.locator("button[title='Previous (Left arrow key)']");
        this.closeImgButton = page.locator("button[title='Close (Esc)']");
        this.brand = page.locator(".list-unstyled>li:has-text('Brand')");
        this.priceBeforeTax = page.locator(".list-unstyled>li:has-text('Ex Tax:')")
        this.priceAfterTax = page.locator(".list-unstyled>li>h2")
        this.productCode = page.locator("ul>li:has-text('Product Code:')");
        this.availabilityProduct = page.locator("ul>li:has-text('Availability')");
        this.quantityQty = page.locator("label.control-label:has-text('Qty')");
        this.numberofProducts = page.locator("#input-quantity");
        this.minimumQuantity = page.locator(".alert.alert-info");
        this.radioButtons = page.locator("#input-option218 label");
        this.checkboxes = page.locator("#input-option223 label");
        this.selectOption = page.locator("#input-option217");
        this.textArea = page.locator("#input-option209");
        this.uploadFile = page.locator("#button-upload222");
        this.dateInput = page.locator("#input-option219");
        this.dateOptions = page.locator("div[class='input-group date'] button[class='btn btn-default']");
        this.currentMonthYear = page.locator(".picker-switch").nth(0)
        this.dateBackBtn = page.locator('th.prev:visible');
        this.dateNextBtn = page.locator("th.next:visible");
        this.datesInMonth = page.locator(".picker-open td[class='day']");
        this.timeInputField = page.locator("#input-option221");
        this.timeButton = page.locator("div[class='input-group time'] button[class='btn btn-default']");
        this.hourPicker = page.locator(".picker-open [class='timepicker-hour']");
        this.hourList = page.locator(".picker-open td[class='hour']");
        this.hourUp = page.locator(".picker-open a[data-action='incrementHours']");
        this.hourDown = page.locator(".picker-open a[data-action='decrementHours']");
        this.minutePicker = page.locator(".picker-open [class='timepicker-minute']");
        this.minuteList = page.locator(".picker-open td[class='minute']");
        this.minuteUp = page.locator(".picker-open a[data-action='incrementMinutes'] span[class='glyphicon glyphicon-chevron-up']");
        this.minuteDown = page.locator(".picker-open a[data-action='decrementMinutes'] span[class='glyphicon glyphicon-chevron-down']");



    }


    async isOnProductPage(): Promise<string> {

        return await this.pageHeader.innerText() ?? ''

    }

    async addToCartProductButtons(): Promise<boolean> {

        const addButtons = await this.addToCartButton.all();

        for (const addButton of addButtons) {
            if (!addButton.isEnabled()) return false;
        }
        return true
    }


    async wishListButtons(): Promise<boolean> {

        const wishlistButtons = await this.wishlistButton.all();

        for (const wishList of wishlistButtons) {
            if (!wishList.isEnabled()) return false;
        }
        return true
    }

    async compareButtons(): Promise<boolean> {

        const compareButtons = await this.compareButton.all();

        for (const compareButton of compareButtons) {
            if (!compareButton.isEnabled()) return false;
        }
        return true
    }

    async compareButtonRelatedProductsTooltip(): Promise<string> {

        const count = await this.relatedProducts.count();

        for (let i = 0; i < count; i++) {

            await this.relatedProducts.nth(i).locator(this.compareButton).hover();
            const tooltip = this.tooltip.filter({ hasText: "Compare this Product" });
            await tooltip.waitFor({ state: "visible", timeout: 5000 });
            return await tooltip.textContent() ?? '';

        }
        return ''
    }

    async addAllRelatedProductsToCompare(): Promise<string[]> {

        const counts = await this.relatedProducts.count();
        const successMessages: string[] = [];

        for (let i = 0; i < counts; i++) {

            const cleanName = (await this.relatedProducts.nth(i).locator('div>h4>a').textContent())?.trim();

            await this.relatedProducts.nth(i).locator(this.compareButton).click();

            const successMsg = this.page.locator('div.alert-success').filter({ hasText: cleanName });
            await successMsg.waitFor({ state: "visible", timeout: 5000 });

            successMessages.push(await successMsg.innerText() ?? '');


        }
        return successMessages
    }

    async clickOnProductComparisonLink(): Promise<ProductComparisonPage> {

        await this.productComparisonLink.click();
        return new ProductComparisonPage(this.page);
    }

    async addProductToCompare(): Promise<void> {

        await this.mainProductCompareButton.click();

    }

    async productAddedSuccessMsg(): Promise<boolean> {

        await this.productAddedToComparisonMsg.waitFor({ timeout: 3000 });
        return this.productAddedToComparisonMsg.isVisible();
    }

    async clickOnProductImg(value: string): Promise<void> {

        if (value === "Main") {

            await this.productMainImg.click();
        }
        else if (value === "Other") {
            await this.productAdditionalImg.click();
        }
    }


    async verifyImageNavigation(): Promise<void> {
        const counterText = await this.imagesPageCounter.textContent();
        const total = parseInt(counterText?.split('of')[1].trim() ?? '0');
        const current = parseInt(counterText?.split('of')[0].trim() ?? '1');

        // go forward through all images
        for (let i = current + 1; i <= total; i++) {
            await this.nextImgButton.click();
            await expect(this.imagesPageCounter).toHaveText(`${i} of ${total}`);
        }

        // go backward through all images
        for (let i = total - 1; i >= 1; i--) {
            await this.previousImgButton.click();
            await expect(this.imagesPageCounter).toHaveText(`${i} of ${total}`);
        }

        await this.closeImgButton.click();
    }

    async productBrand(value: string): Promise<string> {

        return await this.brand.locator(`a:has-text('${value}')`).innerText() ?? ''
    }

    async codeOfProduct(): Promise<string> {

        return await this.productCode.innerText() ?? ''

    }

    async availabilityOfProduct(value: string): Promise<string> {

        const isInStock = await this.availabilityProduct.textContent();
        const available = isInStock?.split(' ').slice(1).join(' ');

        return available === value
            ? `Availability: ${available}`
            : `Product not in stock or limited stock`;

    }

    async priceWithoutTax(): Promise<number> {

        const priceText = await this.priceBeforeTax.innerText();
        const cleanPrice = priceText?.replace('Ex Tax: $', '').trim();

        return parseFloat(cleanPrice ?? '0');

    }

    async priceWithATax(): Promise<number> {

        return await this.priceWithoutTax() * (1 + (2 / 100) + (20 / 100));

        //return parseFloat(price ?? '0');
    }

    async quantityOfProduct(): Promise<string> {

        return await this.quantityQty.innerText() ?? '';

    }

    async getProductQuantity(): Promise<string | null> {

        return await this.numberofProducts.getAttribute('value');


    }

    async setProdctQuantity(value: string): Promise<string | null> {

        await this.numberofProducts.evaluate(el => el.setAttribute("value", "3"));
        return await this.numberofProducts.getAttribute('value');

    }

    async minQuantity(): Promise<string[]> {

        const text = await this.minimumQuantity.innerText();
        const amount = text?.replace("This product has a minimum quantity of", "").trim();
        return [text, amount]
    }

    async radioButtonsCheck(value: string): Promise<boolean> {

        const buttons = await this.radioButtons.all();


        for (const button of buttons) {

            const text = await button.textContent();
            const cleanText = text?.replace(/\s+/g, ' ').trim();


            if (value === cleanText) {
                await button.locator('input').check();
                return await button.locator('input').isChecked();
            }

        }
        return false;

    }

    async checkBoxes(cb1: string, cb2?: string, cb3?: string, cb4?: string): Promise<boolean> {

        const checkboxes = await this.checkboxes.all();
        const valuesToCheck = [cb1, cb2, cb3, cb4].filter(Boolean);
        let anyChecked = false;

        for (const checkbox of checkboxes) {

            const text = await checkbox.textContent()
            const cleanText = text?.replace(/\s+/g, ' ').trim();


            if (valuesToCheck.includes(cleanText!)) {

                await checkbox.locator("input").check();
                anyChecked = await checkbox.locator("input").isChecked()
            }
        }
        return anyChecked;
    }

    async pageOptionSelect(value: string): Promise<boolean> {

        const options = await this.selectOption.locator("option").all();

        for (const option of options) {

            const text = await option.innerText();
            const cleanText = text?.replace(/\s+/g, " ").trim();


            if (value === cleanText) {

                await this.selectOption.selectOption({ label: cleanText! });
                const selected = await this.selectOption.inputValue();
                const selectedText = (await this.selectOption
                    .locator(`option[value="${selected}"]`)
                    .textContent())?.replace(/\s+/g, ' ').trim();

                return selectedText === value;
            }
        }
        return false
    }

    async fillTextArea(value: string): Promise<boolean> {

        await this.textArea.clear();
        await this.textArea.fill(value);

        const input = await this.textArea.inputValue();
        return input === value;
    }

    async setUploadFile(): Promise<string> {

        let dialogMessage = '';

        this.page.once('dialog', async dialog => {
            dialogMessage = dialog.message();
            await dialog.accept();
        });

        const [fileCooser] = await Promise.all([
            this.page.waitForEvent('filechooser'),
            this.uploadFile.click()
        ]);

        await fileCooser.setFiles('e-com/files/Jenkins+Setup (1).pdf');

        await this.page.waitForTimeout(1000);

        return dialogMessage;
    }

    async setDate(year: string, month: string, day: string): Promise<string> {

        await this.dateInput.clear();
        await this.dateInput.fill(`${year}-${month}-${day}`);

        return this.dateInput.inputValue() ?? ''

    }

    async pickDate(year: string, month: string, day: string): Promise<string> {

        await this.dateOptions.click();

        while (true) {

            const yearAndMonth = await this.currentMonthYear.textContent() ?? '';
            const [currentMonth, currentYear] = yearAndMonth?.trim().split(' ');

            if (currentMonth === month && currentYear === year) {
                break;
            }
            await (currentYear > year ? this.dateBackBtn : this.dateNextBtn).click();

        }

        const dates = await this.datesInMonth.all();

        for (let date of dates) {
            const dt = await date.innerText();

            if (dt === day) {

                await date.click();
                break;
            }
        }
        return await this.dateInput.inputValue() ?? '';
    }

    async setTime(hour: string, minutes: string): Promise<string> {

        await this.timeInputField.clear();
        await this.timeInputField.fill(`${hour}:${minutes}`);

        return await this.timeInputField.inputValue() ?? ''
    }

    async pickTimeViaBtn(hour: string, minute: string): Promise<void> {

        await this.timeButton.click();
    

    while(true){
        const hours =  await this.hourPicker.innerText();
        const minutes = await this.minutePicker.innerText();

        if(hours === hour && minutes === minute){

            await this.timeButton.click();
        }
        await (hours > hour ? this.hourDown : this.hourUp).click();
        await (minutes > minute ? this.minuteDown : this.minuteUp).click();

    }

    }

}