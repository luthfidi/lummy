import { Routes, Route } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { HomePage } from "./pages/HomePage";
import { EventsPage } from "./pages/Events";
import { EventDetailPage } from "./pages/EventDetail";
import { CheckoutPage } from "./pages/Checkout";
import { MyTicketsPage } from "./pages/MyTickets";
import { MarketplacePage } from "./pages/Marketplace";
import { ProfilePage } from "./pages/Profile";
import {
  AdminDashboard,
  CreateEventForm,
  EventManagement,
} from "./pages/Admin";
import { CheckInDashboard, ScannerPage } from "./pages/TicketManagement";
import { Web3Provider } from "./services/Web3Provider";

function App() {
  return (
    <Web3Provider>
      <Box minH="100vh" display="flex" flexDirection="column">
        <Navbar />
        <Box flex="1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/event/:id" element={<EventDetailPage />} />
            <Route path="/checkout/:id" element={<CheckoutPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/tickets" element={<MyTicketsPage />} />
            <Route path="/tickets/:id" element={<MyTicketsPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/events/create" element={<CreateEventForm />} />
            <Route path="/admin/events/:id" element={<EventManagement />} />

            {/* Ticket Management routes */}
            <Route
              path="/admin/events/:eventId/check-in"
              element={<CheckInDashboard />}
            />
            <Route
              path="/admin/events/:eventId/scanner"
              element={<ScannerPage />}
            />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </Web3Provider>
  );
}

export default App;
