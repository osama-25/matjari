import jwt from 'jsonwebtoken';

export default async function verifyToken(req, res, next) {

    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]; // becase the authHeader is 'Bearer token' so we cut the [0] index



    console.log("token: : " + token);

    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {




        const res = await jwt.verify(token, process.env.JWT_SECRET, {
            "algorithms": ["HS256"],
        })

        // console.log(res);


        req.user = res.user;
        next();
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // req.user = decoded.user;
        // next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid token' });
    }
};


export const generateToken = (user) => {
    return jwt.sign({ user: user }, process.env.JWT_SECRET, { expiresIn: '1h' });
};