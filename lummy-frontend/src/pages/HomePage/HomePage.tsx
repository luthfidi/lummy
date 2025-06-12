import { Box, Container, useDisclosure } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  HeroSection,
  FeatureSection,
  FaqSection,
  TestimonialSection,
} from "../../components/home";
import { FeaturedEvents, CategoryNav } from "../../components/events";
import { DevelopmentNoticeModal } from "../../components/common/DevelopmentNoticeModal";
import { mockEvents } from "../../data/mockEvents";
import { Event } from "../../types/Event";

export const HomePage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Check if user has seen the development notice in this session
  useEffect(() => {
    const hasSeenNotice = sessionStorage.getItem("hasSeenDevNotice");
    if (!hasSeenNotice) {
      // Small delay to let the page load first
      setTimeout(() => {
        onOpen();
      }, 1000);
    }
  }, [onOpen]);

  // Handle modal close
  const handleModalClose = () => {
    sessionStorage.setItem("hasSeenDevNotice", "true");
    onClose();
  };

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
      {/* Development Notice Modal */}
      <DevelopmentNoticeModal isOpen={isOpen} onClose={handleModalClose} />

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
