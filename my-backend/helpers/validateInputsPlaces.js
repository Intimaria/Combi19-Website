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

const {
    placeExists
} = require('../const/listaLugares.js');

const data = require('../const/localidades-censales.json');

let namesError;

const validatePlaces = async (cityName, provinceName) => {
    return ((validateCityName(cityName) & validateSurname(cityName)/* &  validatePlace = (cityName, provinceName) */) ? null : {
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

const validatePlace = (cityName, provinceName) => {
 const place = getPlace(cityName, provinceName);
 if (!place)) {
        namesError = (ERROR_MSG_INEXISTENT_PLACE);
        return false;
    }
    namesError = (null);
    return true;
}

const getPlaceFromList  = (cityName, provinceName) => {	
	const place = data["localidades-censales"].filter(lugar => lugar.nombre === cityName && lugar.provincia.nombre === provinceName);
	if (!place)
		return (null)
	else 
		return place;
}



module.exports = {
    validateCity,
    validateProvince,
    validatePlace,
    getPlaceFromList
}
