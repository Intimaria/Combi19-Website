const normalizeTransport = async (rows) => {
    let results = [];

    for (let index = 0; index < rows.length; index++) {
        console.log(rows[index].TRANSPORT_ID);
        let transport = {
            transport_id: rows[index].TRANSPORT_ID,
            internal_identification: rows[index].INTERNAL_IDENTIFICATION,
            model: rows[index].MODEL,
            registration_number: rows[index].REGISTRATION_NUMBER,
            seating: rows[index].SEATING,
            active: rows[index].ACTIVE,
            comfort: {
                type_comfort_id: rows[index].TYPE_COMFORT_ID,
                name: rows[index].TYPE_COMFORT_NAME
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
}

module.exports = {
    normalizeTransport
}
