import { test, expect, Page} from "@playwright/test"
import { count } from "node:console";

let failedEmail:any= ["nglad", "nglad@owdk", "nglad2@oawdk.", "nodwo@gmail.com"]

test('Locator test text', async({page})=>{

await page.goto("https://tutorialsninja.com/demo/");
await page.locator("span:has-text('My Account')").click();
//await page.locator("li>a:has-text('Login')").click();
await page.locator("a:has-text('Register')").click();
 page.locator("#input-email").fill;

 
// let failedEmail:any= ["nglad", "nglad@owdk", "nglad2@oawdk.", "nodwo@gmail.com"]
const arrCount =  failedEmail.length

for(let i = 0; i < arrCount; i++){
console.log(failedEmail[i])
const emailValue = failedEmail[i]
}

//await message(page);
 //await Yes(failedEmail);


})

const message = async function warningMsgFirstName(page:Page){

       const warning:string =  await page.getByText('First Name must be between 1 and 32 characters!', { exact: true })
       .innerText();
       return warning
       expect(warning).toContain("First Name must be between 1 and 32 characters!")
       
       //expect(warning).toContain("First Name must be between 1 and 32 characters!")
       // console.log(warning);
    }

   async function Yes(arr:any) {

       const arrCount = await arr.count();
       console.log(arrCount)
   
    }
   