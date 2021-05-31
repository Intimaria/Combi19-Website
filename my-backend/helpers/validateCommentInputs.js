
const {
  ERROR_MSG_EMPTY_TEXT_COMMENT,
  ERROR_MSG_INVALID_DATE,
} = require('../const/messages.js');

const {
  REGEX_DATE_YYYY_MM_DD
} = require('../const/regex.js');

let dateError = null;
let commentError = null;

const validateCommentsToCreate = async (text, date) => {
  return (validateComment(text) /*&& await validateCommentDate(date)*/) ? null : { commentError /*, dateError */};
}
const validateComment = (text) => {
  if (!text) {
      namesError = (ERROR_MSG_EMPTY_TEXT_COMMENT);
      return false;
  }
  namesError = (null);
  return true;
}


const validateCommentDate = (date) => {
  console.log(date)
  let aDate = new Date(date);
  console.log(aDate);
  if (!REGEX_DATE_YYYY_MM_DD.test(date)) {
      dateError = (ERROR_MSG_INVALID_DATE);
      return false;
  }

  const parts = date.split("-");
  const day = parseInt(parts[2], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[0], 10);

  if (year < (new Date().getFullYear() - 125) || year > (new Date().getFullYear()) || month === 0 || month > 12) {
      dateError = (ERROR_MSG_INVALID_DATE);
      return false;
  }

  const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))
      monthLength[1] = 29;

  if (!(day > 0 && day <= monthLength[month - 1])) {
      dateError = (ERROR_MSG_INVALID_DATE);
      return false;
  }

  dateError = null;
  return true;
}

module.exports = {
  validateCommentsToCreate,
}

