import { test, expect, Page} from "@playwright/test"


test('Locator test text', async({page})=>{

page.goto("https://tutorialsninja.com/demo/");
page.locator("span:has-text('My Account')").click();
page.locator("a:has-text('Register')").click();
page.locator("input[value='Continue']").click();

await message(page);


})

const message = async function warningMsgFirstName(page:Page){

       const warning:string =  await page.getByText('First Name must be between 1 and 32 characters!', { exact: true })
       .innerText();
       return warning
       expect(warning).toContain("First Name must be between 1 and 32 characters!")
       
       //expect(warning).toContain("First Name must be between 1 and 32 characters!")
       // console.log(warning);
    }
