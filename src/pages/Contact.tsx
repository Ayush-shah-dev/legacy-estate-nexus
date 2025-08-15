import { SecureContactForm } from '@/components/SecureContactForm';
import Map from '@/components/Map';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle,
  Building,
  User,
  Calculator
} from 'lucide-react';

export default function Contact() {
  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      details: ["+91 99300 33056"],
      action: "tel:+919930033056"
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["sales.regalestate@gmail.com"],
      action: "mailto:sales.regalestate@gmail.com"
    },
    {
      icon: MapPin,
      title: "Visit Our Office",
      details: ["Shop No. 3, Bharat Altavistas, next to ICICI Bank", "Lokhandwala Complex, Andheri West", "Mumbai, Maharashtra 400053"],
      action: "https://maps.google.com/?q=Shop+No.+3,+Bharat+Altavistas,+next+to+ICICI+Bank,+Lokhandwala+Complex,+Andheri+West,+Mumbai,+Maharashtra+400053"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Monday - Saturday: 10am - 6pm", "Sunday: 10am - 4pm"],
      action: null
    }
  ];

  const officeLocations = [
    {
      city: "Mumbai",
      address: "Shop No. 3, Bharat Altavistas, next to ICICI Bank, Lokhandwala Complex, Andheri West, Mumbai, Maharashtra 400053",
      phone: "+91 99300 33056", 
      email: "sales.regalestate@gmail.com"
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
            {/* Secure Contact Form */}
            <div className="lg:col-span-2">
              <SecureContactForm />
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
                      href="tel:+919930033056"
                      className="flex items-center justify-center w-full p-4 bg-brand-maroon text-white rounded-lg hover:bg-brand-maroon/90 transition-colors"
                    >
                      <Phone className="mr-2 h-5 w-5" />
                      Call Now
                    </a>
                    <a
                      href="https://wa.me/919930033056?text=Hi, I'm interested in your real estate services"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <MessageCircle className="mr-2 h-5 w-5" />
                      WhatsApp
                    </a>
                    <a
                      href="mailto:sales.regalestate@gmail.com"
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
                  <a
                    href="https://maps.google.com/?q=Shop+No.+3,+Bharat+Altavistas,+next+to+ICICI+Bank,+Lokhandwala+Complex,+Andheri+West,+Mumbai,+Maharashtra+400053"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full mt-4"
                  >
                    <button className="w-full bg-primary hover:bg-brand-navy text-white px-4 py-2 rounded-lg">
                      Get Directions
                    </button>
                  </a>
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
            <p className="text-xl text-brand-grey">
              Interactive map showing our office location in Lokhandwala Complex
            </p>
          </div>
          
          <Map />
        </div>
      </section>
    </div>
  );
}
