import { useState, useEffect } from "react";
import { Button, Container, Form } from "react-bootstrap";
import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from 'axios'; // Ensure axios is installed

export default function AddBooking() {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState("");
    const [user_id, setUserId] = useState(null); // State to store user ID
    const navigate = useNavigate();

    // Use useEffect to retrieve user_id when the component mounts
    useEffect(() => {
        const storedUserId = localStorage.getItem("user_id");
        console.log("Stored user_id from localStorage:", storedUserId); // Example of getting user_id from localStorage
        if (storedUserId) {
            setUserId(storedUserId);  // Store the user ID in state
        } else {
            // Handle case where user_id isn't found (e.g., redirect to login)
            navigate("/login");
        }
    }, [navigate]);

    const createBooking = async () => {
        if (!user_id) {
            console.error("User not logged in");
            return;
        }

        try {
            const bookingData = {
                user_id: Number(user_id), // 👈 force to number to match DB
                title,
                booking_date: date.toISOString().split('T')[0],
                booking_time: time,
            };

            console.log("Sending booking data:", bookingData); // 👈 log it

            const response = await axios.post('https://e9a31eec-d312-45e7-8960-2a935181c7c2-00-21vv1xhchkzhd.sisko.replit.dev/bookings', bookingData);

            if (response.status === 200) {
                navigate("/home");
            }
        } catch (error) {
            console.error("Error creating booking:", error.response?.data || error.message);
        }
    };

    return (
        <Container>
            <h1 className="my-3">Add Booking</h1>
            <Form
                onSubmit={(event) => {
                    event.preventDefault();
                    createBooking();
                }}
            >
                <Form.Group className="mb-3" controlId="title">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                        placeholder="Enter booking title"
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="date">
                    <Form.Label>Select Date</Form.Label>
                    <Calendar
                        onChange={setDate}
                        value={date}
                        tileClassName={({ date: tileDate }) =>
                            tileDate.toDateString() === date.toDateString() ? "bg-info text-white rounded-circle" : null
                        }
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="time">
                    <Form.Label>Select Time</Form.Label>
                    <Form.Control
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </Container>
    );
}
