require('dotenv').config();

const jwt = require('jsonwebtoken');
const { prepareConnection } = require("../helpers/connectionDB.js");


const AddLugar = async (req, res) => {
	
  const connection = await prepareConnection();
 
  const city = req.body.city;
  const province = req.body.province;
  
  connection.query(
    "INSERT INTO place (city, province) VALUES (?,?)",
    [city, province],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("New place added");
      }
    }
  );
}


const ListLugares = async (req, res) => {
	
      const connection = await prepareConnection();
   
	  connection.query("SELECT * FROM place", (err, rows, fields) => {
		if (err) {
		  console.log(err);
		} else {
		  res.send(rows);
		}
	  });
}

const VerLugar = async (req, res) => {
      const connection = await prepareConnection();
   
	  connection.query('SELECT * FROM place WHERE place_id = ?', [req.params.id], (err, rows, fields) => {
		if (err) {
		  console.log(err);
		} else {
		  res.send(rows);
		}
    });
}

const ModifyLugar = async (req, res) => {
	// HTTP request add body
}

const DeleteLugar = async (req, res) => {
	
    const connection = await prepareConnection();
    
    const id = req.params.id;
	
    connection.query("DELETE FROM place WHERE place_id = ?", id, (err, lugar) => {
    if (err) {
      console.log(err);
    } else {
      res.send(lugar);
    }
  });
}


module.exports = {
	AddLugar,
	VerLugar
	ListLugares,
    ModifyLugar,
    DeleteLugar
}
