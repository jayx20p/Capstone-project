import { useEffect, useState } from "react";
import { Button, Container, Card, Form, Spinner } from "react-bootstrap";
import Calendar from "react-calendar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";

export default function EditBooking() {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState("");
    const [location, setLocation] = useState({ lat: 3.139, lng: 101.6869 });
    const [selectedAddress, setSelectedAddress] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { bookingId } = useParams();

    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete();

    const handleSelect =
        ({ description }) =>
            async () => {
                setValue(description, false);
                clearSuggestions();
                try {
                    const results = await getGeocode({ address: description });
                    const { lat, lng } = await getLatLng(results[0]);
                    setSelectedAddress(description);
                    setLocation({ lat, lng });
                } catch (error) {
                    console.error("Error getting geocode:", error);
                }
            };

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await axios.get(
                    `https://e9a31eec-d312-45e7-8960-2a935181c7c2-00-21vv1xhchkzhd.sisko.replit.dev/bookings/${bookingId}`
                );

                const booking = response.data;
                setTitle(booking.title || "");
                setDate(new Date(booking.booking_date));
                setTime(booking.booking_time || "");
                setSelectedAddress(booking.location || "");
                setLoading(false);
            } catch (error) {
                console.error("Error fetching booking:", error);
                setLoading(false);
            }
        };

        fetchBooking();
    }, [bookingId]);

    const handleUpdateBooking = async () => {
        try {
            const updatedData = {
                title,
                booking_date: date.toISOString().split("T")[0],
                booking_time: time,
                location: selectedAddress,
            };

            await axios.put(
                `https://e9a31eec-d312-45e7-8960-2a935181c7c2-00-21vv1xhchkzhd.sisko.replit.dev/bookings/${bookingId}`,
                updatedData
            );

            navigate("/home");
        } catch (error) {
            console.error("Error updating booking:", error.response?.data || error.message);
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

    return (
        <div style={{
            background: 'linear-gradient(to bottom right, #d0f0f6, #ffffff)',
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem'
        }}>
            <Card style={{
                width: '100%',
                maxWidth: '500px',
                padding: '2rem',
                borderRadius: '1.5rem',
                boxShadow: '0 8px 30px rgba(0, 123, 255, 0.2)',
                border: 'none',
            }}>
                <Card.Body>
                    <div className="text-center mb-4">
                        <img
                            src="/images/clinic-logo.jpg" // replace with your correct logo path
                            alt="BrightSmile Dental Logo"
                            style={{ width: '60px', marginBottom: '1rem' }}
                        />
                        <h3 style={{ color: '#00bcd4', fontWeight: '600' }}>Edit Your Appointment</h3>
                        <p className="text-muted" style={{ fontSize: '0.95rem' }}>
                            Update your dental visit details
                        </p>
                    </div>

                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdateBooking();
                        }}
                    >
                        <Form.Group className="mb-3" controlId="title">
                            <Form.Label>Appointment Title</Form.Label>
                            <Form.Control
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                type="text"
                                placeholder="E.g., Tooth Extraction, Braces Consultation"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="date">
                            <Form.Label>Select New Date</Form.Label>
                            <div className="p-2 rounded border">
                                <Calendar
                                    onChange={setDate}
                                    value={date}
                                    tileClassName={({ date: tileDate }) =>
                                        tileDate.toDateString() === date.toDateString()
                                            ? "bg-info text-white rounded-circle"
                                            : null
                                    }
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="time">
                            <Form.Label>Select New Time</Form.Label>
                            <Form.Control
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="location">
                            <Form.Label>Update Clinic Address</Form.Label>
                            <Form.Control
                                type="text"
                                value={selectedAddress}
                                onChange={(e) => setValue(e.target.value)}
                                disabled={!ready}
                                placeholder="Type and select address"
                                required
                            />
                            {status === "OK" && (
                                <div className="border border-light rounded shadow-sm mt-1" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                    {data.map(({ place_id, description }) => (
                                        <div
                                            key={place_id}
                                            className="p-2 border-bottom hover-bg-light"
                                            style={{ cursor: "pointer" }}
                                            onClick={handleSelect({ description })}
                                        >
                                            {description}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Form.Group>

                        {selectedAddress && (
                            <p className="text-muted small mb-3">Selected: {selectedAddress}</p>
                        )}

                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100"
                            style={{
                                backgroundColor: '#00bcd4',
                                border: 'none',
                                fontWeight: '600',
                                letterSpacing: '0.5px'
                            }}
                        >
                            Update Appointment
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}

