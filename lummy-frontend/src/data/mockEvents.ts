import { Event } from "../types/Event";

export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Summer Music Festival",
    description:
      "The biggest music festival of the summer featuring top artists from around the world.",
    longDescription: `Get ready for the ultimate summer experience! The Summer Music Festival brings together the biggest names in music for an unforgettable weekend.

From pop to rock, hip-hop to electronic, this festival has something for everyone. Join thousands of music lovers from around the world for this celebration of sound.

Highlights include:
- 3 main stages with continuous performances
- Food and drink vendors offering local and international cuisine
- Artisan market with unique merchandise
- Chill-out zones for when you need a break
- Free water stations throughout the venue

Don't miss out on the biggest music event of the summer!`,
    date: "2025-06-15T12:00:00",
    time: "12:00 PM",
    endTime: "11:00 PM",
    location: "Jakarta Convention Center",
    venue: "Jakarta Convention Center Main Arena",
    address: "Jl. Gatot Subroto, Jakarta 10270, Indonesia",
    imageUrl:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    bannerUrl:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    price: 250,
    currency: "IDRX",
    category: "Music",
    status: "available",
    organizer: {
      id: "org1",
      name: "EventMaster Indonesia",
      verified: true,
      description:
        "Indonesia's premier event organizer, bringing world-class experiences to Jakarta since 2015.",
      website: "https://example.com",
      eventsHosted: 48,
    },
    ticketsAvailable: 500,
    ticketTiers: [
      {
        id: "tier1",
        name: "General Admission",
        price: 250,
        currency: "IDRX",
        description: "Standard festival access for one day",
        available: 300,
        maxPerPurchase: 4,
      },
      {
        id: "tier2",
        name: "VIP Pass",
        price: 500,
        currency: "IDRX",
        description:
          "Enhanced experience with premium viewing areas and complimentary refreshments",
        available: 100,
        maxPerPurchase: 2,
        benefits: [
          "Access to VIP viewing areas",
          "Complimentary food and drinks",
          "VIP restroom facilities",
          "Exclusive festival merchandise",
        ],
      },
      {
        id: "tier3",
        name: "Weekend Pass",
        price: 450,
        currency: "IDRX",
        description: "Full weekend access to all festival days",
        available: 150,
        maxPerPurchase: 4,
      },
      {
        id: "tier4",
        name: "Backstage Experience",
        price: 1000,
        currency: "IDRX",
        description: "The ultimate festival experience with backstage access",
        available: 0,
        maxPerPurchase: 2,
        benefits: [
          "All VIP benefits",
          "Backstage tour",
          "Artist meet & greet opportunity",
          "Exclusive backstage lounge access",
        ],
      },
    ],
    tags: ["music", "festival", "concert", "summer"],
  },
  {
    id: "2",
    title: "Tech Conference 2025",
    description:
      "Join the leading tech experts for a day of learning and networking.",
    longDescription: `Tech Conference 2025 brings together industry leaders, innovators, and tech enthusiasts for an immersive day of knowledge sharing and networking.

This year's conference focuses on emerging technologies including AI, blockchain, and the future of web development. Whether you're a seasoned professional or just starting your tech journey, you'll find valuable insights and connections.

Conference schedule includes:
- Keynote speeches from industry pioneers
- Technical workshops with hands-on experience
- Panel discussions on trending topics
- Networking sessions with like-minded professionals
- Exhibition area showcasing cutting-edge products

Don't miss this opportunity to stay ahead of the curve in the rapidly evolving tech landscape.`,
    date: "2025-07-25T09:00:00",
    time: "09:00 AM",
    endTime: "05:00 PM",
    location: "Digital Hub Bandung",
    venue: "Digital Hub Conference Center",
    address: "Jl. Dipati Ukur No. 112, Bandung 40132, Indonesia",
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    bannerUrl:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1712&q=80",
    price: 150,
    currency: "IDRX",
    category: "Technology",
    status: "limited",
    organizer: {
      id: "org2",
      name: "TechTalks ID",
      verified: true,
      description:
        "Dedicated to fostering tech innovation and knowledge sharing in Indonesia.",
      website: "https://example.com",
      eventsHosted: 24,
    },
    ticketsAvailable: 50,
    ticketTiers: [
      {
        id: "tier1",
        name: "Standard Access",
        price: 150,
        currency: "IDRX",
        description:
          "Full day access to all conference sessions and exhibition area",
        available: 30,
        maxPerPurchase: 5,
      },
      {
        id: "tier2",
        name: "Premium Access",
        price: 300,
        currency: "IDRX",
        description:
          "Enhanced experience with premium seating and exclusive workshops",
        available: 20,
        maxPerPurchase: 2,
        benefits: [
          "Priority seating in all sessions",
          "Access to exclusive workshops",
          "Lunch with speakers",
          "Digital copy of all presentations",
        ],
      },
      {
        id: "tier3",
        name: "Student Pass",
        price: 75,
        currency: "IDRX",
        description: "Discounted ticket for students with valid student ID",
        available: 0,
        maxPerPurchase: 1,
      },
    ],
    tags: ["technology", "conference", "networking", "education"],
  },
  {
    id: "3",
    title: "Blockchain Workshop",
    description:
      "Hands-on workshop to learn about blockchain technology and development.",
    date: "2025-08-10",
    time: "10:00",
    location: "Blockchain Center Jakarta",
    imageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    price: 100,
    currency: "IDRX",
    category: "Workshop",
    status: "available",
    organizer: {
      id: "org3",
      name: "Blockchain Indonesia",
      verified: true,
      description:
        "Leading the blockchain revolution in Indonesia through education and community building.",
      eventsHosted: 15,
    },
    ticketsAvailable: 100,
    ticketTiers: [
      {
        id: "tier1",
        name: "Workshop Ticket",
        price: 100,
        currency: "IDRX",
        description: "Full access to the workshop including materials",
        available: 80,
        maxPerPurchase: 3,
      },
      {
        id: "tier2",
        name: "Workshop + Certification",
        price: 200,
        currency: "IDRX",
        description:
          "Workshop access plus official certification upon completion",
        available: 50,
        maxPerPurchase: 1,
        benefits: [
          "Full workshop access",
          "Official certification",
          "Post-workshop support for 1 month",
          "Access to exclusive online resources",
        ],
      },
    ],
  },
  {
    id: "4",
    title: "Art Exhibition: Future Visions",
    description:
      "A showcase of futuristic art and digital creations from emerging artists.",
    longDescription: `Step into the future of art with "Future Visions" - an immersive exhibition showcasing cutting-edge works from emerging and established digital artists.

This exhibition explores themes of technology, nature, humanity, and the intersection of physical and digital worlds. Through various mediums including digital paintings, interactive installations, and virtual reality experiences, artists present their visions of possible futures.

Exhibition highlights:
- 30+ artists from across Asia
- Interactive digital installations
- VR experience zone
- Artist talks and live demonstrations
- Limited edition digital collectibles available for purchase

This exhibition pushes the boundaries of traditional art and invites visitors to question, imagine, and engage with tomorrow's possibilities.`,
    date: "2025-09-05",
    time: "11:00 AM",
    endTime: "08:00 PM",
    location: "Modern Gallery Surabaya",
    venue: "Modern Gallery",
    address: "Jl. Pemuda No. 38, Surabaya 60271, Indonesia",
    imageUrl:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    bannerUrl:
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
    price: 75,
    currency: "IDRX",
    category: "Art",
    status: "soldout",
    organizer: {
      id: "org4",
      name: "Creative Arts Network",
      verified: true,
      description:
        "Supporting and promoting digital artists throughout Indonesia and Southeast Asia.",
      website: "https://example.com",
      eventsHosted: 32,
    },
    ticketsAvailable: 0,
    ticketTiers: [
      {
        id: "tier1",
        name: "Standard Entry",
        price: 75,
        currency: "IDRX",
        description: "General admission to the exhibition",
        available: 0,
        maxPerPurchase: 5,
      },
      {
        id: "tier2",
        name: "Premium Experience",
        price: 150,
        currency: "IDRX",
        description: "Enhanced visit with guided tour and exclusive events",
        available: 0,
        maxPerPurchase: 2,
        benefits: [
          "Priority entry (skip the line)",
          "Guided tour with curator",
          "Invitation to exclusive artist talk",
          "Exhibition catalog",
        ],
      },
    ],
    tags: ["art", "exhibition", "digital", "futuristic"],
  },
  // New events for remaining categories
  {
    id: "5",
    title: "Liga Indonesia Championship Finals",
    description:
      "The ultimate football match to determine this season's champion team.",
    longDescription: `Experience the thrill and excitement of Indonesian football at its best as the top two teams of the season battle for the championship title. 

The Liga Indonesia Championship Finals is the culmination of months of intense competition, bringing together the best football talent in the country. Watch as these elite athletes showcase their skills, tactics, and teamwork in a match that promises to be unforgettable.

Event highlights:
- Pre-match entertainment with live music performances
- Half-time show featuring traditional Indonesian dancers
- Post-match awards ceremony and trophy presentation
- Fan zones with interactive activities and merchandise stalls
- Food and beverage concessions featuring local favorites

This is more than just a football match – it's a celebration of Indonesia's passion for the beautiful game and a chance to witness sporting history in the making.`,
    date: "2025-05-30T19:00:00",
    time: "7:00 PM",
    endTime: "10:00 PM",
    location: "Gelora Bung Karno Stadium",
    venue: "Gelora Bung Karno Main Stadium",
    address: "Jl. Pintu Satu Senayan, Jakarta 10270, Indonesia",
    imageUrl:
      "https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    bannerUrl:
      "https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    price: 200,
    currency: "IDRX",
    category: "Sports",
    status: "limited",
    organizer: {
      id: "org5",
      name: "Liga Indonesia Management",
      verified: true,
      description:
        "The official organizer of professional football competitions in Indonesia.",
      website: "https://example.com",
      eventsHosted: 56,
    },
    ticketsAvailable: 1000,
    ticketTiers: [
      {
        id: "tier1",
        name: "General Seating",
        price: 200,
        currency: "IDRX",
        description: "Standard seating with good views of the field",
        available: 500,
        maxPerPurchase: 4,
      },
      {
        id: "tier2",
        name: "Premium Seating",
        price: 350,
        currency: "IDRX",
        description: "Premium seats with excellent views of the action",
        available: 300,
        maxPerPurchase: 4,
        benefits: [
          "Premium location seating",
          "Wider, more comfortable seats",
          "Access to premium food vendors",
          "Dedicated entry gate with shorter lines",
        ],
      },
      {
        id: "tier3",
        name: "VIP Box",
        price: 750,
        currency: "IDRX",
        description: "Exclusive box seating with the best experience",
        available: 50,
        maxPerPurchase: 2,
        benefits: [
          "Private box seating with the best views",
          "Complimentary food and beverages",
          "Private restroom facilities",
          "Meet and greet with select players after the match",
          "Commemorative match program",
        ],
      },
    ],
    tags: ["sports", "football", "championship", "competition"],
  },
  {
    id: "6",
    title: "Future of Education Summit 2025",
    description:
      "A comprehensive conference exploring innovations and trends shaping education's future.",
    longDescription: `The Future of Education Summit 2025 brings together educators, policymakers, technologists, and students to explore how we can transform education for the challenges and opportunities of tomorrow.

This two-day summit features thought-provoking discussions, interactive workshops, and demonstrations of cutting-edge educational technologies. Participants will gain insights into emerging pedagogical approaches, the integration of AI and virtual reality in learning, and strategies for creating more inclusive and effective educational environments.

Summit highlights:
- Keynote addresses from global education innovators
- Panel discussions on critical issues facing education systems
- Interactive workshops demonstrating new teaching methodologies
- EdTech showcase with hands-on demonstrations
- Networking opportunities with education leaders and innovators
- Student innovation showcase

Whether you're a teacher, administrator, policymaker, or simply passionate about the future of learning, this summit offers valuable perspectives and practical tools to help shape the next generation of education.`,
    date: "2025-08-23T08:30:00",
    time: "8:30 AM",
    endTime: "5:30 PM",
    location: "Jakarta International Convention Center",
    venue: "Jakarta International Convention Center",
    address: "Jl. Gatot Subroto, Jakarta 10270, Indonesia",
    imageUrl:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    bannerUrl:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    price: 175,
    currency: "IDRX",
    category: "Education",
    status: "available",
    organizer: {
      id: "org6",
      name: "EduInnovate Foundation",
      verified: true,
      description:
        "A non-profit organization dedicated to advancing educational innovation and equity.",
      website: "https://example.com",
      eventsHosted: 12,
    },
    ticketsAvailable: 400,
    ticketTiers: [
      {
        id: "tier1",
        name: "Professional Ticket",
        price: 175,
        currency: "IDRX",
        description: "Full access to all summit sessions and materials",
        available: 250,
        maxPerPurchase: 5,
      },
      {
        id: "tier2",
        name: "Student/Teacher Ticket",
        price: 85,
        currency: "IDRX",
        description: "Discounted rate for current students and teachers",
        available: 100,
        maxPerPurchase: 3,
      },
      {
        id: "tier3",
        name: "VIP Experience",
        price: 350,
        currency: "IDRX",
        description: "Enhanced summit experience with exclusive benefits",
        available: 50,
        maxPerPurchase: 2,
        benefits: [
          "Priority seating at keynote sessions",
          "Exclusive Q&A sessions with speakers",
          "Private networking lunch with education leaders",
          "Complete set of digital resources and presentations",
          "One-year membership to EduInnovate online community",
        ],
      },
    ],
    tags: ["education", "conference", "innovation", "edtech", "learning"],
  },
  {
    id: "7",
    title: "Jakarta Food Festival 2025",
    description:
      "A culinary celebration showcasing Indonesia's diverse food culture and top chefs.",
    longDescription: `Immerse yourself in Indonesia's rich culinary landscape at the Jakarta Food Festival 2025, a three-day celebration of flavor, culture, and innovation.

This festival brings together the best of Indonesian cuisine alongside international culinary influences that have become part of the local food scene. From traditional street food to modern interpretations by award-winning chefs, the festival offers a complete gastronomic journey.

Festival highlights:
- Over 100 food stalls representing diverse culinary traditions
- Live cooking demonstrations from celebrity chefs
- Culinary workshops where you can learn to prepare traditional dishes
- Food and beverage pairings featuring local ingredients
- Street food competition with audience voting
- Special children's area with kid-friendly food activities
- Evening entertainment with live music and cultural performances

Come hungry and prepare for a sensory adventure that showcases why Indonesian cuisine deserves its place on the world stage. The festival promotes sustainable food practices and highlights local producers and ingredients that make Indonesian food special.`,
    date: "2025-07-11T10:00:00",
    time: "10:00 AM",
    endTime: "10:00 PM",
    location: "Senayan Park",
    venue: "Senayan Park Main Grounds",
    address: "Jl. Asia Afrika, Senayan, Jakarta 10270, Indonesia",
    imageUrl:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    bannerUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    price: 120,
    currency: "IDRX",
    category: "Food",
    status: "available",
    organizer: {
      id: "org7",
      name: "Culinary Indonesia Network",
      verified: true,
      description:
        "Promoting Indonesian cuisine and supporting local food entrepreneurs and traditions.",
      website: "https://example.com",
      eventsHosted: 23,
    },
    ticketsAvailable: 2000,
    ticketTiers: [
      {
        id: "tier1",
        name: "General Entry",
        price: 120,
        currency: "IDRX",
        description: "Standard festival access with 5 food sampling tokens",
        available: 1500,
        maxPerPurchase: 5,
      },
      {
        id: "tier2",
        name: "Family Package",
        price: 400,
        currency: "IDRX",
        description: "Entry for 4 people with 20 food sampling tokens",
        available: 300,
        maxPerPurchase: 2,
        benefits: [
          "Entry for 4 people",
          "20 food sampling tokens",
          "Fast-track entry line",
          "Complimentary festival cookbook",
        ],
      },
      {
        id: "tier3",
        name: "Gourmet Experience",
        price: 300,
        currency: "IDRX",
        description: "Premium festival experience for culinary enthusiasts",
        available: 200,
        maxPerPurchase: 2,
        benefits: [
          "15 premium food sampling tokens",
          "Access to exclusive chef demonstrations",
          "Guided culinary tour with food expert",
          "Cooking workshop participation",
          "Festival merchandise pack",
          "Priority seating at demonstrations",
        ],
      },
    ],
    tags: ["food", "culinary", "festival", "cultural", "cuisine"],
  },
  {
    id: "8",
    title: "Southeast Asian Film Festival 2025",
    description:
      "Celebrating the best in regional cinema with screenings, discussions, and workshops.",
    longDescription: `The Southeast Asian Film Festival 2025 presents a curated selection of feature films, documentaries, and short films that showcase the diverse storytelling traditions and emerging voices of the region.

For one week, cinema lovers can experience groundbreaking works from Indonesia, Malaysia, Singapore, Thailand, Vietnam, the Philippines, and other Southeast Asian countries. The festival provides a platform for filmmakers to share their visions and for audiences to discover new perspectives on life in the region.

Festival highlights:
- Opening and closing night galas with red carpet events
- Competition sections for feature films, documentaries, and shorts
- Special retrospective on influential Southeast Asian directors
- Panel discussions with filmmakers and industry experts
- Filmmaking workshops for aspiring creators
- Networking events connecting local and international film professionals
- Youth film program targeting young audiences

Each screening includes Q&A sessions with filmmakers when possible, providing deeper insights into the creative process and the stories behind the films. The festival aims to build bridges between cultures and support the continued growth of Southeast Asian cinema on the world stage.`,
    date: "2025-10-05T18:00:00",
    time: "Various times",
    endTime: "Late evening",
    location: "CGV Cinemas Grand Indonesia",
    venue: "CGV Cinemas",
    address:
      "Grand Indonesia Shopping Mall, Jl. M.H. Thamrin No.1, Jakarta 10310, Indonesia",
    imageUrl:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    bannerUrl:
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    price: 150,
    currency: "IDRX",
    category: "Movies",
    status: "available",
    organizer: {
      id: "org8",
      name: "Southeast Asian Cinema Collective",
      verified: true,
      description:
        "Promoting and preserving film culture across Southeast Asia through festivals, education, and archival work.",
      website: "https://example.com",
      eventsHosted: 9,
    },
    ticketsAvailable: 1200,
    ticketTiers: [
      {
        id: "tier1",
        name: "Single Screening",
        price: 75,
        currency: "IDRX",
        description: "Admission to one film screening of your choice",
        available: 600,
        maxPerPurchase: 5,
      },
      {
        id: "tier2",
        name: "5-Film Pass",
        price: 325,
        currency: "IDRX",
        description:
          "Admission to any 5 regular screenings during the festival",
        available: 300,
        maxPerPurchase: 2,
        benefits: [
          "Access to 5 film screenings",
          "15% discount on festival merchandise",
          "Digital festival program",
        ],
      },
      {
        id: "tier3",
        name: "Festival Pass",
        price: 600,
        currency: "IDRX",
        description: "Full festival access including special events",
        available: 100,
        maxPerPurchase: 2,
        benefits: [
          "Access to all regular screenings",
          "Admission to opening and closing night galas",
          "Invitations to filmmaker receptions",
          "Festival tote bag and merchandise pack",
          "Priority seating at high-demand screenings",
          "Access to industry networking events",
        ],
      },
      {
        id: "tier4",
        name: "Special Screening: Opening Night",
        price: 150,
        currency: "IDRX",
        description:
          "Attendance at the prestigious opening night film and reception",
        available: 200,
        maxPerPurchase: 2,
        benefits: [
          "Red carpet experience",
          "After-screening reception with filmmakers",
          "Complimentary drinks and canapés",
          "Festival program and commemorative ticket",
        ],
      },
    ],
    tags: ["movies", "film", "festival", "cinema", "arts", "cultural"],
  },
  {
    id: "9",
    title: "Jakarta International Theater Festival",
    description:
      "A celebration of theatrical arts featuring performances from around the world.",
    longDescription: `The Jakarta International Theater Festival brings world-class performances to Indonesian audiences and showcases local theatrical talent on an international stage. For two weeks, the city becomes a vibrant hub of dramatic arts, dance, puppetry, and experimental theater.

This year's festival features productions from 15 countries alongside the best of Indonesian theater. From classical plays to cutting-edge contemporary works, the festival offers a diverse program that reflects the power of theater to transcend cultural and linguistic boundaries.

Festival highlights:
- Main stage productions at prestigious venues across Jakarta
- Street theater performances in public spaces
- Traditional and contemporary puppetry showcases
- Physical theater and dance productions
- Late-night experimental works
- Theater workshops for all ages and experience levels
- Director and playwright talks and roundtables

The festival creates a unique space for cultural exchange, artistic collaboration, and shared experiences that connect performers and audiences from different backgrounds. Each performance is presented in its original language with Indonesian and English subtitles when needed, making the works accessible to diverse audiences.`,
    date: "2025-09-12T19:30:00",
    time: "Various times",
    endTime: "Late evening",
    location: "Teater Jakarta",
    venue: "Teater Jakarta and various venues",
    address:
      "Taman Ismail Marzuki, Jl. Cikini Raya No.73, Jakarta 10330, Indonesia",
    imageUrl:
      "https://images.unsplash.com/photo-1503095396549-807759245b35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
    bannerUrl:
      "https://images.unsplash.com/photo-1503095396549-807759245b35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
    price: 180,
    currency: "IDRX",
    category: "Theater",
    status: "available",
    organizer: {
      id: "org9",
      name: "Jakarta Performing Arts Council",
      verified: true,
      description:
        "Promoting theatrical excellence and cross-cultural artistic exchange in Indonesia.",
      website: "https://example.com",
      eventsHosted: 17,
    },
    ticketsAvailable: 1500,
    ticketTiers: [
      {
        id: "tier1",
        name: "Single Performance",
        price: 180,
        currency: "IDRX",
        description: "Admission to one performance of your choice",
        available: 800,
        maxPerPurchase: 4,
      },
      {
        id: "tier2",
        name: "Weekend Pass",
        price: 450,
        currency: "IDRX",
        description: "Access to all performances during one weekend",
        available: 300,
        maxPerPurchase: 2,
        benefits: [
          "Admission to all shows on Friday, Saturday, and Sunday",
          "Festival program and guide",
          "Discounted festival merchandise",
        ],
      },
      {
        id: "tier3",
        name: "Festival Pass",
        price: 800,
        currency: "IDRX",
        description: "Full access to all festival performances and events",
        available: 150,
        maxPerPurchase: 2,
        benefits: [
          "Access to all festival performances",
          "Admission to exclusive workshop sessions",
          "Invitation to opening and closing ceremonies",
          "Meet and greet opportunities with select performers",
          "Festival merchandise package",
          "Printed program with director notes",
        ],
      },
      {
        id: "tier4",
        name: "Premium International Showcase",
        price: 250,
        currency: "IDRX",
        description:
          "Reserved seating for the acclaimed international showcase performance",
        available: 200,
        maxPerPurchase: 2,
        benefits: [
          "Premium seating location",
          "Pre-show reception with drinks and canapés",
          "Program signed by the director and lead performers",
        ],
      },
    ],
    tags: [
      "theater",
      "performing arts",
      "cultural",
      "international",
      "festival",
    ],
  },
];
