import { Page, Locator, expect } from "@playwright/test";
import { HomePage } from "./HomePage";

export class ProductComparisonPage {

    private readonly page: Page;
    private readonly pageTitle: Locator;
    private readonly productTitles: Locator;
    private readonly productNotchosenforCompare: Locator;
    private readonly productsRemoveButton: Locator;
    private readonly continueButton: Locator;
    private readonly breadcrumb: Locator;
    

    constructor(page: Page) {

        this.page = page;
        this.pageTitle = page.locator("#content>h1");
        this.productTitles = page.locator("tr>td>a>strong");
        this.productNotchosenforCompare = page.locator("#content>p:has-text('You have not chosen any products to compare.')")
        this.productsRemoveButton = page.locator("a.btn.btn-danger.btn-block")
        this.continueButton = page.locator("div.pull-right>a.btn.btn-default");
        this.breadcrumb = page.locator(".breadcrumb a:has-text('Product Comparison')")
    }


    async isOnComparisonPage(): Promise<string> {

        return await this.pageTitle.innerText() ?? '';

    }

    async validateProductTitle(...values: string[]): Promise<boolean> {

        const titles = await this.productTitles.all();
       

        const cleanTitles = await Promise.all(
            titles.map(async title => (await title.textContent())?.trim())
        );

        return values.every(value => cleanTitles.includes(value));
    }

    async removedProductsFromPage():Promise<void>{

      const buttons =  await this.productsRemoveButton.count();

      for(let i=0; i<buttons; i++){

        const button =  this.productsRemoveButton.nth(0);
        button.waitFor({timeout:3000})
        await button.click();
      }
    }

    async noProductSelectedForCompare():Promise<string>{

        return await this.productNotchosenforCompare.innerText() ?? '';
    }

    async clickOnContinueButton():Promise<HomePage>{

        await this.continueButton.click();
        return new HomePage(this.page);
    }

    async breadcrumbPresent():Promise<string>{

        return await this.breadcrumb.innerText() ?? ''
    }

    async clickOnProductComparisonBreadcrumb():Promise<string>{

        await this.breadcrumb.click();
        return await this.breadcrumb.innerText() ?? ''
    }

    
}