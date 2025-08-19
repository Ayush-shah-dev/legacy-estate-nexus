
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Award, 
  Shield, 
  Target,
  Calendar,
  MapPin,
  ArrowRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Legacy() {
  const milestones = [
    {
      year: "1987",
      title: "Foundation",
      description: "REGAL ESTATE CONSULTANTS began in a humble room at Sunil Niwas, near Four Bungalows, Andheri West."
    },
    {
      year: "1988",
      title: "Lokhandwala Move", 
      description: "The firm moved to Lokhandwala Complex, where it firmly took root and established its presence."
    },
    {
      year: "1990s",
      title: "Building Reputation",
      description: "Selling landmark projects like Nishant and Sagar Tarang during challenging infrastructure times."
    },
    {
      year: "2000s",
      title: "Channel Partnerships",
      description: "Established partnerships with top developers like DLF, Godrej Properties, and Lodha."
    },
    {
      year: "2010s",
      title: "Next Generation",
      description: "Ajay Punjabi, third-generation realtor with 20 years of experience, joined the family business."
    },
    {
      year: "2024",
      title: "Market Leadership",
      description: "Continuing the legacy as Mumbai's trusted partner in premium real estate with unmatched dedication."
    }
  ];

  const values = [
    {
      icon: Shield,
      title: "Trust",
      description: "Built on trust, emotion, and deep market knowledge, serving clients with unmatched dedication."
    },
    {
      icon: Target,
      title: "Excellence",
      description: "Specializing in both primary and secondary real estate with expertise and reliability."
    },
    {
      icon: Users,
      title: "Legacy",
      description: "Three generations of real estate expertise carrying forward the family legacy."
    },
    {
      icon: TrendingUp,
      title: "Market Knowledge",
      description: "Deep understanding of Mumbai's real estate market with decades of experience."
    }
  ];

  const achievements = [
    {
      icon: Award,
      title: "Best Real Estate Company 2023",
      org: "Indian Real Estate Awards"
    },
    {
      icon: Building2,
      title: "Excellence in Luxury Segment",
      org: "Property Excellence Awards"
    },
    {
      icon: Users,
      title: "Customer Satisfaction Leader",
      org: "Real Estate Customer Survey 2023"
    },
    {
      icon: TrendingUp,
      title: "Fastest Growing Company",
      org: "Business Today Rankings"
    }
  ];

  const team = [
    {
      name: "Mr. Narendra Punjabi",
      role: "Founder & Visionary",
      experience: "37+ Years",
      specialization: "Real Estate Pioneer & Market Development"
    },
    {
      name: "Ajay Punjabi",
      role: "Managing Partner",
      experience: "20+ Years",
      specialization: "Third-Generation Realtor & Client Relations"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              Our <span className="text-brand-classic-gold">Legacy</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-8 animate-slide-up">
              37 years of excellence, trust, and dedication in Mumbai's real estate. 
              <br />Mumbai's Real Estate, The Regal Way.
            </p>
            <div className="flex justify-center space-x-8 text-center">
              <div>
                <div className="text-3xl font-bold text-brand-classic-gold">37+</div>
                <div className="text-white/80">Years Legacy</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-brand-classic-gold">3</div>
                <div className="text-white/80">Generations</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-brand-classic-gold">1000+</div>
                <div className="text-white/80">Properties Sold</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                Our Story
              </h2>
              <div className="space-y-6 text-lg text-brand-grey">
                <p>
                  The journey of REGAL ESTATE CONSULTANTS began in a humble room at Sunil Niwas, near Four Bungalows, Andheri West, in 1987. Founded by Mr. Narendra Punjabi, a visionary who started his real estate career in Versova, he built his reputation brick by brick—selling landmark projects like Nishant and Sagar Tarang during times when even basic infrastructure was a challenge.
                </p>
                <p>
                  In 1988, the firm moved to Lokhandwala Complex, where it firmly took root. Today, joined by his son Ajay Punjabi, a third-generation realtor with 20 years of experience—the father-son duo continues to carry forward this legacy.
                </p>
                <p>
                  Built on trust, emotion, and deep market knowledge, they specialize in both primary and secondary real estate, serving clients with unmatched dedication and confidence as channel partners to top developers.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="/lovable-uploads/dd4d2925-40db-4f86-ba79-c05c68adc814.png"
                alt="Mr. Narendra Punjabi and Ajay Punjabi - Father and Son Legacy"
                className="rounded-lg shadow-luxury"
              />
              <div className="absolute -bottom-6 -left-6 bg-brand-classic-gold text-primary p-6 rounded-lg shadow-gold">
                <div className="text-2xl font-bold">37+</div>
                <div className="text-sm">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Our Journey Through Time
            </h2>
            <p className="text-xl text-brand-grey">
              Key milestones that shaped our legacy in real estate
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-brand-classic-gold"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className="flex-1">
                    <Card className={`max-w-md ${index % 2 === 0 ? 'ml-auto mr-8' : 'mr-auto ml-8'} hover:shadow-gold transition-all duration-300`}>
                      <CardContent className="p-6">
                        <Badge className="mb-3 bg-brand-maroon text-white">
                          {milestone.year}
                        </Badge>
                        <h3 className="text-xl font-semibold text-primary mb-2">
                          {milestone.title}
                        </h3>
                        <p className="text-brand-grey">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="w-6 h-6 bg-brand-classic-gold rounded-full border-4 border-white shadow-md"></div>
                  <div className="flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-brand-grey max-w-3xl mx-auto">
              The principles that guide every decision we make and every relationship we build
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-gold transition-all duration-300 border-brand-soft-gold/20">
                <CardContent className="p-0">
                  <div className="mb-4">
                    <value.icon className="h-12 w-12 text-brand-classic-gold mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-3">
                    {value.title}
                  </h3>
                  <p className="text-brand-grey">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-gradient-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Recognition & Awards
            </h2>
            <p className="text-xl text-brand-grey">
              Industry recognition for our commitment to excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <Card key={index} className="text-center p-6 bg-white hover:shadow-luxury transition-all duration-300">
                <CardContent className="p-0">
                  <div className="mb-4">
                    <achievement.icon className="h-12 w-12 text-brand-maroon mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-2">
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-brand-grey">
                    {achievement.org}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Certificates */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Professional Certificates & Partnerships
            </h2>
            <p className="text-xl text-brand-grey">
              Industry certifications and partnerships that validate our expertise and commitment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Certificate 1 - Andheri West Estate Agent's Association Appreciation */}
            <Card className="overflow-hidden hover:shadow-luxury transition-all duration-300 hover:scale-105">
              <div className="relative">
                <img
                  src="/lovable-uploads/12493c0b-3f8c-4441-bf08-4e07ceceac85.png"
                  alt="Certificate of Appreciation from Andheri West Estate Agent's Association"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold text-sm">Certificate of Appreciation</h3>
                  <p className="text-xs text-white/80">AWEAA Recognition</p>
                </div>
              </div>
            </Card>

            {/* Certificate 2 - DLF Partnership */}
            <Card className="overflow-hidden hover:shadow-luxury transition-all duration-300 hover:scale-105">
              <div className="relative">
                <img
                  src="/lovable-uploads/4232ab82-271b-4d7c-99cb-e5ea49d1203a.png"
                  alt="DLF Certificate of Partnership - Authorized Channel Partner"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold text-sm">DLF Partnership</h3>
                  <p className="text-xs text-white/80">Authorized Channel Partner</p>
                </div>
              </div>
            </Card>

            {/* Certificate 3 - RICS Professional Development */}
            <Card className="overflow-hidden hover:shadow-luxury transition-all duration-300 hover:scale-105">
              <div className="relative">
                <img
                  src="/lovable-uploads/a82fbd5c-cfca-4f6a-8a32-cb392a5b160f.png"
                  alt="RICS Management Development Program Certificate"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold text-sm">RICS Certification</h3>
                  <p className="text-xs text-white/80">Professional Development</p>
                </div>
              </div>
            </Card>

            {/* Certificate 4 - Chandak Group Appreciation */}
            <Card className="overflow-hidden hover:shadow-luxury transition-all duration-300 hover:scale-105">
              <div className="relative">
                <img
                  src="/lovable-uploads/90c13836-623a-4b2a-82d7-c7d60d5045de.png"
                  alt="Chandak Group Certificate of Appreciation"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold text-sm">Chandak Group</h3>
                  <p className="text-xs text-white/80">Partner Appreciation</p>
                </div>
              </div>
            </Card>

            {/* Certificate 5 - AWEAA Silver Tray */}
            <Card className="overflow-hidden hover:shadow-luxury transition-all duration-300 hover:scale-105">
              <div className="relative">
                <img
                  src="/lovable-uploads/470e3a57-3b84-4823-a54c-a55dd20eb262.png"
                  alt="AWEAA Silver Tray Award"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold text-sm">AWEAA Award</h3>
                  <p className="text-xs text-white/80">Community Recognition</p>
                </div>
              </div>
            </Card>

            {/* Certificate 6 - Additional AWEAA Certificate */}
            <Card className="overflow-hidden hover:shadow-luxury transition-all duration-300 hover:scale-105">
              <div className="relative">
                <img
                  src="/lovable-uploads/5e945b9e-9120-4342-99ef-f542ec2b6765.png"
                  alt="Additional AWEAA Certificate of Appreciation"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold text-sm">AWEAA Recognition</h3>
                  <p className="text-xs text-white/80">Professional Excellence</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-premium text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join Our Legacy
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Be part of our continuing story. Let us help you find your perfect property 
            and create your own legacy in real estate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-brand-classic-gold text-primary hover:bg-brand-soft-gold">
              <Link to="/properties">
                Explore Properties
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
              <Link to="/contact">
                Contact Our Team
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
