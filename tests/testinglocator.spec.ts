import { test, expect, Page} from "@playwright/test"


test('Locator test text', async({page})=>{

await page.goto("https://tutorialsninja.com/demo/");
await page.locator("span:has-text('My Account')").click();
await page.locator("li>a:has-text('Login')").click();
//page.locator("a:has-text('Register')").click();


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

   const text = await page.locator("div>ul>li>a:has-text('Login')").innerText();
   console.log(text);

    }
   