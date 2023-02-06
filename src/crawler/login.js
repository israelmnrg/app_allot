async function login(endpoint, user, password, page) {
    console.log("haciendo login");

    const loginStatus = await page.goto(endpoint + 'ClearSee/servlet/mstrWeb?Login');

    if (loginStatus.status() == 500) {
        console.log("Error en el login");
        return;
    }

    const loginInput = await page.waitForSelector('#Uid');

    const loginPassword = await page.waitForSelector('#Pwd');

    await loginInput.type(user);

    await loginPassword.type(password);

    const buttonLogin = await page.waitForXPath('//*[@id="3054"]');

    await buttonLogin.click();
}

module.exports = { login }