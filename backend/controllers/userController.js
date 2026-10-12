import pool from "../db/connection.js";


export async function updateProfilePicture(req, res) {

    const { id } = req.params;

    const {
        profile_picture
    } = req.body;


    try {

        const result =
            await pool.query(
                `
        UPDATE users
        SET profile_picture=$1,
        updated_at=NOW()
        WHERE id=$2
        RETURNING *
        `,
                [
                    profile_picture,
                    id
                ]);


        res.json(result.rows[0]);

    }
    catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

}




export async function getProfilePicture(req, res) {

    const { id } = req.params;


    const result =
        await pool.query(
            `
    SELECT profile_picture
    FROM users
    WHERE id=$1
    `,
            [id]
        );


    res.json(result.rows[0]);

}