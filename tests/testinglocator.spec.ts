import { test, expect, Page } from "@playwright/test"

let failedEmail: any = ["nglad", "nglad@owdk", "nglad2@oawdk.", "nodwo@gmail.com"]

test('Locator test text', async ({ page }) => {

   await page.goto("https://tutorialsninja.com/demo/");
   await page.locator("input.form-control").fill("iMac");
   await page.locator("button.btn-default").click();
   
   //await page.locator("span:has-text('My Account')").click();
   //await page.locator("li>a:has-text('Login')").click();
   //await page.locator("input[value='Login']").click();
   //await page.locator("a:has-text('Register')").click();
   expect(await Yes(page, "Mac")).toContain("Mac");
   
   await page.waitForTimeout(5000);

})

const message = async function warningMsgFirstName(page: Page) {

   const warning: string = await page.getByText('First Name must be between 1 and 32 characters!', { exact: true })
      .innerText();
   return warning
   expect(warning).toContain("First Name must be between 1 and 32 characters!")

   //expect(warning).toContain("First Name must be between 1 and 32 characters!")
   // console.log(warning);
}

async function Yes(page: Page, product: string) {

   const productHeader = page.locator("h4>a");

   /*const count = await productCount.count();
   for (let i = 0; i < count; i++) {

      const list = productCount.nth(i);
      const name = await list.textContent();
      console.log(name)
      if (product === name) {
         
         return name
      }
    
   }
   return "";
   */
  const count = await productHeader.count();

        for (let i = 0; i < count; i++) {

            const list = productHeader.nth(i);
            const name = await list.textContent();
            
            if (name?.includes(product)) {
                console.log(name)
                return name;

            }

        }
        return `Product with exact name ${product} does not exist`;

}


