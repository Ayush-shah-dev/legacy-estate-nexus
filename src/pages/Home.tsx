import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Building2, Users, Award, Star, ArrowRight, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/mumbai-skyline.jpg";
import cinematicImage from "@/assets/mumbai-skyline-cinematic.jpg";
import "./Home.css";
import videoBackground from "../assets/BG_MAIN.mp4";

interface Testimonial {
  id: string;
  name: string;
  designation: string | null;
  quote: string;
  profile_image: string | null;
}

interface Property {
  id: string;
  title: string;
  description: string;
  price: string;
  location: string;
  property_type: string;
  bedrooms: string;
  bathrooms: string;
  area_sqft: number;
  status: string;
  featured: boolean;
  image_url: string;
  created_at: string;
}

export default function Home() {
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-slide-up");
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetchTestimonials();
    fetchFeaturedProperties();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };

  const fetchFeaturedProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('featured', true)
        .eq('status', 'available')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setFeaturedProperties(data || []);
    } catch (error) {
      console.error('Error fetching featured properties:', error);
    }
  };

  const highlights = [
    {
      icon: Award,
      title: "37+ Years Legacy",
      description:
        "37+ years of excellence in real estate development and investment guidance with 3rd generation realtors.",
    },
    {
      icon: Building2,
      title: "Developer Connect",
      description:
        "Direct partnerships with premium developers for exclusive pre-launch opportunities.",
    },
    {
      icon: Users,
      title: "Trust",
      description:
        "5000+ satisfied clients and a track record of transparent dealings.",
    },
    {
      icon: Star,
      title: "Premium Inventory",
      description:
        "Curated collection of luxury properties in prime locations.",
    },
  ];

  const stats = [
    { number: "37+", label: "Years Experience" },
    { number: "5000+", label: "Happy Clients" },
    { number: "₹500Cr+", label: "Worth Delivered" },
    { number: "3rd Gen", label: "Realtors" },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getDefaultAmenities = (propertyType: string) => {
    if (propertyType === 'commercial') {
      return ["24x7 Security", "High-Speed Elevators", "Power Backup", "Parking", "Food Court"];
    }
    return ["Swimming Pool", "Gym", "Children's Play Area", "Landscaped Gardens", "Club House"];
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative md:h-screen sm:h-800px flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          controls={false}
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{
            clipPath: "inset(0 0 15% 0)",
            transform: "scale(1.25)",
            transformOrigin: "center top",
            position: "absolute",
            top: "-10%",
            left: "0",
            width: "100%",
            height: "120%",
            pointerEvents: "none",
          }}
          onLoadedData={() => console.log("Video loaded")}
          onError={(e) => console.error("Video error:", e)}
        >
          <source src={videoBackground} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="text-center">
            <img
              src="/lovable-uploads/e3e8d4b3-aff7-449c-8663-a9e656c4ed74.png"
              alt="Regal Estate Consultants"
              className="h-[250px] w-auto mx-auto animate-fade-in drop-shadow-2xl"
              style={{
                filter: 'drop-shadow(0 0 25px rgba(255, 255, 255, 1)) drop-shadow(0 0 50px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 75px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 100px rgba(255, 255, 255, 0.4))'
              }}
            />
            <p className="text-sm text-white/80  animate-fade-in font-bold">Since 1987</p>
            <h1 className="animate-fade-in">
              Mumbai Real Estate,
              <span>The Regal Way</span>
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in mt-8">
              <Link to="/properties">
                <Button
                  size="lg"
                  className="bg-brand-classic-gold text-primary hover:bg-brand-soft-gold transition-all duration-300"
                >
                  Explore Our Properties
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-primary hover:bg-brand-classic-gold hover:text-white"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Inquiry Form
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section
        className="py-20 bg-background"
        ref={(el) => el && (sectionsRef.current[1] = el)}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="text-center mb-16 opacity-0 animate-zoom-in"
            style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Why Choose Regal Estate Consultants
            </h2>
            <p className="text-xl text-brand-grey max-w-3xl mx-auto">
              Building trust through excellence, connecting you with premium
              properties and investment opportunities.
            </p>
          </div>

          {/* Trusted by Section */}
          <div
            className="text-center mb-12 opacity-0 animate-slide-in-right"
            style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
          >
            <h3 className="text-2xl font-semibold text-primary mb-8">
              Trusted by India's Leading Developers
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
              <div className="group cursor-pointer">
                <img
                  src="/lovable-uploads/3068d3a3-f113-4a53-81e7-7e7be23345e3.png"
                  alt="Adani Realty"
                  className="h-16 w-auto transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg opacity-100 hover:brightness-110 hover:shadow-gold"
                />
              </div>
              <div className="group cursor-pointer">
                <img
                  src="/lovable-uploads/b00d9894-3524-4d9b-8f50-33f2f333dcb5.png"
                  alt="Godrej Properties"
                  className="h-16 w-auto transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg opacity-100 hover:brightness-110 hover:shadow-gold"
                />
              </div>
              <div className="group cursor-pointer">
                <img
                  src="/lovable-uploads/ad219bbd-a8e8-4e82-889c-30db765fb5ab.png"
                  alt="Raymond Realty"
                  className="h-16 w-auto transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg opacity-100 hover:brightness-110 hover:shadow-gold"
                />
              </div>
              <div className="group cursor-pointer">
                <img
                  src="/lovable-uploads/e21683e6-14b6-4729-828e-36c7d5923146.png"
                  alt="Lodha"
                  className="h-16 w-auto transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg opacity-100 hover:brightness-110 hover:shadow-gold"
                />
              </div>
              <div className="group cursor-pointer">
                <img
                  src="/lovable-uploads/0fe0702e-fe06-4a24-bb96-5325dbd4863c.png"
                  alt="DLF"
                  className="h-16 w-auto transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg opacity-100 hover:brightness-110 hover:shadow-gold"
                />
              </div>
              <div className="group cursor-pointer">
                <img
                  src="/lovable-uploads/b9583c92-6074-4562-8a9f-a0a811a39d7e.png"
                  alt="LT Realty"
                  className="h-16 w-auto transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg opacity-100 hover:brightness-110 hover:shadow-gold"
                />
              </div>
            </div>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 opacity-0 animate-slide-in-left"
            style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
          >
            {highlights.map((highlight, index) => (
              <Card
                key={index}
                className="text-center p-6 hover:shadow-gold transition-all duration-300 border-brand-soft-gold/20"
              >
                <CardContent className="p-0">
                  <div className="mb-4">
                    <highlight.icon className="h-12 w-12 text-brand-classic-gold mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-3">
                    {highlight.title}
                  </h3>
                  <p className="text-brand-grey">{highlight.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties - Now Dynamic */}
      <section
        className="py-20 bg-secondary/30"
        ref={(el) => el && (sectionsRef.current[2] = el)}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="text-center mb-16 opacity-0 animate-slide-in-right"
            style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Featured Properties
            </h2>
            <p className="text-xl text-brand-grey">
              Discover our handpicked selection of premium properties
            </p>
          </div>

          {featuredProperties.length > 0 ? (
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 opacity-0 animate-zoom-in"
              style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
            >
              {featuredProperties.map((property) => (
                <Card
                  key={property.id}
                  className="overflow-hidden hover:shadow-luxury transition-all duration-300"
                >
                  <div className="relative">
                    <img
                      src={property.image_url || "/placeholder.svg"}
                      alt={property.title}
                      className="w-full h-64 object-cover"
                    />
                    <Badge className="absolute top-4 right-4 bg-brand-maroon text-white">
                      {property.property_type}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-primary mb-2">
                      {property.title}
                    </h3>
                    <p className="text-brand-grey mb-2">{property.location}</p>
                    <p className="text-sm text-brand-grey mb-3">
                      {property.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-primary">
                          Price:
                        </span>
                        <span className="text-sm font-semibold text-brand-classic-gold">
                          Enquire now for price
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-primary">
                          Area:
                        </span>
                        <span className="text-sm text-brand-grey">
                          {property.area_sqft} sq ft
                        </span>
                      </div>
                      {(property.bedrooms && property.bedrooms.trim() !== "") || (property.bathrooms && property.bathrooms.trim() !== "") ? (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-primary">
                            Details:
                          </span>
                          <span className="text-sm text-brand-grey">
                            {[property.bedrooms, property.bathrooms].filter(Boolean).join(" • ")}
                          </span>
                        </div>
                      ) : null}
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-primary mb-1">
                          Amenities:
                        </span>
                        <ScrollArea className="h-16 w-full">
                          <div className="flex flex-wrap gap-1 pr-4">
                            {getDefaultAmenities(property.property_type)
                              .map((amenity, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs border-brand-classic-gold/50 text-brand-classic-gold"
                                >
                                  {amenity}
                                </Badge>
                              ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-primary hover:bg-brand-navy"
                      onClick={() => {
                        const message = `Hi, I have an enquiry regarding property: ${property.title}`;
                        const whatsappUrl = `https://wa.me/919930033056?text=${encodeURIComponent(
                          message
                        )}`;
                        window.open(whatsappUrl, "_blank");
                      }}
                    >
                      Enquire Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 mx-auto text-brand-grey/50 mb-4" />
              <p className="text-brand-grey text-lg">
                No featured properties available at the moment.
              </p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/properties">
              <Button
                variant="outline"
                size="lg"
                className="border-brand-classic-gold text-brand-classic-gold hover:bg-brand-classic-gold hover:text-primary"
              >
                Explore Our Properties
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Recognition and Awards */}
      <section
        className="py-20 bg-background"
        ref={(el) => el && (sectionsRef.current[3] = el)}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="text-center mb-16 opacity-0 animate-slide-in-left"
            style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Recognition & Awards
            </h2>
            <p className="text-xl text-brand-grey">
              Celebrating excellence in real estate with industry recognition
            </p>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 opacity-0 animate-slide-in-right"
            style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
          >
            <Card className="overflow-hidden hover:shadow-luxury transition-all duration-300 hover:scale-105">
              <div className="relative">
                <img
                  src="/lovable-uploads/99682767-ed37-4fb6-977f-72742d568258.png"
                  alt="ADCORE Developers Recognition"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold">ADCORE Partnership</h3>
                  <p className="text-sm text-white/80">
                    Developer Collaboration
                  </p>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden hover:shadow-luxury transition-all duration-300 hover:scale-105">
              <div className="relative">
                <img
                  src="/lovable-uploads/2b1cae59-7af3-4cf0-ab36-fb6eebbf72e9.png"
                  alt="Paranjape Award Recognition"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold">Excellence Award</h3>
                  <p className="text-sm text-white/80">Paranjape Recognition</p>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden hover:shadow-luxury transition-all duration-300 hover:scale-105">
              <div className="relative">
                <img
                  src="/lovable-uploads/81becc39-07c6-4115-b1fc-ba74122c8561.png"
                  alt="Industry Achievement Award"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold">Industry Achievement</h3>
                  <p className="text-sm text-white/80">
                    Professional Excellence
                  </p>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden hover:shadow-luxury transition-all duration-300 hover:scale-105">
              <div className="relative">
                <img
                  src="/lovable-uploads/37bf2cc1-1729-4cbb-bec7-87df5c333ea1.png"
                  alt="Real Estate Excellence Award"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold">Real Estate Excellence</h3>
                  <p className="text-sm text-white/80">Industry Leadership</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Client Reviews - Now Dynamic from Supabase */}
      {testimonials.length > 0 && (
        <section
          className="py-20 bg-gradient-hero text-white"
          ref={(el) => el && (sectionsRef.current[4] = el)}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Client Testimonials
              </h2>
              <p className="text-xl text-white/90">
                Hear from our satisfied clients about their experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.slice(0, 3).map((testimonial) => (
                <Card
                  key={testimonial.id}
                  className="bg-white/10 backdrop-blur-sm border-white/20 text-white"
                >
                  <CardContent className="p-6">
                    <div className="flex mb-4 justify-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 text-brand-classic-gold fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-white/90 mb-4 italic">"{testimonial.quote}"</p>
                    <div className="flex items-center space-x-3">
                      {testimonial.profile_image ? (
                        <img
                          src={testimonial.profile_image}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-brand-classic-gold/20 flex items-center justify-center">
                          <Users className="w-6 h-6 text-brand-classic-gold" />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        {testimonial.designation && (
                          <div className="text-white/70 text-sm">{testimonial.designation}</div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-brand-classic-gold">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-xl text-primary/80 mb-8">
            Connect with our experts today and discover premium real estate
            opportunities tailored to your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary text-white hover:bg-brand-navy"
            >
              <Phone className="mr-2 h-5 w-5" />
              Call Now: +91 99300 33056
            </Button>
            <Link to="/contact">
              <Button
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                Inquiry Form
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
