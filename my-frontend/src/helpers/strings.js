export const capitalizeString = (stringToCapitalize, separator = " ") => {
    let words = stringToCapitalize.split(separator);

    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }

    return words.join(separator);
};

export const validateDurationZero = (duration) => {
    let durationSplitted = duration.split(":");

    if (parseInt(durationSplitted[0]) === 0 && parseInt(durationSplitted[1]) === 0) {
        return false;
    } else {
        return true;
    }
};


export const validateDurationFormat = (duration) => {
    let durationSplitted = duration.split(":");

    if (durationSplitted.length === 2) {
        return true;
    } else {
        return false;
    }
};
