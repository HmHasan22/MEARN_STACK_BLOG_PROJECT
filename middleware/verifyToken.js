const userSchema = require('../schemas/userSchema');
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token === null) {
    return res.status(401).json({
      message: 'Unauthenticated!',
    });
  }
  const userToken = await userSchema
    .findOne({
      tokens: {
        $elemMatch: {
          token: token,
        },
      },
    })
    .then((response) => {
      res.locals.token = response.tokens[0].token;
      next();
    })
    .catch((err) => {
      return res.status(500).json({
        message: 'Authentication failed!',
      });
    });
};

module.exports = verifyToken;
