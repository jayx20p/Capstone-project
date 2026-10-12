import pool from "../db/connection.js";


export async function googleLogin(req, res) {

    const {
        email,
        display_name,
        google_uid
    } = req.body;


    try {

        let user = await pool.query(
            `
            SELECT *
            FROM users
            WHERE email=$1
            `,
            [email]
        );


        if (user.rows.length === 0) {

            user = await pool.query(
                `
                INSERT INTO users
                (
                email,
                google_uid,
                display_name
                )
                VALUES($1,$2,$3)
                RETURNING *
                `,
                [
                    email,
                    google_uid,
                    display_name
                ]
            );

        }


        res.json({
            user: user.rows[0]
        });


    }
    catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Google login failed"
        });

    }

}