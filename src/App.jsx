import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Nav, Navbar } from "react-bootstrap";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import AddBooking from "./pages/AddBooking";
import EditBooking from "./pages/EditBooking";
import useLocalStorage from "use-local-storage";
import { BookingContext } from "./contexts/BookingContext";
import { LoadScript } from "@react-google-maps/api";
import { useState } from "react";

// Layout WITH Navbar (used for home, add booking, etc.)
function Layout() {
  return (
    <>
      <Navbar bg="light" variant="light">
        <Container>
          <div className="mb-1">
            <img
              src="/images/clinic-logo.jpg"
              alt="Dental Logo"
              style={{ width: '80px', marginRight: '5.5rem' }}
            />
          </div>
          <Navbar.Brand href="/home">Appointments</Navbar.Brand>
          <Nav>
            <Nav.Link href="/add">Add Appointment</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
}

export default function App() {
  const [bookings, setBookings] = useLocalStorage("bookings", []);
  const [mapsLoaded, setMapsLoaded] = useState(false);

  console.log("Google Maps API Key:", import.meta.env.VITE_GOOGLE_MAPS_API_KEY);

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={["places"]}
      onLoad={() => setMapsLoaded(true)}
    >
      {mapsLoaded ? (
        <BookingContext.Provider value={{ bookings, setBookings }}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route element={<Layout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/add" element={<AddBooking />} />
                <Route path="/edit/:bookingId" element={<EditBooking />} />
                <Route path="*" element={<ErrorPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </BookingContext.Provider>
      ) : (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
          <h5>Loading Google Maps...</h5>
        </div>
      )}
    </LoadScript>
  );
}
