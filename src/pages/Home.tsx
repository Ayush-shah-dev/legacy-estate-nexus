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
      title: "Legacy",
      description: "25+ years of excellence in real estate development and investment guidance."
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
    { number: "25+", label: "Years Experience" },
    { number: "5000+", label: "Happy Clients" },
    { number: "₹500Cr+", label: "Worth Delivered" },
    { number: "100+", label: "Premium Projects" }
  ];

  const featuredProperties = [
    {
      id: 1,
      title: "Luxury Villa in Juhu",
      location: "Mumbai West",
      price: "₹8.5 Cr",
      type: "Villa",
      bedrooms: "4 BHK",
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Premium Apartment in Bandra",
      location: "Mumbai West", 
      price: "₹4.2 Cr",
      type: "Apartment",
      bedrooms: "3 BHK",
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=300&fit=crop"
    },
    {
      id: 3,
      title: "Sea View Penthouse",
      location: "Worli",
      price: "₹12.5 Cr",
      type: "Penthouse",
      bedrooms: "4 BHK",
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=300&fit=crop"
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
        className="relative h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-primary/70"></div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Premium Real Estate
            <span className="block text-brand-classic-gold">Excellence</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 animate-slide-up">
            Discover luxury living with our curated collection of premium properties 
            and unmatched service excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in">
            <Link to="/properties">
              <Button size="lg" className="bg-brand-classic-gold text-primary hover:bg-brand-soft-gold transition-all duration-300">
                Explore Properties
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                <Phone className="mr-2 h-5 w-5" />
                Enquiry Form
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
                  <p className="text-brand-grey mb-3">{property.location}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-brand-classic-gold">
                      {property.price}
                    </span>
                    <Badge variant="outline" className="border-brand-classic-gold text-brand-classic-gold">
                      {property.bedrooms}
                    </Badge>
                  </div>
                  <Button className="w-full bg-primary hover:bg-brand-navy">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/properties">
              <Button variant="outline" size="lg" className="border-brand-classic-gold text-brand-classic-gold hover:bg-brand-classic-gold hover:text-primary">
                View All Properties
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
              Call Now: +91 99031 88690
            </Button>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white">
                Enquiry Form
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}