const bandwidthService = require('../src/services/bandwidthService');

describe('obtener todas las bandwidths dadas una lista de urls', () => {
    jest.setTimeout(60000);
    test('obtener todas las bandwidths dadas una lista de urls', async function () {
        const bandwidths = await bandwidthService.getAllBandwidths(['ClearSee/servlet/mstrWeb?evt=3186&src=mstrWeb.3186&subscriptionID=128153CB11ED6A4A4D750080EFE5AA5C&Server=ALLOTCS01DV&Project=Allot%20Real%20-%20Dev%202.0&Port=0'],
            'http://localhost:9090/', 'Web_Admin', 'Web_Admin');
        expect(bandwidths).not.toBe(undefined);
        expect(bandwidths[0].id).toEqual('128153CB11ED6A4A4D750080EFE5AA5C');
        

    });
});


describe('obtener bandwidths con una url erronea', () => {
    jest.setTimeout(60000);
    test('obtener bandwidths con una url erronea', async function () {
        const bandwidths = await bandwidthService.getAllBandwidths(['Clearsfwef/servlet/mstrWeb?evt=3186&src=mstrWeb.3186&subscriptionID=128153CB11ED6A4A4D750080EFE5AA5C&Server=ALLOTCS01DV&Project=Allot%20Real%20-%20Dev%202.0&Port=0'],
            'http://localhost:9090/', 'Web_Admin', 'Web_Admin');
        expect(bandwidths).not.toBe(undefined);
        expect(bandwidths[0].message).toEqual('La pagina no carga, seguramente mal introducida la url');
    });
});