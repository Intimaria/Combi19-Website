require('dotenv').config();

const jwt = require('jsonwebtoken');
const { prepareConnection } = require("../helpers/connectionDB.js");



const postPlace = async (req, res) => {
	
    const { city, province } = req.body;

    const inputsErrors = await validatePlace(city, province);

    if (inputsErrors) 
    {
        res.status(400).json(inputsErrors);
    }
    else 
    {
  	    const connection = await prepareConnection();
        connection.query(
		"INSERT INTO PLACE (CITY, PROVINCE) VALUES (?,?)",
		[city, province],
		(err, result) => {
		  if (err) 
		  {
			console.log(err);
		  } else 
		  {
			connection.end();
			res.status(201).send("New location added");
		  }
		});
	}
}


const getPlaces = async (req, res) => {
	
      const connection = await prepareConnection();
   
	  connection.query("SELECT * FROM PLACE", (err, rows, fields) => {
		if (err) {
		  console.log(err);
		} else {
		  res.status(200).send(rows);
		}
	  });
}

const getPlaceById = async (req, res) => {
	

	  const { id } = req.params;
	  const connection = await prepareConnection();
	  connection.query('SELECT * FROM PLACE WHERE PLACE_ID = ?', id, (err, rows, fields) => {
		if (err) {
		  console.log(err);
		} else {
		  res.status(200).send(rows);
		}
	  });
	  connection.end();
}

const putPlace = async (req, res) => {
    const { city, province } = req.body;
    const { id } = req.params;

    const inputsErrors = await validatePlace(city, province);

    if (inputsErrors) {
        res.status(400).json(inputsErrors);
    }
    else {
	    const connection = await prepareConnection();
	    connection.query(
		"INSERT INTO PLACE (CITY, PROVINCE) VALUES (?,?) WHERE PLACE_ID = ?",
		[city, province, id],
		(err, result) => {
		  if (err) {
			console.log(err);
		  } else {
			connection.end();
			res.status(201).send("Location modified");
		  }
		}
	  );
  }

}

const deletePlace = async (req, res) => {
	
	const connection = await prepareConnection();

    const { id } = req.params;

	connection.query("DELETE FROM PLACE WHERE PLACE_ID = ?", id, (err, place) => {
	if (err) {
	  console.log(err);
	} else {
	  connection.end();
	  res.status(200).send(place);
	}
	});
}


module.exports = {
	getPlaces, 
	postPlace, 
	getPlaceById, 
	putPlace, 
	deletePlace
}
