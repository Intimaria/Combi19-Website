require('dotenv').config();

const jwt = require('jsonwebtoken');
const { prepareConnection } = require("../helpers/connectionDB.js");



const postPlace = async (req, res) => {
	
  const connection = await prepareConnection();
 
  const city = req.body.city;
  const province = req.body.province;
  
  connection.query(
    "INSERT INTO PLACE (CITY, PROVINCE) VALUES (?,?)",
    [city, province],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("New location added");
      }
    }
  );
  connection.end();
}


const getPlaces = async (req, res) => {
	
      const connection = await prepareConnection();
   
	  connection.query("SELECT * FROM PLACE", (err, rows, fields) => {
		if (err) {
		  console.log(err);
		} else {
		  res.send(rows);
		}
	  });
}

const getPlaceById = async (req, res) => {
	  const connection = await prepareConnection();

	  connection.query('SELECT * FROM PLACE WHERE PLACE_ID = ?', [req.params.id], (err, rows, fields) => {
		if (err) {
		  console.log(err);
		} else {
		  res.send(rows);
		}
	  });
	  connection.end();
}

const putPlace = async (req, res) => {
	// HTTP request add body
	    const connection = await prepareConnection();
	    connection.query(
		"INSERT INTO PLACE (CITY, PROVINCE) VALUES (?,?) WHERE PLACE_ID = ?",
		[city, province],
		(err, result) => {
		  if (err) {
			console.log(err);
		  } else {
			res.send("New location added");
		  }
		}
	  );
	  
	  connection.end();
}

const deletePlace = async (req, res) => {
	
	const connection = await prepareConnection();

	const id = req.params.id;

	connection.query("DELETE FROM PLACE WHERE PLACE_ID = ?", id, (err, place) => {
	if (err) {
	  console.log(err);
	} else {
	  res.send(place);
	}
	});
	  connection.end();
}


module.exports = {
	getPlaces, 
	postPlace, 
	getPlaceById, 
	putPlace, 
	deletePlace
}
