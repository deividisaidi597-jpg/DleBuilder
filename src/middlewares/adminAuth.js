const jwt = require("jsonwebtoken");

function authAdmin(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({
      error: "Token não enviado",
    });
  }

  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({
      error: "Formato de token inválido",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.admin = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      error:
        err.name === "TokenExpiredError" ? "Token expirado" : "Token inválido",
    });
  }
}

module.exports = authAdmin;
