require('dotenv').config();

const jwt = require('jsonwebtoken');

const {
  ADMIN_ROLE,
  DRIVER_ROLE,
  PASSENGER_ROLE
} = require('../const/config.js');

const authenticateToken = (token, res) => {
  if (token == null) return res.sendStatus(401);
  else {
    const errorResult = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => err)
    if (errorResult) res.sendStatus(403);
    else return true;
  }
  return false;
}

const authenticateRol = (req, res, next, rol) => {
  if (!req.headers) return res.sendStatus(400);
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (authenticateToken(token, res)) {
    const payload = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET);
    if (!payload.userRoles.includes(rol)) res.sendStatus(403);
    next();
  }
}

const authenticateAdminRol = (req, res, next) => {
  authenticateRol(req,res,next,ADMIN_ROLE);
}

const authenticateDriverRol = (req, res, next) => {
  authenticateRol(req,res,next,DRIVER_ROLE);
}

const authenticatePassengerRol = (req, res, next) => {
  authenticateRol(req,res,next,PASSENGER_ROLE);
}

module.exports = {
  authenticateToken,
  authenticateAdminRol,
  authenticateDriverRol,
  authenticatePassengerRol
}