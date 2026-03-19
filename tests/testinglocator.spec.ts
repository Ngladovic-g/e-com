import { test, expect, Page} from "@playwright/test"


test('Locator test text', async({page})=>{

page.goto("https://tutorialsninja.com/demo/");
page.locator("span:has-text('My Account')").click();
page.locator("a:has-text('Register')").click();


//await message(page);
await Yes(page)


})

const message = async function warningMsgFirstName(page:Page){

       const warning:string =  await page.getByText('First Name must be between 1 and 32 characters!', { exact: true })
       .innerText();
       return warning
       expect(warning).toContain("First Name must be between 1 and 32 characters!")
       
       //expect(warning).toContain("First Name must be between 1 and 32 characters!")
       // console.log(warning);
    }

   async function Yes(page: Page) {

   //const isChecked =  page.locator("input[type=radio]").nth(1);
    //    isChecked.check();
        const yesRadio = await page.locator("input[type=radio]").nth(2).innerText();
        console.log(yesRadio);
      expect(yesRadio).toContain('Yes');
   //     await expect(isChecked).toBeChecked();
    }
   