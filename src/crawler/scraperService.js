
const login = require('./login');
/**
 * Aqui se realiza el web-scrapping de la página especifica que quiere el cliente
 */
const scraperObject = {
    async scraper(browser, urls, endpoint, user, password) {
        let customerData = {};
        let extractedData = [];
        //crea una nueva página y hace el login
        const loginPage = await browser.newPage();
        await login.login(endpoint, user, password, loginPage);
        await loginPage.waitForSelector('#mstrLogo');

        const checkCredentials = await loginPage.evaluate(() => {
            const correctCredentials = document.querySelector('.wrongpassword');
            return correctCredentials;
        });
        if(checkCredentials){
            console.log("Credenciales incorrectas");
            extractedData = [{error: "Credenciales incorrectas"}];
            return extractedData;
        }
        //miramos si la pagina de ClearSee se ha cargado correctamente tras hacer el login
        const loginError = await loginPage.evaluate(() => {
            const error = document.querySelector('.mstrWebErrorPage');
            return error;
        });
        if (loginError != null) {
            extractedData = undefined;
            console.log("Error en el login, esperando 1 minuto")
        } else {
            //crea la segunda pagina para hacer el crawler
            const scrapperPage = await browser.newPage();

            for (let url of urls) {
                // Extraer indentificador del cliente de la URL
                const parsedURL = new URL(endpoint + url);
                const id = parsedURL.searchParams.get('subscriptionID');
                let result = await scrapperPage.goto(parsedURL);
                //Si la url es correcta sigue con el crawler
                if (result.status() == 200) {
                    const correctClearseePage = await scrapperPage.evaluate(() => {
                        const clearsee = document.querySelector('.mstrWebErrorPage');
                        console.log(clearsee);
                        //comprobamos si la página es la de clearsee y no es otra pagina metida por error
                        if (!clearsee) {
                            return true;
                        } else {
                            return false;

                        }
                    });
                    //Si es la página de clearsee sigue con el crawler y obtiene la url que tiene la información
                    if (correctClearseePage) {
                        const href = await scrapperPage.evaluate(() => {
                            const link = document.querySelector('.mstrContent a');
                            return link.href;
                        });

                        // Ir la página de los datos
                        await scrapperPage.goto(href);

                        console.log("accediendo a la pagina");

                        //comprobamos que la pagina se ha cargado correctamente
                        isFound = await scrapperPage.evaluate(() => document.body.contains(document.querySelector('.loader-title')));
                        while (isFound) {
                            await scrapperPage.waitForTimeout(1000);
                            isFound = await scrapperPage.evaluate(() => document.body.contains(document.querySelector('.loader-title')));
                        }

                        //evalua la pagina para sacar los datos que nos interesan
                        console.log("recogiendo datos");
                        const pageData = await scrapperPage.evaluate(() => {
                            const elements = document.querySelectorAll('.mstrmojo-XtabZone table td');
                            const datos = [];

                            for (let element of elements) {
                                datos.push(element.innerText);
                            }

                            const mitad = datos.length / 2;
                            const datosfinales = datos.splice(0, mitad); //como hay 2 tablas iguales con la misma información divide el resultado a la mitad para quedarnos con la primera tabla
                            return datosfinales;
                        });

                        let dataArray = pageData.toString().split(",");
                        customerData = {
                            "id": id,
                            "period": dataArray[0],
                            "name": dataArray[1],
                            "timestamp": Date.now().toString(),
                            "info": [],
                            "error": null,
                            "status": "OK",
                            "message": "Datos obtenidos correctamente"
                        }
                        // Recorrer de 2 en 2 para extraer los datos (fecha y valor)
                        // Fijo se va a salir de la lista por el índice
                        for (let i = 2; i < dataArray.length; i += 2) {
                            customerData.info.push({ "date": dataArray[i], "value": dataArray[i + 1] });
                        }
                        extractedData.push(customerData);
                    } else {
                        customerData = {
                            "error": "404",
                            "status": "ERROR",
                            "message": "La página no es la correcta"
                        }
                        extractedData.push(customerData);
                    }
                } else {
                    customerData = {
                        "error": "404",
                        "status": "ERROR",
                        "message": "La pagina no carga, seguramente mal introducida la url"
                    }
                    extractedData.push(customerData);
                }
            }
        }
        return extractedData;

    }
}


module.exports = scraperObject;