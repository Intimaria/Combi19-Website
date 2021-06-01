const { validateCommentsToCreate } = require ('../helpers/validateCommentInputs');

const { prepareConnection } = require("../helpers/connectionDB.js");

const { normalizeComments } = require('../helpers/normalizeResult.js');

const {
    ERROR_MSG_API_GET_COMMENT,
    ERROR_MSG_API_POST_COMMENT,
    ERROR_MSG_API_PUT_COMMENT,
    ERROR_MSG_API_DELETE_COMMENT,
    OK_MSG_API_DELETE_COMMENT,
    ERROR_MSG_API_COMMENT_VALIDATE_DEPENDENCE
} = require('../const/messages.js');

const {
    ACTIVE,
    NO_ACTIVE } = require("../const/config.js");


const getCommentsUser = async (req, res) => {
  const { id } = req.params;
    try {
        const connection = await prepareConnection();
        const sqlSelect = `
        SELECT c.COMMENT_ID, c.ID_USER, c.COMMENT, 
        (DATE_FORMAT(c.COMMENT_DATE, '%d/%m/%Y %H:%i')) AS COMMENT_DATE, 
        c.ACTIVE, u.NAME, u.SURNAME,  u.EMAIL
        FROM COMMENT c INNER JOIN USER u ON (c.ID_USER=u.USER_ID) 
        WHERE c.ID_USER = ${id}
        ORDER BY c.COMMENT_DATE DESC`;
        const [rows] = await connection.execute(sqlSelect, [id]);
        connection.end();
        const normalizedResults = normalizeComments(rows);
        return res.status(200).send(normalizedResults);
    } catch (error) {
        console.log(`${ERROR_MSG_API_GET_COMMENT}: ${error}`);
        res.status(500).send(`${ERROR_MSG_API_GET_COMMENT}: ${error}`);
    }
    res.end();
};

const getAllComments = async (req, res) => {
  try {
      const connection = await prepareConnection();
      const sqlSelect = `
      SELECT c.COMMENT_ID, c.ID_USER, c.COMMENT, 
      (DATE_FORMAT(c.COMMENT_DATE, '%d/%m/%Y %H:%i')) AS COMMENT_DATE, 
      c.ACTIVE, u.NAME, u.SURNAME,  u.EMAIL
      FROM COMMENT c INNER JOIN USER u ON c.ID_USER=u.USER_ID 
      WHERE ACTIVE = ${ACTIVE} ORDER BY c.COMMENT_DATE DESC`;
      const [rows] = await connection.execute(sqlSelect, [ACTIVE]);
      connection.end();
      const normalizedResults = normalizeComments(rows);
      return res.status(200).send(normalizedResults);
  } catch (error) {
      console.log(`${ERROR_MSG_API_GET_COMMENT}: ${error}`);
      res.status(500).send(`${ERROR_MSG_API_GET_COMMENT}: ${error}`);
  }
  res.end();
};

const getLatestComments = async (req, res) => {
  const num = 3;
  try {
      const connection = await prepareConnection();
      const sqlSelect = `
      SELECT c.COMMENT_ID, c.ID_USER, c.COMMENT, 
      (DATE_FORMAT(c.COMMENT_DATE, '%d/%m/%Y %H:%i')) AS COMMENT_DATE, 
      c.ACTIVE, u.NAME, u.SURNAME, u.EMAIL
      FROM COMMENT c INNER JOIN USER u ON c.ID_USER=u.USER_ID 
      WHERE ACTIVE = ${ACTIVE} ORDER BY c.COMMENT_DATE DESC LIMIT ${num}`;
      const [rows] = await connection.execute(sqlSelect, [ACTIVE, num]);
      connection.end();
      const normalizedResults = normalizeComments(rows);
      return res.status(200).send(normalizedResults);
  } catch (error) {
      console.log(`${ERROR_MSG_API_GET_COMMENT}: ${error}`);
      res.status(500).send(`${ERROR_MSG_API_GET_COMMENT}: ${error}`);
  }
  res.end();
};


