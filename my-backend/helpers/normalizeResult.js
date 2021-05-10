const normalizeTransport = (rows) => {
    let results = [];

    for (let index = 0; index < rows.length; index++) {
        let transport = {
            transport_id: rows[index].TRANSPORT_ID,
            internal_identification: rows[index].INTERNAL_IDENTIFICATION,
            model: rows[index].MODEL,
            registration_number: rows[index].REGISTRATION_NUMBER,
            seating: rows[index].SEATING,
            active: (rows[index].ACTIVE === 0) ? 'Inactivo' : 'Activo',
            comfort: {
                type_comfort_id: rows[index].TYPE_COMFORT_ID,
                type_comfort_name: rows[index].TYPE_COMFORT_NAME
            },
            driver: {
                user_id: rows[index].USER_ID,
                name: rows[index].NAME,
                surname: rows[index].SURNAME,
                email: rows[index].EMAIL,
                phone_number: rows[index].PHONE_NUMBER
            }
        }
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
            active: rows[index].ACTIVE === 1? "Activo" : "Inactivo"
        }
        results.push(driver);
    }
    return results;
}

const normalizePlaces = (rows) => {
    let results = [];

    for (let index = 0; index < rows.length; index++) {
        let place = {
            id: rows[index].CITY_ID,
            cityName: rows[index].CITY_NAME,
            provinceName: rows[index].PROVINCE_NAME,
            active: rows[index].ACTIVE === 1? "Activo" : "Inactivo",
        }
        results.push(place);
    }
    return results;
}

module.exports = {
    normalizeTransport,
    normalizeDrivers,
    normalizePlaces
}
