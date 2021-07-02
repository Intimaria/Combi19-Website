

const {prepareConnection} = require("../helpers/connectionDB.js");

const {
    ERROR_MSG_API_GET_TRIPS,
    OK_MSG_API_FINISH_TRIP,
    ERROR_MSG_API_FINISH_TRIP
} = require("../const/messages");

const {normalizeTrips} = require("../helpers/normalizeResult");

const getDriverTrips = async (req, res) => {
  const { id, status } = req.params;
  try {
      const connection = await prepareConnection();
      const sqlSelect = `
                        SELECT DISTINCT
                        TRIP_ID, REPLACE(TR.PRICE, '.', ',') PRICE, TR.DEPARTURE_DAY,
                        DATE_FORMAT(TR.DEPARTURE_DAY, '%Y-%m-%d %H:%i') DEPARTURE_DAY, R.DURATION,
                        DATE_FORMAT(ADDTIME(TR.DEPARTURE_DAY, R.DURATION), '%Y-%m-%d %H:%i') ARRIVAL_DAY,
                        CI.CITY_ID DEPARTURE_ID, CONCAT(CI.CITY_NAME, ', ', PI.PROVINCE_NAME) DEPARTURE, 
                        CV.CITY_ID DESTINATION_ID, CONCAT(CV.CITY_NAME, ', ', PV.PROVINCE_NAME) DESTINATION,
                        T.TRANSPORT_ID, T.INTERNAL_IDENTIFICATION, T.REGISTRATION_NUMBER, TI.ID_STATUS_TICKET
                        FROM USER U 
                        INNER JOIN ROLE_USER RU
                        ON
                        (U.USER_ID = RU.ROLE_USER_ID)
                        INNER JOIN 
                        TRANSPORT T 
                        ON (U.USER_ID = T.ID_DRIVER)
                        INNER JOIN 
                        ROUTE R ON 
                        (T.TRANSPORT_ID=R.ID_TRANSPORT)
                        INNER JOIN TRIP TR ON 
                        (TR.ID_ROUTE = R.ROUTE_ID)
                        INNER JOIN CITY CI ON R.ID_DEPARTURE = CI.CITY_ID
                        INNER JOIN PROVINCE PI ON CI.ID_PROVINCE = PI.PROVINCE_ID
                        INNER JOIN CITY CV ON R.ID_DESTINATION = CV.CITY_ID
                        INNER JOIN PROVINCE PV ON CV.ID_PROVINCE = PV.PROVINCE_ID 
                        INNER JOIN TICKET TI ON TR.TRIP_ID = TI.ID_TRIP
                        AND U.USER_ID = ${id}
                        AND R.ACTIVE = 1
                        AND T.ACTIVE = 1
                        AND RU.ACTIVE = 1 
                        AND RU.ID_ROLE = 2
                        AND (ID_STATUS_TICKET = ${status})
                        ORDER BY TR.DEPARTURE_DAY ASC`;
      const [rows] = await connection.execute(sqlSelect);
      connection.end();
      const normalizedResults = normalizeTrips(rows);
      return res.status(200).send(normalizedResults);
  } catch (error) {
      console.log(`${ ERROR_MSG_API_GET_TRIPS} ${error}`);
      res.status(500).send(`${ ERROR_MSG_API_GET_TRIPS} ${error}`);
  }
  res.end();
};


const finishTrip = async (req, res) => {
  const { id } = req.params;
  try {
      const connection = await prepareConnection();
      const sqlSelect = `
                        UPDATE TICKET SET 
                        ID_STATUS_TICKET = 5
                        WHERE ID_TRIP IN 
                        (SELECT ID_TRIP FROM TICKET WHERE ID_TRIP = ${id}
                        AND (ID_STATUS_TICKET = 1 OR ID_STATUS_TICKET = 2));
                        `;
      const [rows] = await connection.execute(sqlSelect);
      connection.end();
      return res.status(200).send( OK_MSG_API_FINISH_TRIP);
  } catch (error) {
      console.log(`${ERROR_MSG_API_FINISH_TRIP} ${error}`);
      res.status(500).send(`${ERROR_MSG_API_FINISH_TRIP} ${error}`);
  }
  res.end();
};


module.exports = {
  getDriverTrips,
  finishTrip
}
