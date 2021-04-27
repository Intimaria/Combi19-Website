const {
    ERROR_MSG_EMPTY_CITY,
    ERROR_MSG_INVALID_CITY,
    ERROR_MSG_EMPTY_PROVINCE,
    ERROR_MSG_INVALID_PROVINCE,
    ERROR_MSG_INEXISTENT_PLACE,
    OK_MSG_LOCATION_CREATED,
} = require('../const/messages.js');

const {
    REGEX_ONLY_ALPHABETICAL
} = require('../const/regex.js');


const data = require('../const/localidades-censales.json');

let namesError;

const validatePlace = async (cityName, provinceName) => {
    return ((validateCityName(cityName) & validateSurname(cityName)/* &  validatePlaceExists(cityName, provinceName) */) ? null : {
        namesError,
    };
};


const validateCity = (cityName) => {
    if (!cityName) {
        namesError = (ERROR_MSG_EMPTY_CITY);
        return false;
    } else if (!REGEX_ONLY_ALPHABETICAL.test(cityName)) {
        namesError = (ERROR_MSG_EMPTY_CITY);
        return false;
    }

    namesError = (null);
    return true;
}

const validateProvince = (provinceName) => {
    if (!provinceName)  {
        namesError = (ERROR_MSG_EMPTY_PROVINCE);
        return false;
    } else if (!REGEX_ONLY_ALPHABETICAL.test(provinceName)) {
        namesError = (ERROR_MSG_INVALID_PROVINCE);
        return false;
    }

    namesError = (null);
    return true;
}

const validatePlaceExists = (cityName, provinceName) => {
 const place = getPlaceFromList(cityName, provinceName);
 if (!place)) {
        namesError = (ERROR_MSG_INEXISTENT_PLACE);
        return false;
    }
    namesError = (null);
    return true;
}

const getPlaceFromList  = (cityName, provinceName) => {	
	return data["localidades-censales"].filter(lugar => lugar.nombre === cityName && lugar.provincia.nombre === provinceName);
}



module.exports = {
    validateCity,
    validateProvince,
    validatePlace,
    validatePlaceExists,
    getPlaceFromList
}
