import "bootstrap/dist/css/bootstrap.min.css";
import { LoadScript } from "@react-google-maps/api";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddBooking from "./pages/AddBooking";
import EditBooking from "./pages/EditBooking";
import Login from "./pages/Login";
import ErrorPage from "./pages/ErrorPage";
import { BookingContext } from "./contexts/BookingContext";
import useLocalStorage from "use-local-storage";

export default function App() {
  const [bookings, setBookings] = useLocalStorage("bookings", []);

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={["places"]}
    >
      <BookingContext.Provider value={{ bookings, setBookings }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/add" element={<AddBooking />} />
            <Route path="/edit/:bookingId" element={<EditBooking />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </BrowserRouter>
      </BookingContext.Provider>
    </LoadScript>
  );
}
