export const capitalizeString = (stringToCapitalize, separator = " ") => {
    let words = stringToCapitalize.split(separator);

    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }

    console.log("words es:" , words);

    return words.join(separator);
}
