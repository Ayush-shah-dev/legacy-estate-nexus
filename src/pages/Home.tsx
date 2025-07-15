import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, Award, Star, ArrowRight, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/mumbai-skyline.jpg';

export default function Home() {
  const highlights = [
    {
      icon: Award,
      title: "30+ Years Legacy",
      description: "30+ years of excellence in real estate development and investment guidance with 3rd generation realtors."
    },
    {
      icon: Building2,
      title: "Developer Connect",
      description: "Direct partnerships with premium developers for exclusive pre-launch opportunities."
    },
    {
      icon: Users,
      title: "Trust",
      description: "5000+ satisfied clients and a track record of transparent dealings."
    },
    {
      icon: Star,
      title: "Premium Inventory",
      description: "Curated collection of luxury properties in prime locations."
    }
  ];

  const stats = [
    { number: "30+", label: "Years Experience" },
    { number: "5000+", label: "Happy Clients" },
    { number: "₹500Cr+", label: "Worth Delivered" },
    { number: "3rd Gen", label: "Realtors" }
  ];

  const featuredProperties = [
    {
      id: 1,
      title: "Adcore Tower - Premium Commercial Space",
      location: "Business District, Mumbai",
      description: "Modern commercial tower with state-of-the-art facilities and premium office spaces in the heart of Mumbai's business district.",
      sqft: "500-5000 sq ft",
      amenities: ["24x7 Security", "High-Speed Elevators", "Power Backup", "Parking", "Food Court"],
      type: "Commercial",
      image: "/lovable-uploads/b9bc318e-2fb5-480d-8ee8-3cdd6f790a65.png"
    },
    {
      id: 2,
      title: "Westwood Heights - Luxury Residential",
      location: "Andheri West, Mumbai",
      description: "Premium residential complex offering modern amenities and luxurious living spaces with excellent connectivity.",
      sqft: "800-1500 sq ft",
      amenities: ["Swimming Pool", "Gym", "Children's Play Area", "Landscaped Gardens", "Club House"],
      type: "Residential",
      image: "/lovable-uploads/d2696bbb-2641-41bb-aa4f-23c280f24ea7.png"
    },
    {
      id: 3,
      title: "Sky Gardens - Premium Twin Towers",
      location: "Goregaon East, Mumbai",
      description: "Stunning twin tower development featuring spacious apartments with panoramic city views and world-class amenities.",
      sqft: "900-2000 sq ft",
      amenities: ["Sky Garden", "Infinity Pool", "Fitness Center", "Concierge Service", "Smart Home Features"],
      type: "Residential",
      image: "/lovable-uploads/54d3e00b-85c8-49e0-830b-b268e2e83865.png"
    }
  ];

  const reviews = [
    {
      name: "Rajesh Sharma",
      role: "Business Owner",
      review: "Exceptional service and premium properties. EstateNexus helped me find my dream home with complete transparency.",
      rating: 5
    },
    {
      name: "Priya Nair",
      role: "Investment Banker",
      review: "Professional approach and excellent market insights. Highly recommend for serious property investments.",
      rating: 5
    },
    {
      name: "Amit Patel",
      role: "Tech Executive",
      review: "Smooth process from start to finish. The team's expertise in luxury properties is unmatched.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-primary/70"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-pulse opacity-20"
          style={{ 
            backgroundImage: `url(${heroImage})`,
            animation: 'moveBackground 20s ease-in-out infinite'
          }}
        ></div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Mumbai Real Estate,
            <span className="block text-brand-classic-gold">The Regal Way</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 animate-slide-up">
            Beyond homes. We curate lifestyles.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in">
            <Link to="/properties">
              <Button size="lg" className="bg-brand-classic-gold text-primary hover:bg-brand-soft-gold transition-all duration-300">
                Explore Our Properties
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                <Phone className="mr-2 h-5 w-5" />
                Inquiry Form
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-5xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-brand-grey font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Why Choose Regal Estate Consultants
            </h2>
            <p className="text-xl text-brand-grey max-w-3xl mx-auto">
              Building trust through excellence, connecting you with premium properties 
              and investment opportunities.
            </p>
          </div>

          {/* Trusted by Section */}
          <div className="text-center mb-12">
            <h3 className="text-2xl font-semibold text-primary mb-8">
              Trusted by India's Leading Developers
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
              <div className="group cursor-pointer">
                <img 
                  src="/lovable-uploads/3068d3a3-f113-4a53-81e7-7e7be23345e3.png" 
                  alt="Adani Realty" 
                  className="h-16 w-auto transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg opacity-70 hover:opacity-100" 
                />
              </div>
              <div className="group cursor-pointer">
                <img 
                  src="/lovable-uploads/b00d9894-3524-4d9b-8f50-33f2f333dcb5.png" 
                  alt="Godrej Properties" 
                  className="h-16 w-auto transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg opacity-70 hover:opacity-100" 
                />
              </div>
              <div className="group cursor-pointer">
                <img 
                  src="/lovable-uploads/ad219bbd-a8e8-4e82-889c-30db765fb5ab.png" 
                  alt="Raymond Realty" 
                  className="h-16 w-auto transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg opacity-70 hover:opacity-100" 
                />
              </div>
              <div className="group cursor-pointer">
                <img 
                  src="/lovable-uploads/e21683e6-14b6-4729-828e-36c7d5923146.png" 
                  alt="Lodha" 
                  className="h-16 w-auto transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg opacity-70 hover:opacity-100" 
                />
              </div>
              <div className="group cursor-pointer">
                <img 
                  src="/lovable-uploads/0fe0702e-fe06-4a24-bb96-5325dbd4863c.png" 
                  alt="DLF" 
                  className="h-16 w-auto transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg opacity-70 hover:opacity-100" 
                />
              </div>
              <div className="group cursor-pointer">
                <img 
                  src="/lovable-uploads/b9583c92-6074-4562-8a9f-a0a811a39d7e.png" 
                  alt="LT Realty" 
                  className="h-16 w-auto transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg opacity-70 hover:opacity-100" 
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((highlight, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-gold transition-all duration-300 border-brand-soft-gold/20">
                <CardContent className="p-0">
                  <div className="mb-4">
                    <highlight.icon className="h-12 w-12 text-brand-classic-gold mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-3">
                    {highlight.title}
                  </h3>
                  <p className="text-brand-grey">
                    {highlight.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Featured Properties
            </h2>
            <p className="text-xl text-brand-grey">
              Discover our handpicked selection of premium properties
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-luxury transition-all duration-300">
                <div className="relative">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-64 object-cover"
                  />
                  <Badge className="absolute top-4 right-4 bg-brand-maroon text-white">
                    {property.type}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-primary mb-2">
                    {property.title}
                  </h3>
                  <p className="text-brand-grey mb-2">{property.location}</p>
                  <p className="text-sm text-brand-grey mb-3">{property.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-primary">Area:</span>
                      <span className="text-sm text-brand-grey">{property.sqft}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-primary mb-1">Amenities:</span>
                      <div className="flex flex-wrap gap-1">
                        {property.amenities.slice(0, 3).map((amenity, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-brand-classic-gold/50 text-brand-classic-gold">
                            {amenity}
                          </Badge>
                        ))}
                        {property.amenities.length > 3 && (
                          <Badge variant="outline" className="text-xs border-brand-classic-gold/50 text-brand-classic-gold">
                            +{property.amenities.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-primary hover:bg-brand-navy"
                    onClick={() => {
                      const message = `Hi, I have an enquiry regarding property: ${property.title}`;
                      const whatsappUrl = `https://wa.me/919930033056?text=${encodeURIComponent(message)}`;
                      window.open(whatsappUrl, '_blank');
                    }}
                  >
                    Enquire Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/properties">
              <Button variant="outline" size="lg" className="border-brand-classic-gold text-brand-classic-gold hover:bg-brand-classic-gold hover:text-primary">
                Explore Our Properties
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Client Reviews */}
      <section className="py-20 bg-gradient-hero text-white">
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
            {reviews.map((review, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-brand-classic-gold fill-current" />
                    ))}
                  </div>
                  <p className="text-white/90 mb-4 italic">
                    "{review.review}"
                  </p>
                  <div>
                    <div className="font-semibold">{review.name}</div>
                    <div className="text-white/70 text-sm">{review.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand-classic-gold">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-xl text-primary/80 mb-8">
            Connect with our experts today and discover premium real estate opportunities 
            tailored to your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary text-white hover:bg-brand-navy">
              <Phone className="mr-2 h-5 w-5" />
              Call Now: +91 99300 33056
            </Button>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white">
                Inquiry Form
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}