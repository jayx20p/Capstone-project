// pages/EditBooking.jsx
import { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
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
    const { bookingId } = useParams(); // <-- get bookingId from URL

    // Google Places Autocomplete
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

    // Fetch existing booking details
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

    if (loading) return <div className="text-center mt-5">Loading booking details...</div>;

    return (
        <Container>
            <h1 className="my-3">Edit Booking</h1>
            <Form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateBooking();
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
                            tileDate.toDateString() === date.toDateString()
                                ? "bg-info text-white rounded-circle"
                                : null
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

                <Form.Group className="mb-3" controlId="location">
                    <Form.Label>Enter Address</Form.Label>
                    <Form.Control
                        type="text"
                        value={selectedAddress}
                        onChange={(e) => setValue(e.target.value)}
                        disabled={!ready}
                        placeholder="Search address (Google Maps)"
                        required
                    />
                    {status === "OK" && (
                        <div className="border border-light-subtle rounded shadow-sm mt-1">
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
                    <p className="text-muted small">Selected: {selectedAddress}</p>
                )}

                <Button variant="primary" type="submit">
                    Update Booking
                </Button>
            </Form>
        </Container>
    );
}
