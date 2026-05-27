import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
  if (!token) {
    return res.status(401).send({ message: 'Unauthorized access: Token missing' });
  }
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'secret-key-1234', (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: 'Forbidden access: Invalid token' });
    }
    req.user = decoded;
    next();
  });
};
