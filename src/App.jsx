import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Nav, Navbar } from "react-bootstrap";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AddBooking from "./pages/AddBooking";
import useLocalStorage from "use-local-storage";
import { BookingContext } from "./contexts/BookingContext";

// Layout WITH Navbar (used for home, add booking, etc.)
function Layout() {
  return (
    <>
      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand href="/home">Bookings</Navbar.Brand>
          <Nav>
            <Nav.Link href="/add">Add Booking</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
}

export default function App() {
  const [bookings, setBookings] = useLocalStorage("bookings", []);

  return (
    <BookingContext.Provider value={{ bookings, setBookings }}>
      <BrowserRouter>
        <Routes>
          {/* ✅ Login route WITHOUT layout */}
          <Route path="/" element={<Login />} />

          {/* ✅ Protected or main pages WITH layout */}
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/add" element={<AddBooking />} />
            <Route path="*" element={<ErrorPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </BookingContext.Provider>
  );
}
