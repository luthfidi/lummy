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
  OrganizerDashboard,
  CreateEventForm,
  EventManagement,
} from "./pages/Organizer";
import { CheckInDashboard, ScannerPage } from "./pages/TicketManagement";
import OrganizerRequestPage from "./pages/OrganizerRequest/OrganizerRequestPage";
import OrganizerRequestsAdmin from "./pages/OrganizerRequest/OrganizerRequestsAdmin";
import { Web3Provider } from "./services/Web3Provider";
import { RoleProvider } from "./context/RoleContext";

/**
 * Main application component defining the routing structure.
 * Wraps the entire application in the Web3Provider for blockchain connectivity
 * and RoleProvider for role-based navigation.
 * Maintains a consistent layout with Navbar and Footer across all routes.
 */
function App() {
  return (
    <Web3Provider>
      <RoleProvider>
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

              {/* Organizer routes */}
              <Route path="/organizer" element={<OrganizerDashboard />} />
              <Route path="/organizer/events/create" element={<CreateEventForm />} />
              <Route path="/organizer/events/:id" element={<EventManagement />} />

              {/* Ticket Management routes */}
              <Route
                path="/organizer/events/:eventId/check-in"
                element={<CheckInDashboard />}
              />
              <Route
                path="/organizer/events/:eventId/scanner"
                element={<ScannerPage />}
              />

              {/* Organizer Request routes */}
              <Route path="/organizer-request" element={<OrganizerRequestPage />} />
              <Route path="/admin" element={<OrganizerRequestsAdmin />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </RoleProvider>
    </Web3Provider>
  );
}

export default App;