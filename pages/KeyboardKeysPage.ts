import { el } from "@faker-js/faker";
import { Page, expect, Locator } from "@playwright/test";



export class KeyboardKeysPage {

    private readonly page: Page;
    
    constructor(page: Page) {

        this.page = page; 
        
    }

 async copyValue():Promise<void>{
        
        await this.page.keyboard.press("Control+A");
        const copy = await this.page.keyboard.press("Control+C");
        return copy;
    }
async pasteValue():Promise<void>{
        
         await this.page.keyboard.press("Control+V");
       // return paste;
    }

async mouseRightClick(amount:number, options: any):Promise<void>{

    const rightClick = await this.page.mouse.click(amount, options);
}

async clipboardBeforeCopy():Promise<void>{

    await this.page.evaluate(()=> navigator.clipboard.readText);
    
}
async clipboardAftereCopy():Promise<void>{

    await this.page.evaluate(()=> navigator.clipboard.readText);
}

}