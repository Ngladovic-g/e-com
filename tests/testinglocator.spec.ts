import { test, expect, Page} from "@playwright/test"
import { count } from "node:console";

let failedEmail:any= ["nglad", "nglad@owdk", "nglad2@oawdk.", "nodwo@gmail.com"]

test('Locator test text', async({page})=>{

await page.goto("https://tutorialsninja.com/demo/");
await page.locator("span:has-text('My Account')").click();
//await page.locator("li>a:has-text('Login')").click();
await page.locator("a:has-text('Register')").click();




const placeholder = await page.locator('#input-firstname').getAttribute('placeholder') ?? ''
expect(placeholder).toContain('First Name')





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

    const msg = await page.locator("div>input[placeholder='First Name']").innerText();
    console.log(msg);
       
   
    }
   