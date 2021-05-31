export const formatDecimalNumber = (numberToFormat, maxLengthInteger, maxLengthDecimal) => {
    numberToFormat = numberToFormat.replace('.', ',');

    let splittedNumber = numberToFormat.split(",");

    let integerPart = '', decimalPart ='';

    if (splittedNumber[0].length > maxLengthInteger) {
        integerPart = splittedNumber[0].substr(0, maxLengthInteger);
    } else {
        integerPart = splittedNumber[0];
    }

    if (splittedNumber.length === maxLengthDecimal) {
        if (splittedNumber[1].length > maxLengthDecimal) {
            decimalPart = splittedNumber[1].substr(0, 2);
        } else {
            decimalPart = splittedNumber[1];
        }
    }

    return [splittedNumber.length, integerPart, decimalPart]
};
