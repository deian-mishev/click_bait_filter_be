const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');

const { addUser, getUser } = require('./../schema');

const {
    RSA_PRIVATE_KEY,
    RSA_PUBLIC_KEY,
    JWT_ALGORITHM
} = require('../constants');

const checkIfAuthenticated = expressJwt({
    secret: RSA_PUBLIC_KEY,
    algorithms: [JWT_ALGORITHM]
});

const extendJWTSession = async (req, res, next) => {
    if (req.headers.authorization && req.headers.origin.indexOf('chrome-extension://') === 0) {
        const token = req.headers.authorization.replace('Bearer ', '');
        let payload;
        try {
            payload = jwt.decode(token);
        } catch (error) {
            payload = false;
        }

        // New User
        if (!payload) {
            await addUser(token);
            const jwtBearerToken = jwt.sign({
                name: token,
                scope: [
                    'role:user'
                ]
            }, RSA_PRIVATE_KEY, {
                algorithm: JWT_ALGORITHM,
                keyid: 'M2maFm3VYlMBOn3GetVWGXkrKrk',
                subject: token // replace with db entry
            });
            // 2. INVALIDATING WHILE THE FRONTEND CANNOT BE FORCED TO DELETE THE TOKEN
            // 2.1 CHANGE PRIVATE KEY FOR THE USER
            // 2.2 PERSIST THE TOKEN AND NEVER ALLOW
            // 2.3 BLOCK THE USER
            const tokenString = `Bearer ${jwtBearerToken}`;
            res.header("Access-Control-Expose-Headers", "Authorization");
            res.header('Authorization', tokenString);

            req.headers.authorization = tokenString;
        } else if (payload && !(await getUser(req))) {
            res.status(400).send('missing id');
            const error = new Error();
            error.httpStatusCode = 400
            return next(error);
        }
        req.user = { scope: ['role:user'] };
    }
    next();
};

module.exports = {
    checkIfAuthenticated,
    extendJWTSession
}