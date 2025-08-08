import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Hotel,
  Star,
  Calendar,
  Users,
  MapPin,
  Phone,
  Mail,
  Clock,
  Award,
  Heart,
  Shield,
  Leaf,
  Target,
  Quote,
  CheckCircle,
  HelpCircle,
  Wifi,
  Car,
  Utensils,
  Dumbbell,
  Camera,
  Play,
} from "lucide-react";

// About Us Page
export function AboutPage() {
  const milestones = [
    { year: "1985", title: "Founded", description: "Armaflex Hotel opened its doors" },
    { year: "1995", title: "Expansion", description: "Added luxury suites and spa facilities" },
    { year: "2005", title: "Recognition", description: "Awarded 5-star luxury hotel status" },
    { year: "2015", title: "Renovation", description: "Complete modernization and eco-friendly upgrade" },
    { year: "2024", title: "Digital Innovation", description: "Launched advanced management system" },
  ];

  const team = [
    {
      name: "James Wellington",
      role: "General Manager",
      experience: "15+ years in luxury hospitality",
      description: "Leading the hotel with passion for exceptional guest experiences",
    },
    {
      name: "Maria Rodriguez",
      role: "Guest Relations Director",
      experience: "12+ years in customer service",
      description: "Ensuring every guest feels welcomed and valued",
    },
    {
      name: "Chef Alexandre Dubois",
      role: "Executive Chef",
      experience: "20+ years in fine dining",
      description: "Creating culinary masterpieces with local and international flavors",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-luxury-900 to-luxury-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-hotel-500/20 text-hotel-300 border-hotel-500/30">
              ✨ Our Story
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Armaflex Hotel</h1>
            <p className="text-xl text-gray-200 leading-relaxed">
              For nearly four decades, we've been crafting unforgettable experiences and 
              setting the standard for luxury hospitality in the heart of the city.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission & Values</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 rounded-full bg-hotel-100 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-hotel-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Exceptional Service</h3>
                    <p className="text-muted-foreground">
                      We believe every guest deserves personalized attention and care that exceeds expectations.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 rounded-full bg-hotel-100 flex items-center justify-center">
                    <Leaf className="h-6 w-6 text-hotel-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Sustainability</h3>
                    <p className="text-muted-foreground">
                      Committed to environmental responsibility and sustainable practices in all operations.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 rounded-full bg-hotel-100 flex items-center justify-center">
                    <Target className="h-6 w-6 text-hotel-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Excellence</h3>
                    <p className="text-muted-foreground">
                      Continuous pursuit of perfection in every detail, from amenities to guest experiences.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-8">
              <Quote className="h-12 w-12 text-hotel-500 mb-4" />
              <blockquote className="text-lg italic mb-4">
                "Our goal is not just to provide accommodation, but to create a home away from home 
                where luxury meets comfort and every moment becomes a cherished memory."
              </blockquote>
              <cite className="text-sm font-medium">— James Wellington, General Manager</cite>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
            <p className="text-lg text-muted-foreground">Key milestones in our history</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-center space-x-6">
                  <div className="text-right min-w-[80px]">
                    <span className="text-2xl font-bold text-hotel-600">{milestone.year}</span>
                  </div>
                  <div className="h-4 w-4 rounded-full bg-hotel-500 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{milestone.title}</h3>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground">
              Dedicated professionals committed to your exceptional experience
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <Avatar className="h-20 w-20 mx-auto mb-4">
                    <AvatarFallback className="text-lg">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                  <p className="text-hotel-600 font-medium mb-2">{member.role}</p>
                  <Badge variant="secondary" className="mb-3">{member.experience}</Badge>
                  <p className="text-sm text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Contact Page
export function ContactPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-luxury-900 to-luxury-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-gray-200 leading-relaxed">
              Get in touch with our team. We're here to help make your stay exceptional.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Enter your first name" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Enter your last name" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="Enter your phone number" />
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="Enter message subject" />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Enter your message" rows={5} />
                </div>
                <Button className="w-full bg-hotel-500 hover:bg-hotel-600">
                  Send Message
                </Button>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    Reach out to us through any of these channels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-hotel-500 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Address</h4>
                      <p className="text-muted-foreground">
                        123 Luxury Avenue<br />
                        Premium District, City 12345<br />
                        United States
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-hotel-500 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Phone</h4>
                      <p className="text-muted-foreground">+1 (555) 123-HOTEL</p>
                      <p className="text-sm text-muted-foreground">Available 24/7</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-hotel-500 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Email</h4>
                      <p className="text-muted-foreground">info@armaflexhotel.com</p>
                      <p className="text-sm text-muted-foreground">Response within 2 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Clock className="h-6 w-6 text-hotel-500 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Reception Hours</h4>
                      <p className="text-muted-foreground">24/7 Front Desk Service</p>
                      <p className="text-sm text-muted-foreground">Always available for guests</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Booking</CardTitle>
                  <CardDescription>
                    Ready to book? Contact us directly for special rates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-hotel-500 hover:bg-hotel-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Your Stay Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// FAQ Page
export function FAQPage() {
  const faqs = [
    {
      question: "What are your check-in and check-out times?",
      answer: "Check-in is at 3:00 PM and check-out is at 11:00 AM. Early check-in and late check-out may be available upon request and subject to availability."
    },
    {
      question: "Do you offer airport transfers?",
      answer: "Yes, we provide complimentary airport transfer service for our guests. Please contact the concierge at least 24 hours in advance to arrange pickup."
    },
    {
      question: "Is parking available?",
      answer: "We offer complimentary valet parking for all guests. Self-parking is also available if preferred."
    },
    {
      question: "Do you have WiFi throughout the hotel?",
      answer: "Yes, high-speed WiFi is complimentary throughout the entire property, including all guest rooms and public areas."
    },
    {
      question: "Are pets allowed?",
      answer: "We welcome pets under 25 pounds with a $50 per night pet fee. Please inform us at the time of booking if you'll be traveling with a pet."
    },
    {
      question: "What dining options are available?",
      answer: "We have an award-winning restaurant serving breakfast, lunch, and dinner, plus 24/7 room service. We also have a bar and lounge area."
    },
    {
      question: "Do you have fitness facilities?",
      answer: "Yes, our fitness center is open 24/7 and includes state-of-the-art equipment. We also offer spa services by appointment."
    },
    {
      question: "What is your cancellation policy?",
      answer: "Cancellations can be made up to 24 hours before arrival without penalty. Cancellations within 24 hours will be charged one night's stay."
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-luxury-900 to-luxury-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <HelpCircle className="h-16 w-16 mx-auto mb-4 text-hotel-400" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
            <p className="text-xl text-gray-200 leading-relaxed">
              Find answers to common questions about our hotel and services.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-2">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <Card className="mt-12">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold mb-4">Still have questions?</h3>
                <p className="text-muted-foreground mb-6">
                  Can't find what you're looking for? Our concierge team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-hotel-500 hover:bg-hotel-600">
                    <Phone className="h-4 w-4 mr-2" />
                    Call +1 (555) 123-HOTEL
                  </Button>
                  <Button variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

// Gallery Page (Placeholder)
export function GalleryPage() {
  const galleryCategories = [
    { name: "Rooms & Suites", count: 24, icon: Users },
    { name: "Dining & Bar", count: 16, icon: Utensils },
    { name: "Facilities", count: 18, icon: Dumbbell },
    { name: "Events", count: 12, icon: Calendar },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-luxury-900 to-luxury-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Camera className="h-16 w-16 mx-auto mb-4 text-hotel-400" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Photo Gallery</h1>
            <p className="text-xl text-gray-200 leading-relaxed">
              Explore our beautiful hotel through stunning photography and virtual tours.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Categories */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {galleryCategories.map((category, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-8">
                  <div className="h-16 w-16 rounded-full bg-hotel-100 flex items-center justify-center mx-auto mb-4">
                    <category.icon className="h-8 w-8 text-hotel-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                  <p className="text-muted-foreground">{category.count} photos</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8">
                <Play className="h-12 w-12 mx-auto mb-4 text-hotel-500" />
                <h3 className="text-lg font-semibold mb-2">Virtual Tour</h3>
                <p className="text-muted-foreground mb-4">
                  Take a 360° virtual tour of our hotel
                </p>
                <Button className="bg-hotel-500 hover:bg-hotel-600">
                  Start Virtual Tour
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
