import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { BookingContext } from "../contexts/BookingContext";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function Home() {
    const { bookings, setBookings } = useContext(BookingContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get('https://e9a31eec-d312-45e7-8960-2a935181c7c2-00-21vv1xhchkzhd.sisko.replit.dev/bookings');
                setBookings(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching bookings:", err);
                setError("Failed to load bookings");
                setLoading(false);
            }
        };

        fetchBookings();
    }, [setBookings]);

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`https://e9a31eec-d312-45e7-8960-2a935181c7c2-00-21vv1xhchkzhd.sisko.replit.dev/bookings/${id}`);
            if (response.status === 200) {
                setBookings(bookings.filter((booking) => booking.booking_id !== id));
            }
        } catch (err) {
            console.error("Error deleting booking:", err);
            setError("Failed to delete booking");
        }
    };

    if (loading) return <div className="text-center mt-5">Loading your appointments...</div>;
    if (error) return <div className="text-center text-danger mt-5">{error}</div>;

    return (
        <div style={{
            background: 'linear-gradient(to bottom right, #e3f2fd, #ffffff)',
            minHeight: '100vh',
            padding: '2rem 0'
        }}>
            <Container>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 style={{ color: '#007bff' }}>Your Dental Appointments</h2>
                    <Button variant="outline-primary" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>
                <Row className="gx-4 gy-4">
                    <CardGroup bookings={bookings} handleDelete={handleDelete} />
                </Row>
            </Container>
        </div>
    );
}

function CardGroup({ bookings, handleDelete }) {
    return bookings.map((booking) => {
        const completed = booking.completed;
        const bg = completed ? "success" : "warning";
        const formattedDate = booking.booking_date instanceof Date
            ? booking.booking_date.toLocaleDateString()
            : booking.booking_date;
        const formattedTime = booking.booking_time instanceof Date
            ? booking.booking_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : booking.booking_time;

        return (
            <Col md={6} lg={4} key={booking.booking_id}>
                <Card className="shadow-sm rounded-4 border-0">
                    <Card.Body>
                        <Card.Title className="fw-bold text-primary">{booking.title}</Card.Title>
                        <Card.Text className="text-muted">{booking.description}</Card.Text>
                        <Card.Text><strong>Date:</strong> {formattedDate}</Card.Text>
                        <Card.Text><strong>Time:</strong> {formattedTime}</Card.Text>
                        <Badge bg={bg} className="mb-3">
                            {completed ? "Completed" : "Pending"}
                        </Badge>
                        <div>
                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDelete(booking.booking_id)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        );
    });
}
