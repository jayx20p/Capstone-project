import pool from "../db/connection.js";


// ===============================
// GET ALL BOOKINGS
// ===============================
export async function getBookings(req, res) {

    try {

        const result = await pool.query(
            `
            SELECT *
            FROM bookings
            ORDER BY booking_date ASC, booking_time ASC
            `
        );


        res.json(result.rows);


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch bookings"
        });

    }

}



// ===============================
// GET SINGLE BOOKING
// ===============================
export async function getBookingById(req, res) {

    const { id } = req.params;


    try {

        const result = await pool.query(
            `
            SELECT *
            FROM bookings
            WHERE booking_id=$1
            `,
            [id]
        );


        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Booking not found"
            });

        }


        res.json(result.rows[0]);


    }
    catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to get booking"
        });

    }

}



// ===============================
// CREATE BOOKING
// ===============================
export async function createBooking(req, res) {


    const {
        user_id,
        title,
        booking_date,
        booking_time,
        location
    } = req.body;



    try {


        const result = await pool.query(

            `
            INSERT INTO bookings
            (
                user_id,
                title,
                booking_date,
                booking_time,
                location
            )

            VALUES($1,$2,$3,$4,$5)

            RETURNING *
            `,

            [
                user_id,
                title,
                booking_date,
                booking_time,
                location
            ]

        );



        res.json(result.rows[0]);


    }
    catch (error) {

        console.error(error);


        res.status(500).json({
            message: error.message
        });

    }

}




// ===============================
// UPDATE BOOKING
// ===============================
export async function updateBooking(req, res) {


    const { id } = req.params;


    const {
        title,
        booking_date,
        booking_time,
        location
    } = req.body;



    try {


        const result = await pool.query(

            `
            UPDATE bookings

            SET
            title=$1,
            booking_date=$2,
            booking_time=$3,
            location=$4,
            updated_at=NOW()

            WHERE booking_id=$5

            RETURNING *
            `,

            [
                title,
                booking_date,
                booking_time,
                location,
                id
            ]

        );


        res.json(result.rows[0]);


    }
    catch (error) {

        console.error(error);


        res.status(500).json({
            message: "Failed to update booking"
        });

    }

}




// ===============================
// DELETE BOOKING
// ===============================
export async function deleteBooking(req, res) {


    const { id } = req.params;


    try {


        await pool.query(

            `
            DELETE FROM bookings
            WHERE booking_id=$1
            `,
            [id]

        );


        res.json({
            message: "Booking deleted"
        });



    }
    catch (error) {

        console.error(error);


        res.status(500).json({
            message: "Failed to delete booking"
        });

    }

}





// ===============================
// UPDATE COMPLETED STATUS
// ===============================
export async function updateCompleted(req, res) {


    const { id } = req.params;


    const { completed } = req.body;



    try {


        const result = await pool.query(

            `
            UPDATE bookings

            SET
            completed=$1,
            updated_at=NOW()

            WHERE id=$2

            RETURNING *
            `,

            [
                completed,
                id
            ]

        );


        res.json(result.rows[0]);


    }
    catch (error) {

        console.error(error);


        res.status(500).json({
            message: "Failed to update status"
        });

    }

}