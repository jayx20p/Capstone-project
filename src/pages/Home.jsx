import { Badge, Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { BookingContext } from "../contexts/BookingContext";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import ProfilePictureUploader from "../components/ProfilePictureUploader";

export default function Home() {
    const { bookings, setBookings } = useContext(BookingContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profilePicUrl, setProfilePicUrl] = useState(null);
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
        const fetchProfilePicture = async () => {
            const userId = localStorage.getItem("user_id");
            if (userId) {
                try {
                    const response = await axios.get(`https://e9a31eec-d312-45e7-8960-2a935181c7c2-00-21vv1xhchkzhd.sisko.replit.dev/users/${userId}/profile-picture`);
                    setProfilePicUrl(response.data.profile_picture); // Set the profile picture URL
                } catch (err) {
                    console.error("Error fetching profile picture:", err);
                }
            }
        };

        fetchBookings();
        fetchProfilePicture();
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

    if (loading) {
        return (
            <div style={{
                background: 'linear-gradient(to bottom right, #d0f0f6, #ffffff)',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Spinner animation="border" variant="info" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-danger mt-5">
                {error}
            </div>
        );
    }

    return (
        <div style={{
            background: 'linear-gradient(to bottom right, #d0f0f6, #ffffff)',
            minHeight: '100vh',
            padding: '2rem 0'
        }}>
            <Container>
                <div className="text-center mb-5">
                    {profilePicUrl ? (
                        <img
                            src={profilePicUrl}
                            alt="Profile"
                            className="profile-picture"
                            style={{
                                width: "120px",
                                height: "120px",
                                objectFit: "cover",
                                marginBottom: "1rem",
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                width: "120px",
                                height: "120px",
                                borderRadius: "50%",
                                backgroundColor: "#e0e0e0",
                                display: "inline-block",
                                marginBottom: "1rem",
                            }}
                        />
                    )}
                    <h3 className="mt-2" style={{ color: "#00bcd4", fontWeight: "600" }}>
                        Welcome Back!
                    </h3>

                    <ProfilePictureUploader
                        userId={localStorage.getItem("user_id")}
                        onUploadComplete={(url) => setProfilePicUrl(url)}
                    />
                </div>

                {/* Position the Logout button in the top-right corner */}
                <div style={{
                    position: 'absolute',
                    top: '105px',
                    left: '115px',
                    zIndex: 10
                }}>
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
    const [localBookings, setLocalBookings] = useState(bookings);
    const navigate = useNavigate();

    const handleCheckboxChange = (id) => {
        const updatedBookings = localBookings.map((booking) => {
            if (booking.booking_id === id) {
                const newStatus = !booking.completed;
                // Send update to backend
                axios.put(`https://e9a31eec-d312-45e7-8960-2a935181c7c2-00-21vv1xhchkzhd.sisko.replit.dev/bookings/${id}/completed`, { completed: newStatus })
                    .then(() => {
                        console.log("Status updated");
                    })
                    .catch(err => {
                        console.error("Failed to update status:", err);
                    });
                return { ...booking, completed: !booking.completed };
            }
            return booking;
        });
        setLocalBookings(updatedBookings);
    };

    useEffect(() => {
        setLocalBookings(bookings);
    }, [bookings]);

    return localBookings.length > 0 ? (
        localBookings.map((booking) => {
            const completed = booking.completed;
            const bg = completed ? "success" : "warning";
            const formattedDate = typeof booking.booking_date === "string"
                ? booking.booking_date
                : booking.booking_date.toLocaleDateString();
            const formattedTime = typeof booking.booking_time === "string"
                ? booking.booking_time
                : booking.booking_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
                <Col md={6} lg={4} key={booking.booking_id}>
                    <Card className="shadow-sm rounded-4 border-0 h-100">
                        <Card.Body className="d-flex flex-column justify-content-between">
                            <div>
                                <Card.Title className="fw-bold text-primary">{booking.title}</Card.Title>
                                <Card.Text className="text-muted small">{booking.description || "No additional notes"}</Card.Text>
                                <Card.Text><strong>Date:</strong> {formattedDate}</Card.Text>
                                <Card.Text><strong>Time:</strong> {formattedTime}</Card.Text>
                                <Card.Text><strong>Location:</strong> {booking.location}</Card.Text>

                                <div className="d-flex align-items-center mb-3">
                                    <Badge bg={bg} className="me-2">
                                        {completed ? "Completed" : "Pending"}
                                    </Badge>

                                    {!completed && (
                                        <Form.Check
                                            type="checkbox"
                                            label="Mark as completed"
                                            onChange={() => handleCheckboxChange(booking.booking_id)}
                                            className="small"
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="d-flex justify-content-between">
                                <Button
                                    variant="outline-success"
                                    size="sm"
                                    className="rounded-3"
                                    onClick={() => navigate(`/edit/${booking.booking_id}`)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    className="rounded-3"
                                    onClick={() => handleDelete(booking.booking_id)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            );
        })
    ) : (
        <div className="text-center text-muted">No appointments yet.</div>
    );
}

