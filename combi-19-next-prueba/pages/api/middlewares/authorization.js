require('dotenv').config();

const jwt = require('jsonwebtoken');
//This is a example, this controller should not be here
const verifyToken = (req, res) => {
  res.sendStatus(200);
}

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
    if (err) return res.sendStatus(403)
    next()
  })
}

const authenticateAdminRol = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
    if (err) return res.sendStatus(403)
    else {
      const payload = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET);
      if (payload.userId !== 1) res.sendStatus(403)
    }
    next()
  })
}

module.exports = {
  verifyToken,
  authenticateToken,
  authenticateAdminRol
}