const getCommentById = async (req, res) => {
  const { id } = req.params;
    try {
        const connection = await prepareConnection();
        const sqlSelect = `
        SELECT c.COMMENT_ID, c.ID_USER, c.COMMENT, 
        (DATE_FORMAT(c.COMMENT_DATE, '%d/%m/%Y %H:%i')) AS COMMENT_DATE, 
        c.ACTIVE, u.NAME, u.SURNAME, u.EMAIL
        FROM COMMENT c INNER JOIN USER u ON (c.ID_USER=u.USER_ID) 
        WHERE c.COMMENT_ID = ${id} AND ACTIVE = ${ACTIVE} 
        ORDER BY c.COMMENT_DATE DESC`;
        const [rows] = await connection.execute(sqlSelect, [id, ACTIVE]);
        connection.end();
        const normalizedResults = normalizeComments(rows);
        return res.status(200).send(normalizedResults);
    } catch (error) {
        console.log(`${ERROR_MSG_API_GET_COMMENT}: ${error}`);
        res.status(500).send(`${ERROR_MSG_API_GET_COMMENT}: ${error}`);
    }
    res.end();
}

const deleteComment = async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await prepareConnection();
        const sqlUpdate =
        `UPDATE COMMENT SET ACTIVE = '${NO_ACTIVE }' WHERE COMMENT.COMMENT_ID = ${id};`;
        const [rows] = await connection.execute(sqlUpdate, [NO_ACTIVE, id]);
        connection.end();
        return res.status(200).send(OK_MSG_API_DELETE_COMMENT);
    } catch (error) {
        console.log(`${ERROR_MSG_API_DELETE_COMMENT} ${error}`);
        res.status(500).send(`${ERROR_MSG_API_DELETE_COMMENT} ${error}`);
    }
    res.end();

}

const unDeleteComment = async (req, res) => {
  const { id } = req.params;
   try {
            const connection = await prepareConnection();
            let sqlUptate = `UPDATE COMMENT SET ACTIVE = ${ACTIVE} WHERE COMMENT.COMMENT_ID = ${id};`;
            const [rows] = await connection.execute(sqlUptate, [ACTIVE, id]);
            connection.end();
            res.status(200).send("Se actualizó el comentario con éxito");
        } catch (error) {
            console.log(ERROR_MSG_API_PUT_COMMENT, error);
            res.status(500).send(`${ERROR_MSG_API_PUT_COMMENT} ${error}`);
        }
  res.end();

}

const postComment = async (req, res) => {
    const { comment /*, date*/ } = req.body;
    const {id } = req.params; // have to send user id in for logged in users (is there a differnt way?)
    const inputsErrors = await validateCommentsToCreate(comment /*, date*/);
     // setting date makes system prone to errors, post date should default to current date curdate() or now()
    if (inputsErrors) {
        res.status(400).json(inputsErrors);
    } else {
        try {
            const connection = await prepareConnection();
            const sqlInsert = `INSERT INTO COMMENT (COMMENT_ID, ID_USER, COMMENT, COMMENT_DATE, ACTIVE)
             VALUES (NULL,  ${id}, "${comment}", NOW(), ${ACTIVE});`;
            const [rows] = await connection.execute(sqlInsert, [comment, id, ACTIVE]);
            connection.end();
            res.status(201).send("Se creó el comentario con éxito");
        } catch (error) {
            console.log(ERROR_MSG_API_POST_COMMENT, error);
            res.status(500).send(`${ERROR_MSG_API_POST_COMMENT} ${error}`);
        }
    }
    res.end();
}

const putComment = async (req, res) => {
    const { id } = req.params;

    const { comment, date } = req.body;
    const inputsErrors = await validateCommentsToCreate(comment /*, date*/);

    if (inputsErrors) {
        res.status(400).json(inputsErrors);
    } else {
        try {
            const connection = await prepareConnection();
            let sqlUptate = `UPDATE COMMENT SET COMMENT = '${comment}' WHERE COMMENT.COMMENT_ID = ${id};`;
            const [rows] = await connection.execute(sqlUptate, [comment, id]);

            connection.end();
            res.status(200).send("Se actualizó el comentario con éxito");
        } catch (error) {
            console.log(ERROR_MSG_API_PUT_COMMENT, error);
            res.status(500).send(`${ERROR_MSG_API_PUT_COMMENT} ${error}`);
        }
    }
    res.end();
}

const getCommentDependenceById = async (req, res) => {
    const { id } = req.params;
    try {
        res.json({
            commentTripDependence: validateCommentDependence(id)
        });
    } catch (error) {
        console.log(`${ERROR_MSG_API_COMMENT_VALIDATE_DEPENDENCE} ${error}`);
        res.status(500).send(`${ERROR_MSG_API_COMMENT_VALIDATE_DEPENDENCE}`);
    }
    res.end();
};

module.exports = {
    getCommentsUser,
    getAllComments,
    getLatestComments,
    getCommentById,
    postComment,
    putComment,
    deleteComment,
    unDeleteComment,
    getCommentDependenceById
}
