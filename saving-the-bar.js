const puppeteer = require('puppeteer');
const request = require('request');

(async () => {
  const amount = 25;
  let { _, body } = await getNames('https://uinames.com/api/?amount='+amount+'&region=united+states');
  // console.log(body);
  var i = 0;
  const browser = await puppeteer.launch();
  while (i < amount) {
    name = JSON.parse(body)[i];
    const page = await browser.newPage();
    try
    {
      await page.goto('https://docs.google.com/forms/d/e/1FAIpQLSfnnuYM7vjrEzZ1QelNuKsBumUQIRPipQLHUuXuIWvVMk-bvA/viewform');
      await page.waitForSelector('body', {visible: true});
      // await page.waitFor(2500);
      // fill the text box with element
      console.log("selecting input")
      //*[@id="mG61Hd"]/div/div/div[2]/div[1]/div/div[2]/div/div[1]/div/div[1]/input
      const [inputName] = await page.$x("//*[@id=\"mG61Hd\"]/div/div/div[2]/div[1]/div/div[2]/div/div[1]/div/div[1]/input")
      if (inputName){
        console.log("found input");
        await page.evaluate((element, value) => element.value = value, inputName, name.name+" "+name.surname);
        i++;
        // email, not required
        const [emailInput] = await page.$x("//*[@id=\"mG61Hd\"]/div/div/div[2]/div[2]/div/div[2]/div/div[1]/div/div[1]/input")
        if (emailInput)
        {
          await page.evaluate((element, value) => element.value = value, emailInput, name.email);
        }
      }
      else {
        console.log("couldn't find the input");
        continue;
        // return;
      }
      // click on submit
      const [button] = await page.$x("//*[@id=\"mG61Hd\"]/div/div/div[3]/div[1]/div/div/span/span");
      if (button) {
        await button.click();
        console.log('clicking on it');
        await page.waitForSelector('body', {visible: true});
        await page.screenshot({path: 'example'+i+'.png'});
      }
    }
    catch (err)
    {
      console.log(err);
      await browser.close();
    }
  };
  await browser.close();
})();

async function getNames(url)
{
//     request('https://uinames.com/api/?amount=25&region=united+states', { json: true }, (err, res, body) => {
//     if (err) throw new Error(err);
//     console.log(body)
//     return body;
// });
  return new Promise((resolve, reject) => {
    request({ url, method: 'GET' }, (error, response, body) => {
      if (error) return reject(error)
      return resolve({ body, response })
    })
  });
}

