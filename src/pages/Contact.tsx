import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle,
  Send,
  Building,
  User,
  Calculator
} from 'lucide-react';

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyType: '',
    budget: '',
    location: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Enquiry Submitted Successfully!",
        description: "Our team will contact you within 24 hours.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        propertyType: '',
        budget: '',
        location: '',
        message: ''
      });
      
      setIsSubmitting(false);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      details: ["+91 99031 88690"],
      action: "tel:+919903188690"
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["info@regalestate.com", "sales@regalestate.com"],
      action: "mailto:info@regalestate.com"
    },
    {
      icon: MapPin,
      title: "Visit Our Office",
      details: ["Andheri Business District", "Mumbai, Maharashtra 400058"],
      action: "https://maps.google.com"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Mon - Sat: 9:00 AM - 7:00 PM", "Sun: 10:00 AM - 5:00 PM"],
      action: null
    }
  ];

  const officeLocations = [
    {
      city: "Mumbai",
      address: "Andheri Business District, Western Express Highway",
      phone: "+91 99031 88690", 
      email: "mumbai@regalestate.com"
    }
  ];

  const services = [
    {
      icon: Building,
      title: "Property Consultation",
      description: "Expert guidance on property selection and investment strategies"
    },
    {
      icon: Calculator,
      title: "Financial Advisory",
      description: "Home loan assistance and investment planning"
    },
    {
      icon: User,
      title: "Personal Property Manager",
      description: "Dedicated support throughout your property journey"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Get In <span className="text-brand-classic-gold">Touch</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Ready to find your dream property? Our experts are here to help you every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-luxury">
                <CardContent className="p-8">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-primary mb-4">
                      Send Us Your Enquiry
                    </h2>
                    <p className="text-brand-grey">
                      Fill out the form below and our property experts will get back to you within 24 hours.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          Full Name *
                        </label>
                        <Input
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          Email Address *
                        </label>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          Phone Number *
                        </label>
                        <Input
                          placeholder="Enter your phone number"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          Property Type
                        </label>
                        <Select value={formData.propertyType} onValueChange={(value) => handleInputChange('propertyType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="apartment">Apartment</SelectItem>
                            <SelectItem value="villa">Villa</SelectItem>
                            <SelectItem value="penthouse">Penthouse</SelectItem>
                            <SelectItem value="studio">Studio</SelectItem>
                            <SelectItem value="townhouse">Townhouse</SelectItem>
                            <SelectItem value="commercial">Commercial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          Budget Range
                        </label>
                        <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select budget range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="under-50l">Under ₹50 Lakhs</SelectItem>
                            <SelectItem value="50l-1cr">₹50 Lakhs - ₹1 Crore</SelectItem>
                            <SelectItem value="1cr-2cr">₹1 Crore - ₹2 Crores</SelectItem>
                            <SelectItem value="2cr-5cr">₹2 Crores - ₹5 Crores</SelectItem>
                            <SelectItem value="above-5cr">Above ₹5 Crores</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          Preferred Location
                        </label>
                        <Input
                          placeholder="Enter preferred location"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        Additional Requirements
                      </label>
                      <Textarea
                        placeholder="Tell us about your specific requirements, preferences, or any questions you have..."
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        rows={4}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-brand-classic-gold text-primary hover:bg-brand-soft-gold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Submitting..."
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Send Enquiry
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="shadow-elegant">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-primary mb-6">
                    Contact Information
                  </h3>
                  <div className="space-y-6">
                    {contactInfo.map((info, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="p-3 bg-brand-classic-gold/10 rounded-lg">
                          <info.icon className="h-6 w-6 text-brand-classic-gold" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-primary mb-1">
                            {info.title}
                          </h4>
                          {info.details.map((detail, idx) => (
                            <p key={idx} className="text-brand-grey text-sm">
                              {info.action ? (
                                <a 
                                  href={info.action} 
                                  className="hover:text-brand-maroon transition-colors"
                                >
                                  {detail}
                                </a>
                              ) : (
                                detail
                              )}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-elegant">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-primary mb-6">
                    Quick Contact
                  </h3>
                  <div className="space-y-4">
                    <a
                      href="tel:+919903188690"
                      className="flex items-center justify-center w-full p-4 bg-brand-maroon text-white rounded-lg hover:bg-brand-maroon/90 transition-colors"
                    >
                      <Phone className="mr-2 h-5 w-5" />
                      Call Now
                    </a>
                    <a
                      href="https://wa.me/919903188690?text=Hi, I'm interested in your real estate services"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <MessageCircle className="mr-2 h-5 w-5" />
                      WhatsApp
                    </a>
                    <a
                      href="mailto:info@regalestate.com"
                      className="flex items-center justify-center w-full p-4 bg-brand-classic-gold text-primary rounded-lg hover:bg-brand-soft-gold transition-colors"
                    >
                      <Mail className="mr-2 h-5 w-5" />
                      Email Us
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              How We Help You
            </h2>
            <p className="text-xl text-brand-grey">
              Comprehensive real estate services tailored to your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-gold transition-all duration-300">
                <CardContent className="p-0">
                  <div className="mb-4">
                    <service.icon className="h-12 w-12 text-brand-classic-gold mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-3">
                    {service.title}
                  </h3>
                  <p className="text-brand-grey">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Our Office Locations
            </h2>
            <p className="text-xl text-brand-grey">
              Visit us at our premium location in the heart of Mumbai
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {officeLocations.map((office, index) => (
              <Card key={index} className="hover:shadow-luxury transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-primary mb-3">
                    {office.city}
                  </h3>
                  <div className="space-y-3 text-brand-grey">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 mt-1 text-brand-classic-gold" />
                      <span className="text-sm">{office.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-brand-classic-gold" />
                      <a href={`tel:${office.phone}`} className="text-sm hover:text-brand-maroon transition-colors">
                        {office.phone}
                      </a>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-brand-classic-gold" />
                      <a href={`mailto:${office.email}`} className="text-sm hover:text-brand-maroon transition-colors">
                        {office.email}
                      </a>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-primary hover:bg-brand-navy">
                    Get Directions
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Find Us on Map
            </h2>
          </div>
          
          <div className="bg-gradient-accent rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-brand-classic-gold mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary mb-2">
                Interactive Map Coming Soon
              </h3>
              <p className="text-brand-grey">
                Explore our office locations with detailed directions
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}