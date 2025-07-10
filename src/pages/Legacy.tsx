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

export default function Legacy() {
  const milestones = [
    {
      year: "1999",
      title: "Foundation",
      description: "EstateNexus was founded with a vision to transform the real estate landscape in India."
    },
    {
      year: "2005",
      title: "First Major Project",
      description: "Delivered our first luxury residential complex, setting new standards for quality and design."
    },
    {
      year: "2010",
      title: "Market Expansion",
      description: "Expanded operations to 5 major cities across South India."
    },
    {
      year: "2015",
      title: "Digital Innovation",
      description: "Launched India's first AI-powered property recommendation platform."
    },
    {
      year: "2020",
      title: "Sustainable Development",
      description: "Pioneered green building initiatives with LEED certified projects."
    },
    {
      year: "2024",
      title: "Market Leadership",
      description: "Achieved ₹500Cr+ in cumulative property value delivered to clients."
    }
  ];

  const values = [
    {
      icon: Shield,
      title: "Integrity",
      description: "Transparent dealings and honest communication form the foundation of every transaction."
    },
    {
      icon: Target,
      title: "Excellence",
      description: "Commitment to delivering exceptional quality in every project and service we provide."
    },
    {
      icon: Users,
      title: "Client-Centric",
      description: "Your dreams and aspirations drive our mission to find the perfect property solutions."
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "Leveraging cutting-edge technology to enhance the real estate experience."
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
      name: "Rajesh Kumar",
      role: "Founder & Chairman",
      experience: "25+ Years",
      specialization: "Strategic Planning & Market Development"
    },
    {
      name: "Priya Sharma",
      role: "Managing Director",
      experience: "20+ Years",
      specialization: "Luxury Properties & Client Relations"
    },
    {
      name: "Amit Patel",
      role: "Head of Operations",
      experience: "15+ Years",
      specialization: "Project Management & Quality Assurance"
    },
    {
      name: "Sneha Reddy",
      role: "Head of Sales",
      experience: "12+ Years",
      specialization: "Investment Advisory & Market Analysis"
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
              25 years of excellence, innovation, and trust in real estate. 
              Building dreams, creating communities, and establishing lasting relationships.
            </p>
            <div className="flex justify-center space-x-8 text-center">
              <div>
                <div className="text-3xl font-bold text-brand-classic-gold">25+</div>
                <div className="text-white/80">Years Legacy</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-brand-classic-gold">5000+</div>
                <div className="text-white/80">Happy Families</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-brand-classic-gold">₹500Cr+</div>
                <div className="text-white/80">Value Delivered</div>
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
                  EstateNexus began in 1999 with a simple yet powerful vision: to revolutionize 
                  the real estate industry through trust, transparency, and unmatched service excellence. 
                  What started as a small firm with big dreams has grown into one of India's most 
                  respected real estate companies.
                </p>
                <p>
                  Our founder, Rajesh Kumar, recognized the need for a client-centric approach 
                  in an industry often marked by opacity. With this vision, we built EstateNexus 
                  on the pillars of integrity, innovation, and unwavering commitment to our clients' dreams.
                </p>
                <p>
                  Today, we stand proud as market leaders, having facilitated over ₹500 crores worth 
                  of property transactions while maintaining our core values that have defined us for 
                  over two decades.
                </p>
              </div>
              <Button className="mt-8 bg-brand-classic-gold text-primary hover:bg-brand-soft-gold">
                Learn More About Our Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop"
                alt="Modern Architecture"
                className="rounded-lg shadow-luxury"
              />
              <div className="absolute -bottom-6 -left-6 bg-brand-classic-gold text-primary p-6 rounded-lg shadow-gold">
                <div className="text-2xl font-bold">25+</div>
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

      {/* Leadership Team */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Leadership Team
            </h2>
            <p className="text-xl text-brand-grey">
              Experienced professionals leading our mission forward
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center overflow-hidden hover:shadow-gold transition-all duration-300">
                <div className="h-64 bg-gradient-accent flex items-center justify-center">
                  <Users className="h-20 w-20 text-brand-classic-gold" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-primary mb-1">
                    {member.name}
                  </h3>
                  <p className="text-brand-maroon font-medium mb-2">
                    {member.role}
                  </p>
                  <Badge variant="outline" className="mb-3 border-brand-classic-gold text-brand-classic-gold">
                    {member.experience}
                  </Badge>
                  <p className="text-sm text-brand-grey">
                    {member.specialization}
                  </p>
                </CardContent>
              </Card>
            ))}
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
            <Button size="lg" className="bg-brand-classic-gold text-primary hover:bg-brand-soft-gold">
              Explore Properties
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
              Contact Our Team
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}