import { Box, Container } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  HeroSection,
  FeatureSection,
  FaqSection,
  TestimonialSection,
} from "../../components/home";
import { FeaturedEvents, CategoryNav } from "../../components/events";
import { mockEvents } from "../../data/mockEvents";
import { useEffect, useState } from "react";
import { Event } from "../../types/Event";
// Removed unused import: import {ConnectButton} from "@xellar/kit";

export const HomePage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Simulate API call to fetch events
    setTimeout(() => {
      setEvents(mockEvents);
    }, 1000);
  }, []);

  const handleEventClick = (eventId: string) => {
    navigate(`/event/${eventId}`);
  };

  const handleViewAllClick = () => {
    navigate("/events");
  };

  const handleCategorySelect = (category: string) => {
    // Navigate to events page with category filter
    navigate(`/events?category=${category}`);
  };

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection />

      {/* Category Navigation */}
      <Container maxW="container.xl" py={12}>
        <CategoryNav onCategorySelect={handleCategorySelect} />
      </Container>

      {/* Featured Events Section */}
      <Container maxW="container.xl" py={8}>
        <FeaturedEvents
          events={events}
          onEventClick={handleEventClick}
          onViewAllClick={handleViewAllClick}
        />
      </Container>

      {/* Features Section */}
      <FeatureSection />

      {/* Testimonials Section */}
      <TestimonialSection />

      {/* FAQ Section */}
      <FaqSection />
    </Box>
  );
};

export default HomePage;
