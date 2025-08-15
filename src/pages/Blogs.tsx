import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  User, 
  ArrowRight, 
  TrendingUp, 
  Building2, 
  Home, 
  MapPin,
  Calculator,
  Shield,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Blogs() {
  const blogPosts = [
    {
      id: 1,
      title: "Mumbai Real Estate Market Trends 2024: What Buyers Need to Know",
      excerpt: "Discover the latest trends shaping Mumbai's real estate landscape in 2024. From price movements in prime locations to emerging investment opportunities.",
      content: `Mumbai's real estate market continues to evolve in 2024, with several key trends shaping the landscape for both buyers and investors. As Regal Estate Consultants with 30+ years of experience, we've witnessed significant transformations in the market.

**Key Market Trends:**

1. **Price Stabilization in Premium Segments**: After years of volatility, luxury properties in areas like Bandra, Juhu, and Worli are showing price stabilization, making it an opportune time for buyers.

2. **Rise of Sustainable Living**: Green buildings and eco-friendly developments are becoming increasingly popular, with buyers prioritizing sustainability features.

3. **Infrastructure Development Impact**: The Mumbai Metro expansion and coastal road project are significantly impacting property values in connected areas.

**Investment Hotspots:**
- Andheri West: Continued growth due to business district proximity
- Powai: IT hub expansion driving demand
- Thane: Affordable luxury options with excellent connectivity

**Why Choose Regal Estate Consultants?**
With our 3rd generation realtors and deep market knowledge, we provide insights that go beyond market data. Our trusted partnerships with India's leading developers ensure you get access to the best pre-launch opportunities.

Ready to invest in Mumbai's dynamic real estate market? Contact our experts today for personalized guidance.`,
      author: "Ajay Punjabi",
      date: "January 15, 2024",
      category: "Market Analysis",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=400&fit=crop",
      tags: ["Mumbai Real Estate", "Market Trends", "Investment", "2024"]
    },
    {
      id: 2,
      title: "The Complete Guide to Buying Your First Home in Mumbai",
      excerpt: "A comprehensive guide for first-time homebuyers in Mumbai, covering everything from budget planning to documentation and legal processes.",
      content: `Buying your first home in Mumbai can be overwhelming, but with the right guidance, it becomes an exciting journey. At Regal Estate Consultants, we've helped thousands of first-time buyers navigate this process successfully.

**Step-by-Step Home Buying Process:**

**1. Budget Planning:**
- Calculate your affordability using the 30% rule
- Factor in additional costs (registration, stamp duty, legal fees)
- Explore home loan options and pre-approval benefits

**2. Location Research:**
- Consider proximity to workplace and amenities
- Evaluate future development plans in the area
- Assess connectivity and infrastructure

**3. Property Documentation:**
- Verify clear title and approvals
- Check RERA registration for new projects
- Review society NOCs and completion certificates

**4. Legal Due Diligence:**
- Engage a qualified property lawyer
- Verify all statutory approvals
- Ensure proper chain of title

**Common First-Time Buyer Mistakes to Avoid:**
- Not getting professional legal advice
- Overlooking hidden costs
- Focusing only on price, ignoring quality
- Skipping property inspections

**How Regal Estate Consultants Helps:**
Our team provides end-to-end support, from property search to final registration. With our 30+ years of experience and trusted developer relationships, we ensure a smooth, transparent buying experience.

**Services We Offer:**
- Real Estate Purchase Assistance
- Investor Advisory Services
- Legal Documentation Support
- Pre-Lease Property Services

Contact us today to start your homeownership journey in Mumbai with confidence.`,
      author: "Narendra Punjabi",
      date: "January 10, 2024",
      category: "Home Buying Guide",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop",
      tags: ["First Time Buyer", "Home Buying", "Mumbai", "Real Estate Guide"]
    },
    {
      id: 3,
      title: "Luxury Real Estate in Mumbai: Premium Locations and Investment Potential",
      excerpt: "Explore Mumbai's most prestigious neighborhoods and understand the luxury real estate market dynamics that drive investment decisions.",
      content: `Mumbai's luxury real estate market represents some of India's most prestigious and valuable properties. As 3rd generation realtors at Regal Estate Consultants, we've witnessed the evolution of luxury living in the city.

**Prime Luxury Locations:**

**1. South Mumbai:**
- Malabar Hill: Heritage charm with modern amenities
- Cuffe Parade: Waterfront luxury with business district proximity
- Colaba: Colonial architecture meets contemporary living

**2. Western Suburbs:**
- Bandra West: Bollywood hub with premium lifestyle offerings
- Juhu: Beachfront properties with entertainment district access
- Worli: Ultra-luxury high-rises with sea views

**3. Central Mumbai:**
- Lower Parel: Corporate hub with luxury developments
- Prabhadevi: Emerging luxury destination with excellent connectivity

**Investment Considerations:**
- Capital appreciation potential
- Rental yield opportunities
- Infrastructure development impact
- Developer reputation and project quality

**Luxury Amenities to Expect:**
- Concierge services and valet parking
- Private elevators and sky lobbies
- Spa, gym, and recreational facilities
- Smart home automation systems

**Market Insights:**
Luxury properties in Mumbai have shown resilience during market fluctuations. With limited land availability and increasing demand from HNIs and NRIs, premium locations continue to appreciate steadily.

**Regal Estate's Luxury Portfolio:**
We maintain exclusive partnerships with premium developers, offering our clients first access to ultra-luxury projects. Our curated portfolio includes penthouses, sea-facing apartments, and architectural marvels.

**Why Trust Regal Estate Consultants:**
- 30+ years of luxury market expertise
- Trusted by India's leading developers
- Personalized service for discerning clients
- End-to-end transaction support

Ready to explore Mumbai's luxury real estate market? Connect with our experts for exclusive opportunities.`,
      author: "Ajay Punjabi",
      date: "January 5, 2024",
      category: "Luxury Real Estate",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=400&fit=crop",
      tags: ["Luxury Real Estate", "Premium Properties", "Investment", "Mumbai Luxury"]
    },
    {
      id: 4,
      title: "Commercial Real Estate Investment Opportunities in Mumbai",
      excerpt: "Discover the thriving commercial real estate sector in Mumbai and how to identify profitable investment opportunities in office spaces and retail.",
      content: `Mumbai's commercial real estate sector offers excellent investment opportunities for those looking to diversify their portfolio. As experts in both residential and commercial segments, Regal Estate Consultants provides comprehensive advisory services.

**Commercial Real Estate Segments:**

**1. Office Spaces:**
- Grade A office buildings in BKC and Lower Parel
- Co-working spaces and flexible office solutions
- IT parks and business districts

**2. Retail Spaces:**
- High-street retail in premium locations
- Shopping mall anchor stores
- F&B outlets in prime areas

**3. Warehousing and Logistics:**
- Growing e-commerce demands
- Strategic location advantages
- Multi-modal connectivity benefits

**Investment Benefits:**
- Steady rental income with long-term leases
- Professional tenant base
- Capital appreciation potential
- Tax benefits and depreciation advantages

**Key Investment Locations:**
- Bandra Kurla Complex (BKC): Premium office destination
- Lower Parel: Corporate hub with mixed-use developments
- Andheri SEEPZ: IT and technology focus
- Navi Mumbai: Emerging commercial hub

**Market Dynamics:**
The Mumbai commercial real estate market has shown strong recovery post-pandemic, with increasing demand for quality office spaces and modern amenities.

**Due Diligence Factors:**
- Location and accessibility
- Building quality and amenities
- Tenant profile and lease terms
- Future development plans
- Regulatory compliance

**How Regal Estate Consultants Helps:**
Our commercial real estate services include:
- Project Marketing for OC-Ready Properties
- Investor Advisory Services
- Landlord and Tenant Representation
- Market Analysis and Feasibility Studies

**Success Stories:**
We've successfully facilitated commercial transactions worth over ₹500 Crores, helping investors achieve their financial goals through strategic real estate investments.

Contact our commercial real estate specialists to explore investment opportunities tailored to your requirements.`,
      author: "Narendra Punjabi",
      date: "December 28, 2023",
      category: "Commercial Real Estate",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop",
      tags: ["Commercial Real Estate", "Investment", "Office Spaces", "Mumbai Business"]
    },
    {
      id: 5,
      title: "NRI Investment in Mumbai Real Estate: Complete Guide and Legal Framework",
      excerpt: "A comprehensive guide for Non-Resident Indians looking to invest in Mumbai real estate, covering legal requirements, tax implications, and investment strategies.",
      content: `Non-Resident Indians (NRIs) continue to show strong interest in Mumbai real estate as an investment avenue. With our 30+ years of experience, Regal Estate Consultants has successfully assisted numerous NRI clients in their property investments.

**Legal Framework for NRI Investments:**

**1. FEMA Guidelines:**
- NRIs can purchase residential and commercial properties
- Agricultural land purchase restrictions apply
- Repatriation limits and regulations

**2. Required Documentation:**
- PAN Card and Aadhar Card
- Passport and Visa copies
- NRE/NRO account statements
- Income proof from abroad

**Investment Vehicles:**
- Direct property purchase
- Real Estate Investment Trusts (REITs)
- Property development partnerships
- Fractional ownership platforms

**Tax Implications:**
- Capital gains tax considerations
- TDS on property transactions
- Double taxation avoidance benefits
- Rental income taxation

**Financing Options:**
- NRI home loans up to 80% LTV
- Competitive interest rates
- Flexible repayment options
- Currency hedging possibilities

**Popular Investment Locations for NRIs:**
- South Mumbai: Heritage value and appreciation potential
- Bandra-Juhu: Lifestyle and connectivity
- Powai: IT hub with modern amenities
- Navi Mumbai: Affordable luxury with infrastructure growth

**Investment Strategies:**
- Buy and hold for long-term appreciation
- Rental income generation
- Resale after value enhancement
- Portfolio diversification

**Challenges and Solutions:**
- Distance management: Professional property management services
- Legal compliance: Expert legal advisory
- Market updates: Regular market insights and reporting
- Transaction facilitation: End-to-end support

**Regal Estate's NRI Services:**
- Dedicated NRI relationship managers
- Virtual property tours and documentation
- Legal and financial advisory
- Property management services
- Regular investment updates

**Success Stories:**
We've helped NRIs from USA, UAE, UK, and Singapore successfully invest in Mumbai real estate, achieving average returns of 12-15% annually.

**Why Choose Regal Estate for NRI Investments:**
- Trusted by India's leading developers
- Transparent dealings with no hidden costs
- End-to-end service from search to registration
- Post-purchase property management support

Ready to invest in Mumbai real estate from abroad? Our NRI specialists are here to guide you through every step of the process.`,
      author: "Ajay Punjabi",
      date: "December 20, 2023",
      category: "NRI Investment",
      readTime: "9 min read",
      image: "https://images.unsplash.com/photo-1560472355-536de3962603?w=800&h=400&fit=crop",
      tags: ["NRI Investment", "Mumbai Real Estate", "FEMA Guidelines", "International Investment"]
    },
    {
      id: 6,
      title: "Future of Mumbai Real Estate: Infrastructure Projects Driving Growth",
      excerpt: "Explore how upcoming infrastructure projects like Mumbai Metro, Coastal Road, and Navi Mumbai Airport are reshaping the city's real estate landscape.",
      content: `Mumbai's real estate future is being shaped by ambitious infrastructure projects that promise to transform connectivity and accessibility across the metropolitan region. As experienced real estate consultants, we analyze these developments' impact on property values.

**Major Infrastructure Projects:**

**1. Mumbai Metro Expansion:**
- Lines 2A, 2B, and 7 changing western suburb connectivity
- Colaba-Bandra-SEEPZ line boosting property values
- Reduced travel time impacting location preferences

**2. Mumbai Coastal Road:**
- Marine Drive to Worli connectivity
- Bandra-Versova sea link extension
- Direct impact on western waterfront properties

**3. Navi Mumbai International Airport:**
- Jewar airport reducing pressure on existing infrastructure
- Navi Mumbai emerging as major growth center
- Property appreciation in surrounding areas

**4. Mumbai Trans-Harbour Link:**
- Connecting Mumbai to Navi Mumbai
- 45-minute reduction in travel time
- Opening new residential and commercial opportunities

**Impact on Real Estate Sectors:**

**Residential Real Estate:**
- Improved connectivity driving demand in previously less accessible areas
- Rental yield improvements in metro-connected locations
- Capital appreciation in infrastructure corridor properties

**Commercial Real Estate:**
- New business districts emerging along metro lines
- Decentralization of commercial activities
- Grade A office space demand in well-connected areas

**Investment Opportunities:**
- Early investment in infrastructure development zones
- Transit-oriented development projects
- Mixed-use properties near metro stations

**Location-Specific Impacts:**

**Andheri-Goregaon:**
- Metro Line 2B enhancing connectivity
- Commercial and residential demand surge
- Premium pricing for metro-adjacent properties

**Worli-Lower Parel:**
- Coastal road improving accessibility
- Luxury segment benefiting most
- Sea-facing properties commanding premium

**Navi Mumbai:**
- Airport project driving massive development
- Affordable housing options with connectivity
- Industrial and commercial growth

**Investment Timeline:**
- Pre-construction phase: Maximum appreciation potential
- Construction phase: Gradual value enhancement
- Post-completion: Stabilized premium pricing

**Regal Estate's Infrastructure Advisory:**
We provide detailed area analysis considering upcoming infrastructure projects, helping clients make informed investment decisions with long-term appreciation potential.

**Market Predictions:**
Based on our 30+ years of experience, properties near completed infrastructure projects typically see 25-40% appreciation within 3-5 years of project completion.

**Investment Recommendations:**
- Focus on metro line corridors
- Consider emerging business districts
- Evaluate pre-launch projects near infrastructure nodes
- Balance current amenities with future potential

Partner with Regal Estate Consultants to leverage infrastructure-driven growth opportunities in Mumbai real estate.`,
      author: "Narendra Punjabi",
      date: "December 15, 2023",
      category: "Infrastructure Impact",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=400&fit=crop",
      tags: ["Infrastructure", "Mumbai Metro", "Future Growth", "Property Investment"]
    }
  ];

  const categories = [
    { name: "Market Analysis", count: 2, icon: TrendingUp },
    { name: "Home Buying Guide", count: 1, icon: Home },
    { name: "Luxury Real Estate", count: 1, icon: Building2 },
    { name: "Commercial Real Estate", count: 1, icon: Calculator },
    { name: "NRI Investment", count: 1, icon: Users },
    { name: "Infrastructure Impact", count: 1, icon: MapPin }
  ];

  const featuredPost = blogPosts[0];
  const recentPosts = blogPosts.slice(1);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Real Estate <span className="text-brand-classic-gold">Insights</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Expert insights, market trends, and investment guidance from Mumbai's trusted 3rd generation realtors
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Post */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-primary mb-8">Featured Article</h2>
              <Card className="overflow-hidden hover:shadow-luxury transition-all duration-300">
                <div className="relative">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-80 object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-brand-maroon text-white">
                    {featuredPost.category}
                  </Badge>
                </div>
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 text-sm text-brand-grey mb-4">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{featuredPost.date}</span>
                    </div>
                    <span>{featuredPost.readTime}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-4">
                    {featuredPost.title}
                  </h3>
                  <p className="text-brand-grey mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {featuredPost.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="border-brand-classic-gold text-brand-classic-gold">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Link to={`/blogs/${featuredPost.id}`}>
                    <Button className="bg-brand-classic-gold text-primary hover:bg-brand-soft-gold">
                      Read Full Article
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Recent Posts */}
            <div>
              <h2 className="text-2xl font-bold text-primary mb-8">Latest Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {recentPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-gold transition-all duration-300">
                    <div className="relative">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                      <Badge className="absolute top-3 left-3 bg-brand-maroon text-white text-xs">
                        {post.category}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 text-xs text-brand-grey mb-3">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{post.date}</span>
                        </div>
                        <span>{post.readTime}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-primary mb-3 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-brand-grey text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="border-brand-classic-gold text-brand-classic-gold text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Link to={`/blogs/${post.id}`}>
                        <Button variant="outline" size="sm" className="border-brand-classic-gold text-brand-classic-gold hover:bg-brand-classic-gold hover:text-primary">
                          Read More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Categories */}
              <Card className="shadow-elegant">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-6">Categories</h3>
                  <div className="space-y-3">
                    {categories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between p-3 hover:bg-secondary/50 rounded-lg transition-colors cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <category.icon className="h-5 w-5 text-brand-classic-gold" />
                          <span className="text-sm font-medium">{category.name}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">{category.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* About Regal Estate */}
              <Card className="shadow-elegant">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-4">About Regal Estate Consultants</h3>
                  <div className="mb-4">
                    <img src="/lovable-uploads/e3e8d4b3-aff7-449c-8663-a9e656c4ed74.png" alt="Regal Estate Consultants" className="h-16 w-auto mb-4" />
                  </div>
                  <p className="text-sm text-brand-grey mb-4">
                    With 30+ years of expertise and 3rd generation realtors, we're Mumbai's trusted partner in premium real estate.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-brand-classic-gold" />
                      <span>Trusted by India's leading developers</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-brand-classic-gold" />
                      <span>5000+ satisfied clients</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-brand-classic-gold" />
                      <span>₹500Cr+ worth delivered</span>
                    </div>
                  </div>
                  <Link to="/contact">
                    <Button className="w-full mt-4 bg-brand-classic-gold text-primary hover:bg-brand-soft-gold">
                      Get Expert Consultation
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Contact CTA */}
              <Card className="bg-gradient-hero text-white">
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-bold mb-2">Need Personalized Advice?</h3>
                  <p className="text-white/90 text-sm mb-4">
                    Connect with our real estate experts for customized investment guidance.
                  </p>
                  <Link to="/contact">
                    <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                      Contact Us
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}