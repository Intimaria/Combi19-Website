const normalizeTransport = (rows) => {
    let results = [];

    for (let index = 0; index < rows.length; index++) {
        let transport = {
            transportId: rows[index].TRANSPORT_ID,
            internalIdentification: rows[index].INTERNAL_IDENTIFICATION,
            model: rows[index].MODEL,
            registrationNumber: rows[index].REGISTRATION_NUMBER,
            seating: rows[index].SEATING,
            active: (rows[index].ACTIVE === 0) ? 'Inactivo' : 'Activo',
            comfort: {
                typeComfortId: rows[index].TYPE_COMFORT_ID,
                typeComfortName: rows[index].TYPE_COMFORT_NAME
            },
            driver: {
                userId: rows[index].USER_ID,
                name: rows[index].NAME,
                surname: rows[index].SURNAME,
                email: rows[index].EMAIL,
                phoneNumber: rows[index].PHONE_NUMBER
            }
        };
        results.push(transport);
    }

    return results;
};

const normalizeDrivers = (rows) => {
    let results = [];

    for (let index = 0; index < rows.length; index++) {
        let driver = {
            id: rows[index].USER_ID,
            names: rows[index].NAME,
            surname: rows[index].SURNAME,
            email: rows[index].EMAIL,
            password1: rows[index].PASSWORD,
            phoneNumber: rows[index].PHONE_NUMBER,
            active: rows[index].ACTIVE === 1 ? "Activo" : "Inactivo"
        };
        results.push(driver);
    }
    return results;
};

const normalizePlaces = (rows) => {
    let results = [];

    for (let index = 0; index < rows.length; index++) {
        let place = {
            id: rows[index].CITY_ID,
            cityName: rows[index].CITY_NAME,
            active: rows[index].ACTIVE === 1 ? "Activo" : "Inactivo",
            idProvince: rows[index].ID_PROVINCE,
            provinceName: rows[index].PROVINCE_NAME
        };
        results.push(place);
    }
    return results;
};
const normalizeRoutes = (rows) => {
    let results = [];

    for (let index = 0; index < rows.length; index++) {
        let route = {
            idRoute: rows[index].ROUTE_ID,
            km: rows[index].KM,
            duration: rows[index].DURATION,
            active: rows[index].ACTIVE === 1 ? "Activo" : "Inactivo",
            transport: {
                transportId: rows[index].TRANSPORT_ID,
                internalIdentification: rows[index].INTERNAL_IDENTIFICATION,
            },
            departure: {
                cityId: rows[index].Departure_City_Id,
                cityName: rows[index].Departure_City_Name,
                provinceName: rows[index].Departure_Province_Name
            },
            destination: {
                cityId: rows[index].Destination_City_Id,
                cityName: rows[index].Destination_City_Name,
                provinceName: rows[index].Destination_Province_Name
            },
        };
        results.push(route);
    }
    return results;
};

const normalizeProducts = (rows) => {
    let results = [];

    for (let index = 0; index < rows.length; index++) {
        let product = {
            idProduct: rows[index].PRODUCT_ID,
            typeProductId: rows[index].TYPE_PRODUCT_ID,
            typeProductDescription: rows[index].TYPE_PRODUCT_DESCRIPTION,
            name: rows[index].PRODUCT_NAME,
            price: rows[index].PRICE,
            active: rows[index].ACTIVE === 1 ? "Activo" : "Inactivo",
        };
        results.push(product);
    }
    return results;
};

module.exports = {
    normalizeTransport,
    normalizeDrivers,
    normalizePlaces,
    normalizeRoutes,
    normalizeProducts
};
