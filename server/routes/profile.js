import express from 'express';
import passport from '../config/passport.js';
import verifyToken from '../middleware/middleware.js';
import db from '../config/db.js';
const router = express.Router();

router.get("/data", verifyToken, async (req, res) => {
    // console.log(req.user);

    // console.log("hI");
    // console.log(req.user);
    const id = req.user.id;
    const dbRes = await db.query("select * from users where id = $1", [id]);
    // console.log(dbRes.rows[0]);
    const data = dbRes.rows[0];

    res.status(201).json({ user: data });
    // res.json({ user: req.user })

})

export default router;