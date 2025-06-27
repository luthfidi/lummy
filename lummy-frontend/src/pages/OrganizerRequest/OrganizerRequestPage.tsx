import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Checkbox,
  SimpleGrid,
  useToast,
  Flex,
  Divider,
  Alert,
  AlertIcon,
  Progress,
  Badge,
  Icon,
  HStack,
  Circle,
} from "@chakra-ui/react";
import { CheckIcon, InfoIcon, TimeIcon, EmailIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

interface OrganizerRequestData {
  // Informasi Dasar
  fullName: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  
  // Informasi Bisnis
  organizerType: string;
  eventCategories: string[];
  experience: string;
  estimatedEventsPerYear: string;
  
  // Portfolio
  description: string;
  previousEvents: string;
  references: string;
  
  // Informasi Keuangan
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  estimatedBudget: string;
  
  // Persetujuan
  agreeTerms: boolean;
  agreePrivacy: boolean;
  agreeFee: boolean;
}

interface ApplicationStatus {
  status: "under_review" | "need_more_info" | "approved" | "rejected";
  submittedAt: string;
  lastUpdate: string;
  message?: string;
}

const OrganizerRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  const [formData, setFormData] = useState<OrganizerRequestData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    organizerType: "",
    eventCategories: [],
    experience: "",
    estimatedEventsPerYear: "",
    description: "",
    previousEvents: "",
    references: "",
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    estimatedBudget: "",
    agreeTerms: false,
    agreePrivacy: false,
    agreeFee: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus | null>(null);
  const totalSteps = 4;

  // Check if user has already submitted an application (simulate with localStorage)
  useEffect(() => {
    const savedStatus = localStorage.getItem('organizerApplicationStatus');
    if (savedStatus) {
      setApplicationStatus(JSON.parse(savedStatus));
    }
  }, []);

  const handleInputChange = (field: keyof OrganizerRequestData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      eventCategories: checked 
        ? [...prev.eventCategories, category]
        : prev.eventCategories.filter(c => c !== category)
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.fullName && formData.email && formData.phone && formData.address);
      case 2:
        return !!(formData.organizerType && formData.eventCategories.length > 0 && formData.experience);
      case 3:
        return !!(formData.description && formData.estimatedBudget);
      case 4:
        return !!(formData.bankName && formData.accountNumber && formData.accountHolder);
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!formData.agreeTerms || !formData.agreePrivacy || !formData.agreeFee) {
      toast({
        title: "Agreements Required",
        description: "Please agree to all terms and conditions",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      
      const newStatus: ApplicationStatus = {
        status: "under_review",
        submittedAt: new Date().toISOString(),
        lastUpdate: new Date().toISOString(),
        message: "Your application has been submitted successfully and is currently under review by our team."
      };

      setApplicationStatus(newStatus);
      localStorage.setItem('organizerApplicationStatus', JSON.stringify(newStatus));

      toast({
        title: "Application Submitted!",
        description: "Your organizer request has been submitted for review.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }, 2000);
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "under_review":
        return {
          color: "orange",
          label: "Under Review",
          description: "Your application is being reviewed by our team. We'll contact you within 3-5 business days.",
          icon: TimeIcon,
        };
      case "need_more_info":
        return {
          color: "yellow",
          label: "Additional Information Required",
          description: "We need some additional information to process your application. Please check your email.",
          icon: InfoIcon,
        };
      case "approved":
        return {
          color: "green",
          label: "Application Approved",
          description: "Congratulations! Your organizer application has been approved. You can now create events.",
          icon: CheckIcon,
        };
      case "rejected":
        return {
          color: "red",
          label: "Application Rejected",
          description: "Unfortunately, your application was not approved. Please contact support for more details.",
          icon: InfoIcon,
        };
      default:
        return {
          color: "gray",
          label: "Unknown Status",
          description: "",
          icon: InfoIcon,
        };
    }
  };

  const categoryOptions = [
    "Music", "Technology", "Sports", "Art", "Education", 
    "Food", "Movies", "Theater", "Workshop", "Conference"
  ];

  const organizerTypes = [
    "Individual", "PT", "CV", "Yayasan", "Komunitas", "Startup", "NGO"
  ];

  // If application has been submitted, show status page
  if (applicationStatus) {
    const statusInfo = getStatusInfo(applicationStatus.status);

    return (
      <Container maxW="container.md" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign="center">
            <Heading size="lg" mb={2}>Application Status</Heading>
            <Text color="gray.600">
              Track your organizer application progress
            </Text>
          </Box>

          {/* Status Card */}
          <Box bg="white" p={8} borderRadius="lg" borderWidth="1px" borderColor="gray.200" textAlign="center">
            <VStack spacing={6}>
              <Circle size="80px" bg={`${statusInfo.color}.100`} color={`${statusInfo.color}.500`}>
                <Icon as={statusInfo.icon} boxSize={8} />
              </Circle>

              <VStack spacing={2}>
                <Badge colorScheme={statusInfo.color} fontSize="lg" px={4} py={2} borderRadius="full">
                  {statusInfo.label}
                </Badge>
                <Text fontSize="lg" color="gray.700" maxW="md">
                  {statusInfo.description}
                </Text>
              </VStack>

              {applicationStatus.message && (
                <Alert status="info" borderRadius="md" maxW="md">
                  <AlertIcon />
                  <Text fontSize="sm" textAlign="left">
                    {applicationStatus.message}
                  </Text>
                </Alert>
              )}

              <Divider />

              <VStack spacing={2} fontSize="sm" color="gray.600">
                <HStack>
                  <Text fontWeight="medium">Submitted:</Text>
                  <Text>{new Date(applicationStatus.submittedAt).toLocaleDateString()}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="medium">Last Updated:</Text>
                  <Text>{new Date(applicationStatus.lastUpdate).toLocaleDateString()}</Text>
                </HStack>
              </VStack>

              <HStack spacing={4} mt={6}>
                {applicationStatus.status === "approved" && (
                  <Button colorScheme="green" onClick={() => navigate("/organizer")}>
                    Go to Dashboard
                  </Button>
                )}
                <Button variant="outline" onClick={handleBackToHome}>
                  Back to Home
                </Button>
                {applicationStatus.status === "need_more_info" && (
                  <Button 
                    leftIcon={<EmailIcon />} 
                    colorScheme="blue" 
                    onClick={() => window.open(`mailto:${formData.email}`, '_blank')}
                  >
                    Check Email
                  </Button>
                )}
              </HStack>
            </VStack>
          </Box>

          {/* Timeline */}
          <Box bg="white" p={6} borderRadius="lg" borderWidth="1px" borderColor="gray.200">
            <Heading size="md" mb={4}>Application Timeline</Heading>
            <VStack spacing={4} align="stretch">
              <HStack>
                <Circle size="12px" bg="green.500" />
                <VStack align="start" spacing={0} flex="1">
                  <Text fontWeight="medium">Application Submitted</Text>
                  <Text fontSize="sm" color="gray.600">
                    {new Date(applicationStatus.submittedAt).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </VStack>
              </HStack>

              <HStack>
                <Circle size="12px" bg={applicationStatus.status === "under_review" ? "orange.500" : "green.500"} />
                <VStack align="start" spacing={0} flex="1">
                  <Text fontWeight="medium">Under Review</Text>
                  <Text fontSize="sm" color="gray.600">
                    {applicationStatus.status === "under_review" 
                      ? "Currently being reviewed by our team"
                      : "Review completed"
                    }
                  </Text>
                </VStack>
              </HStack>

              {applicationStatus.status !== "under_review" && (
                <HStack>
                  <Circle size="12px" bg={
                    applicationStatus.status === "approved" ? "green.500" : 
                    applicationStatus.status === "rejected" ? "red.500" : "yellow.500"
                  } />
                  <VStack align="start" spacing={0} flex="1">
                    <Text fontWeight="medium">
                      {applicationStatus.status === "approved" ? "Application Approved" :
                       applicationStatus.status === "rejected" ? "Application Rejected" : 
                       "Additional Information Required"}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {new Date(applicationStatus.lastUpdate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </VStack>
                </HStack>
              )}
            </VStack>
          </Box>

          {/* Contact Information */}
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <Box>
              <Text fontWeight="medium">Need Help?</Text>
              <Text fontSize="sm">
                If you have any questions about your application, please contact our support team at support@lummy.com
              </Text>
            </Box>
          </Alert>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Heading size="lg" mb={2}>Become an Event Organizer</Heading>
          <Text color="gray.600">
            Join Lummy's network of verified event organizers and start creating amazing experiences
          </Text>
        </Box>

        {/* Progress Bar */}
        <Box>
          <Flex justify="space-between" mb={2}>
            <Text fontSize="sm" fontWeight="medium">Step {currentStep} of {totalSteps}</Text>
            <Text fontSize="sm" color="gray.500">{Math.round((currentStep / totalSteps) * 100)}% Complete</Text>
          </Flex>
          <Progress 
            value={(currentStep / totalSteps) * 100} 
            colorScheme="purple" 
            borderRadius="full"
            size="sm"
          />
        </Box>

        {/* Step Content */}
        <Box bg="white" p={6} borderRadius="lg" borderWidth="1px" borderColor="gray.200">
          {currentStep === 1 && (
            <VStack spacing={4} align="stretch">
              <Heading size="md" mb={2}>Basic Information</Heading>
              
              <FormControl isRequired>
                <FormLabel>Full Name / Company Name</FormLabel>
                <Input
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder="Enter your full name or company name"
                />
              </FormControl>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Email Address</FormLabel>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your@email.com"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+62 812 3456 7890"
                  />
                </FormControl>
              </SimpleGrid>

              <FormControl isRequired>
                <FormLabel>Address</FormLabel>
                <Textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Complete address including city and postal code"
                  rows={3}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Website / Social Media</FormLabel>
                <Input
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="https://yourwebsite.com or @yoursocial"
                />
              </FormControl>
            </VStack>
          )}

          {currentStep === 2 && (
            <VStack spacing={4} align="stretch">
              <Heading size="md" mb={2}>Business Information</Heading>
              
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Organizer Type</FormLabel>
                  <Select
                    value={formData.organizerType}
                    onChange={(e) => handleInputChange("organizerType", e.target.value)}
                    placeholder="Select type"
                  >
                    {organizerTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Experience in Event Management</FormLabel>
                  <Select
                    value={formData.experience}
                    onChange={(e) => handleInputChange("experience", e.target.value)}
                    placeholder="Select experience"
                  >
                    <option value="< 1 year">Less than 1 year</option>
                    <option value="1-3 years">1-3 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5+ years">More than 5 years</option>
                  </Select>
                </FormControl>
              </SimpleGrid>

              <FormControl isRequired>
                <FormLabel>Event Categories (select all that apply)</FormLabel>
                <SimpleGrid columns={{ base: 2, md: 3 }} spacing={2} mt={2}>
                  {categoryOptions.map(category => (
                    <Checkbox
                      key={category}
                      isChecked={formData.eventCategories.includes(category)}
                      onChange={(e) => handleCategoryChange(category, e.target.checked)}
                    >
                      {category}
                    </Checkbox>
                  ))}
                </SimpleGrid>
              </FormControl>

              <FormControl>
                <FormLabel>Estimated Events per Year</FormLabel>
                <Select
                  value={formData.estimatedEventsPerYear}
                  onChange={(e) => handleInputChange("estimatedEventsPerYear", e.target.value)}
                  placeholder="Select range"
                >
                  <option value="1-5">1-5 events</option>
                  <option value="6-12">6-12 events</option>
                  <option value="13-24">13-24 events</option>
                  <option value="25+">25+ events</option>
                </Select>
              </FormControl>
            </VStack>
          )}

          {currentStep === 3 && (
            <VStack spacing={4} align="stretch">
              <Heading size="md" mb={2}>Portfolio & Experience</Heading>
              
              <FormControl isRequired>
                <FormLabel>About You/Your Organization</FormLabel>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Tell us about your background, mission, and what makes you unique as an event organizer"
                  rows={4}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Previous Events & Portfolio</FormLabel>
                <Textarea
                  value={formData.previousEvents}
                  onChange={(e) => handleInputChange("previousEvents", e.target.value)}
                  placeholder="Describe some of your previous events, achievements, or relevant experience"
                  rows={3}
                />
              </FormControl>

              <FormControl>
                <FormLabel>References</FormLabel>
                <Textarea
                  value={formData.references}
                  onChange={(e) => handleInputChange("references", e.target.value)}
                  placeholder="Contact information of previous clients or partners (optional)"
                  rows={2}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Typical Event Budget Range</FormLabel>
                <Select
                  value={formData.estimatedBudget}
                  onChange={(e) => handleInputChange("estimatedBudget", e.target.value)}
                  placeholder="Select budget range"
                >
                  <option value="< 10M">Less than 10 Million IDR</option>
                  <option value="10M - 50M">10 - 50 Million IDR</option>
                  <option value="50M - 100M">50 - 100 Million IDR</option>
                  <option value="100M - 500M">100 - 500 Million IDR</option>
                  <option value="500M+">More than 500 Million IDR</option>
                </Select>
              </FormControl>
            </VStack>
          )}

          {currentStep === 4 && (
            <VStack spacing={4} align="stretch">
              <Heading size="md" mb={2}>Financial Information & Agreement</Heading>
              
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <Text fontSize="sm">
                  This information is required for payment processing and will be kept secure.
                </Text>
              </Alert>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Bank Name</FormLabel>
                  <Input
                    value={formData.bankName}
                    onChange={(e) => handleInputChange("bankName", e.target.value)}
                    placeholder="e.g., Bank BCA, Bank Mandiri"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Account Number</FormLabel>
                  <Input
                    value={formData.accountNumber}
                    onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                    placeholder="Your bank account number"
                  />
                </FormControl>
              </SimpleGrid>

              <FormControl isRequired>
                <FormLabel>Account Holder Name</FormLabel>
                <Input
                  value={formData.accountHolder}
                  onChange={(e) => handleInputChange("accountHolder", e.target.value)}
                  placeholder="Name as registered in bank account"
                />
              </FormControl>

              <Divider />

              <VStack spacing={3} align="stretch">
                <Heading size="sm">Terms & Agreements</Heading>
                
                <Checkbox
                  isChecked={formData.agreeTerms}
                  onChange={(e) => handleInputChange("agreeTerms", e.target.checked)}
                >
                  I agree to the <Text as="span" color="purple.500" textDecoration="underline">Terms and Conditions</Text>
                </Checkbox>

                <Checkbox
                  isChecked={formData.agreePrivacy}
                  onChange={(e) => handleInputChange("agreePrivacy", e.target.checked)}
                >
                  I agree to the <Text as="span" color="purple.500" textDecoration="underline">Privacy Policy</Text>
                </Checkbox>

                <Checkbox
                  isChecked={formData.agreeFee}
                  onChange={(e) => handleInputChange("agreeFee", e.target.checked)}
                >
                  I understand and agree to the platform fee of 2.5% per ticket transaction
                </Checkbox>
              </VStack>
            </VStack>
          )}
        </Box>

        {/* Navigation Buttons */}
        <Flex justify="space-between">
          <Button
            variant="outline"
            onClick={handlePrevStep}
            isDisabled={currentStep === 1}
            colorScheme="purple"
          >
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button
              colorScheme="purple"
              onClick={handleNextStep}
              rightIcon={<CheckIcon />}
            >
              Next Step
            </Button>
          ) : (
            <Button
              colorScheme="green"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              loadingText="Submitting..."
              leftIcon={<CheckIcon />}
            >
              Submit Application
            </Button>
          )}
        </Flex>

        {/* Info Box */}
        <Alert status="info" borderRadius="md">
          <AlertIcon as={InfoIcon} />
          <Box>
            <Text fontWeight="medium">Review Process</Text>
            <Text fontSize="sm">
              Your application will be reviewed within 3-5 business days. 
              We may contact you for additional information if needed.
            </Text>
          </Box>
        </Alert>
      </VStack>
    </Container>
  );
};

export default OrganizerRequestPage;