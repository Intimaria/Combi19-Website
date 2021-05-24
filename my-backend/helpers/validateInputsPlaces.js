const { ERROR_MSG_EMPTY_PLACE, ERROR_MSG_INVALID_PLACE, ERROR_MSG_EMPTY_PROVINCE, ERROR_MSG_INVALID_PROVINCE, ERROR_MSG_INEXISTENT_PLACE } = require('../const/messages.js');

const { REGEX_ONLY_ALPHABETICAL } = require('../const/regex.js');

const data = require( '../const/localidades.json');

let namesError;

const validatePlace = async (cityName, provinceName) => {
    return ((validateCity(cityName) & validateProvince(provinceName) &  validatePlaceExists(cityName, provinceName)) ? null : {
        namesError,
    });
};


const validateCity = (cityName) => {
    if (!cityName) {
        namesError = (ERROR_MSG_EMPTY_PLACE);
        return false;
    } else if (!REGEX_ONLY_ALPHABETICAL.test(cityName)) {
        namesError = (ERROR_MSG_INVALID_PLACE);
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
 if (!place) {
        namesError = (ERROR_MSG_INEXISTENT_PLACE);
        return false;
    }
    namesError = (null);
    return true;
}

const getPlaceFromList  = (cityName, provinceName) => {	
	//return data["localidades-censales"].filter(lugar => lugar.nombre === cityName && lugar.provincia.nombre === provinceName);
	return data.filter(lugar => lugar.nombre === cityName && lugar.provincia.nombre === provinceName); 
}



module.exports = {
    validatePlace,
    getPlaceFromList
}
