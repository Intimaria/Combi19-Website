
const {
  ERROR_MSG_EMPTY_TEXT_COMMENT,
  ERROR_MSG_INVALID_DATE,
  ERROR_MSG_API_COMMENT_USER_NOT_CONSUMER
} = require('../const/messages.js');

const {
  REGEX_DATE_YYYY_MM_DD
} = require('../const/regex.js');
const { prepareConnection } = require("./connectionDB.js");

let dateError = null;
let commentError = null;

const validateCommentsToCreate = async (text,  id) => {
  return (validateComment(text) && await validateUserIsCustomer(id)/*&& await validateCommentDate(date)*/) ? null : { commentError /*, dateError */};
}
const validateCommentsToModify = async (text) => {
  return (validateComment(text) /*&& await validateCommentDate(date)*/) ? null : { commentError /*, dateError */};
}
const validateComment =  (text) => {
  if (!text) {
      namesError = (ERROR_MSG_EMPTY_TEXT_COMMENT);
      return false;
  }
  namesError = (null);
  return true;
}

const validateUserIsCustomer = async (id) => {
    console.log("estoy validando el usuario es consumidor:" , id);
    try {
        const connection = await prepareConnection();
        const sqlSelect = `SELECT * FROM USER INNER JOIN CART ON (USER.USER_ID=CART.ID_USER) 
        INNER JOIN TICKET ON (TICKET.ID_CART=CART.CART_ID) 
        INNER JOIN STATUS_TICKET ON (STATUS_TICKET.STATUS_TICKET_ID=TICKET.ID_STATUS_TICKET) 
        WHERE STATUS_TICKET_ID = 5 AND USER.USER_ID = ${id}`;
        const [rows] = await connection.execute(sqlSelect, [id]);
        connection.end();
        commentError = (ERROR_MSG_API_COMMENT_USER_NOT_CONSUMER)
        return (rows.length >= 1);
    } catch (error) {
        console.log("Ocurrió un error al comprobar que el usuario es un consumidor", error);
        return false;
    }
};


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
  validateCommentsToModify,
}

