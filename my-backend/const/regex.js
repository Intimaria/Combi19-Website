module.exports = {
    REGEX_DATE_YYYY_MM_DD: /^\d{4}[./-]\d{1,2}[./-]\d{1,2}$/,
    REGEX_EMAIL: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    REGEX_PHONE: /[^0-9*#()-\s]/,
    REGEX_ONLY_ALPHABETICAL: /[^a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F\s]/,
    REGEX_ONLY_NUMBER: /[^0-9]/,
    REGEX_DURATION: /[^0-9:\s]/
}