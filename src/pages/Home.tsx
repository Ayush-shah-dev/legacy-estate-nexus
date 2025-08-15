import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin, Bed, Bath, Square, Star, MessageSquare, Play, Pause } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";

interface Testimonial {
  id: string;
  name: string;
  designation: string | null;
  quote: string;
  profile_image: string | null;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

const Home = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  
  useVisitorTracking();

  useEffect(() => {
    fetchTestimonials();
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

  // Auto-advance testimonials
  useEffect(() => {
    if (testimonials.length > 1) {
      const timer = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [testimonials.length]);

  const toggleVideo = () => {
    const video = document.querySelector('video');
    if (video) {
      if (isVideoPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const featuredProperties = [
    {
      id: 1,
      title: "Luxury Penthouse in Bandra",
      location: "Bandra West, Mumbai",
      price: "₹5.2 Cr",
      bedrooms: 3,
      bathrooms: 3,
      area: 2800,
      image: "/lovable-uploads/2f60dc4d-2374-4ea6-bcda-23a90e3fda86.png",
      featured: true
    },
    {
      id: 2,
      title: "Sea View Apartment in Marine Drive",
      location: "Marine Drive, Mumbai",
      price: "₹8.5 Cr",
      bedrooms: 4,
      bathrooms: 4,
      area: 3200,
      image: "/lovable-uploads/37bf2cc1-1729-4cbb-bec7-87df5c333ea1.png",
      featured: true
    },
    {
      id: 3,
      title: "Modern Villa in Juhu",
      location: "Juhu, Mumbai",
      price: "₹12 Cr",
      bedrooms: 5,
      bathrooms: 6,
      area: 4500,
      image: "/lovable-uploads/4232ab82-271b-4d7c-99cb-e5ea49d1203a.png",
      featured: true
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/src/assets/BG_MAIN.mp4" type="video/mp4" />
        </video>
        
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Find Your Dream
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Property
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 animate-fade-in-delay">
            Discover premium properties in Mumbai's most prestigious locations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-2">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
              <Link to="/properties" className="flex items-center">
                Browse Properties
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-black">
              <Link to="/contact">Get Consultation</Link>
            </Button>
          </div>
        </div>

        <button
          onClick={toggleVideo}
          className="absolute bottom-6 right-6 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
        >
          {isVideoPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </button>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Properties</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked premium properties that define luxury living in Mumbai
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <Card key={property.id} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {property.featured && (
                    <Badge className="absolute top-4 left-4 bg-blue-600 hover:bg-blue-700">
                      Featured
                    </Badge>
                  )}
                  <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full font-semibold">
                    {property.price}
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {property.title}
                  </h3>
                  <p className="text-gray-600 mb-4 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location}
                  </p>
                  <div className="flex justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <Bed className="h-4 w-4 mr-1" />
                      {property.bedrooms} Beds
                    </span>
                    <span className="flex items-center">
                      <Bath className="h-4 w-4 mr-1" />
                      {property.bathrooms} Baths
                    </span>
                    <span className="flex items-center">
                      <Square className="h-4 w-4 mr-1" />
                      {property.area} sq ft
                    </span>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
              <Link to="/properties" className="flex items-center">
                View All Properties
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Real experiences from satisfied property owners and investors
              </p>
            </div>

            <div className="relative max-w-4xl mx-auto">
              <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
                <div className="flex justify-center mb-6">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                
                <blockquote className="text-xl md:text-2xl text-gray-700 text-center mb-8 leading-relaxed">
                  "{testimonials[currentTestimonial]?.quote}"
                </blockquote>
                
                <div className="flex items-center justify-center space-x-4">
                  {testimonials[currentTestimonial]?.profile_image && (
                    <img
                      src={testimonials[currentTestimonial].profile_image}
                      alt={testimonials[currentTestimonial].name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 text-lg">
                      {testimonials[currentTestimonial]?.name}
                    </div>
                    {testimonials[currentTestimonial]?.designation && (
                      <div className="text-gray-600">
                        {testimonials[currentTestimonial].designation}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Testimonial Navigation Dots */}
              {testimonials.length > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                25 Years of Excellence in Mumbai Real Estate
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                We've been helping families and investors find their perfect properties in Mumbai for over two decades. Our deep understanding of the local market, combined with personalized service, makes us your trusted partner in real estate.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                  <div className="text-gray-600">Properties Sold</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">200+</div>
                  <div className="text-gray-600">Happy Families</div>
                </div>
              </div>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link to="/contact">Schedule Consultation</Link>
              </Button>
            </div>
            <div className="relative">
              <img
                src="/lovable-uploads/mumbai-skyline-cinematic.jpg"
                alt="Mumbai skyline"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Let our experienced team guide you through Mumbai's premium real estate market
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link to="/properties">Browse Properties</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link to="/contact" className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                Get in Touch
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
