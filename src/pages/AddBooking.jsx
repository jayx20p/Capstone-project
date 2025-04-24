import { useState, useEffect } from "react";
import { Button, Container, Form } from "react-bootstrap";
import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

export default function AddBooking() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("");
  const [user_id, setUserId] = useState(null);
  const [location, setLocation] = useState({ lat: 3.139, lng: 101.6869 }); // optional
  const [selectedAddress, setSelectedAddress] = useState("");
  const navigate = useNavigate();

  // Google Places Autocomplete setup
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
          setSelectedAddress(description);  // Use this to store the selected address
          setLocation({ lat, lng }); // optional if you want to store coords
        } catch (error) {
          console.error("Error getting geocode:", error);
        }
      };

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
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
        user_id: Number(user_id),
        title,
        booking_date: date.toISOString().split("T")[0],
        booking_time: time,
        location: selectedAddress, // sending selected address to backend
      };

      console.log("Booking Data:", bookingData); // Add this log to ensure location is being sent

      const response = await axios.post(
        "https://e9a31eec-d312-45e7-8960-2a935181c7c2-00-21vv1xhchkzhd.sisko.replit.dev/bookings",
        bookingData
      );

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
        onSubmit={(e) => {
          e.preventDefault();
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
            value={selectedAddress}  // Use selectedAddress for the input field
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
          Submit
        </Button>
      </Form>
    </Container>
  );
}
