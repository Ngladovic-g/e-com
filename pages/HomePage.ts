import { Locator, Page } from "@playwright/test";

export class HomePage{
    private readonly page:Page;

    constructor(page:Page){
        this.page = page;
    }

    async isOnHomePage():Promise<boolean> {
        let title: string = await this.page.title();
        if (title) {
            return true;
        }
        return false;
    }
}

