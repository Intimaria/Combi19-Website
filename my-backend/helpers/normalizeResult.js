const moment = require("moment");

const normalizeTransports = (rows) => {
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
            },
            report: {
                driver: `${rows[index].SURNAME}, ${rows[index].NAME}`
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

const normalizePlacesWithRouteDependencies = (rows) => {
    let results = [];

    for (let index = 0; index < rows.length; index++) {
        let place = {
            id: rows[index].CITY_ID,
            cityName: rows[index].CITY_NAME,
            active: rows[index].ACTIVE === 1 ? "Activo" : "Inactivo",
            idProvince: rows[index].ID_PROVINCE,
            provinceName: rows[index].PROVINCE_NAME,
            inRoute: rows[index].ROUTE === 1 ? "true" : "false"
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
                registrationNumber: rows[index].REGISTRATION_NUMBER
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
            report: {
                transport: `${rows[index].INTERNAL_IDENTIFICATION} - ${rows[index].REGISTRATION_NUMBER}`
            }
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
            report: {
                price: `$${rows[index].PRICE}`
            }
        };
        results.push(product);
    }
    return results;
};

const normalizeComments = (rows) => {
    let results = [];

    function makeDateTime(date) {
        const newDate = new Date(date).toLocaleDateString('Es-ar');
        const newTime = new Date(date).toLocaleTimeString();
        return newDate + ' ' + newTime + 'hs'
    }

    for (let index = 0; index < rows.length; index++) {
        let comment = {
            id: rows[index].COMMENT_ID,
            user: {
                id: rows[index].ID_USER,
                name: rows[index].NAME + ' ' + rows[index].SURNAME,
                email: rows[index].EMAIL,
            },
            comment: rows[index].COMMENT,
            datetime: rows[index].COMMENT_DATE + 'hs',
            //date: new Date(rows[index].COMMENT_DATE).toLocaleDateString('Es-ar'),
            //time: new Date(rows[index].COMMENT_DATE).toLocaleTimeString(),
            active: rows[index].ACTIVE === 1 ? "Activo" : "Inactivo"
        };
        results.push(comment);
    }
    return results;
};


const normalizeTrips = (rows) => {
    let results = [];

    for (let index = 0; index < rows.length; index++) {
        let trip = {
            tripId: rows[index].TRIP_ID,
            ticketId: rows[index].TICKET_ID,
            price: rows[index].PRICE,
            numberPrice: rows[index].NUMBERPRICE,
            departureDay: rows[index].DEPARTURE_DAY,
            arrivalDay: rows[index].ARRIVAL_DAY,
            duration: rows[index].DURATION,
            active: (rows[index].ACTIVE === 0) ? 'Inactivo' : 'Activo',
            status: rows[index].STATUS,
            quantity: rows[index].QUANTITY,
            percentage: rows[index].PERCENTAGE,
            driver: rows[index].DRIVER,
            availableSeatings: rows[index].AVAILABLESEATINGS,
            route: {
                routeId: rows[index].ROUTE_ID,
                departureId: rows[index].DEPARTURE_ID,
                departure: rows[index].DEPARTURE,
                destinationId: rows[index].DESTINATION_ID,
                destination: rows[index].DESTINATION
            },
            transport: {
                transportId: rows[index].TRANSPORT_ID,
                internalIdentification: rows[index].INTERNAL_IDENTIFICATION,
                registrationNumber: rows[index].REGISTRATION_NUMBER
            },
            report: {
                price: `$${rows[index].PRICE}`,
                departureDay: `${moment(rows[index].DEPARTURE_DAY_ORIGINAL).format('DD/MM/YYYY HH:mm')}hs`,
                arrivalDay: `${moment(rows[index].ARRIVAL_DAY_ORIGINAL).format('DD/MM/YYYY HH:mm')}hs`,
                transport: `${rows[index].INTERNAL_IDENTIFICATION} - ${rows[index].REGISTRATION_NUMBER}`
            }
        };
        results.push(trip);
    }

    return results;
};


const normalizeCards = (rows) => {
    let results = [];

    for (let index = 0; index < rows.length; index++) {
        let card = {
            cardId: rows[index].CARD_ID,
            cardNetworkId: rows[index].ID_CARD_NETWORK,
            cardType: rows[index].ID_CARD_TYPE,
            passengerId: rows[index].ID_PASSENGER,
            number: rows[index].NUMBER,
            nameSurname: rows[index].NAME_SURNAME,
            expirationDate: rows[index].EXPIRATION_DATE,
            ownerDocumentNumber: rows[index].OWNER_DOCUMENT_NUMBER,
            active: (rows[index].ACTIVE === 0) ? 'Inactivo' : 'Activo'
        };
        results.push(card);
    }

    return results;
};

const normalizePassengers = (rows) => {
    let results = [];

    for (let index = 0; index < rows.length; index++) {
        let user = {
            userId: rows[index].USER_ID,
            userName: rows[index].NAME + ' ' + rows[index].SURNAME,
            country: rows[index].ID_COUNTRY,
            documentType: rows[index].ABBREVIATION,
            birthday: rows[index].BIRTHDAY,
            email: rows[index].EMAIL,
            goldMemberExpires: rows[index].GOLD_MEMBERSHIP_EXPIRATION,
            phone: rows[index].PHONE_NUMBER,
            documentNum: rows[index].DOCUMENT_NUMBER,
            riskExpires: rows[index].EXPIRATION_RISK,
            hasDebit: (rows[index].AUTOMATIC_DEBIT === 0) ? 'No' : 'Sí',
            report: {
                birthday: `${moment(rows[index].BIRTHDAY).format('DD/MM/YYYY')}`,
                goldMemberExpires: (rows[index].GOLD_MEMBERSHIP_EXPIRATION) ? `${moment(rows[index].GOLD_MEMBERSHIP_EXPIRATION).format('DD/MM/YYYY')}` : 'No es Gold',
                riskExpires: `${moment(rows[index].EXPIRATION_RISK).format('DD/MM/YYYY')}`,
                symptomDate: `${moment(rows[index].EXPIRATION_RISK).add(-15, 'days').format('DD/MM/YYYY')}`, 
            }
        };
        results.push(user);
    }

    return results;
};

module.exports = {
    normalizeComments,
    normalizeTransports,
    normalizeDrivers,
    normalizePlaces,
    normalizePlacesWithRouteDependencies,
    normalizeRoutes,
    normalizeProducts,
    normalizeTrips,
    normalizeCards,
    normalizePassengers
};
