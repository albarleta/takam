import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).send({ message: "Access denied!" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).send({ message: "Invalid Token" });

    req.user = decoded;
    next();
  });
};

export default isAuthenticated;
