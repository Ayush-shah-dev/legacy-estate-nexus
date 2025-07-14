import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  MapPin, 
  BedDouble, 
  Bath, 
  Square, 
  Heart,
  Phone,
  Eye,
  Star
} from 'lucide-react';

export default function Properties() {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [location, setLocation] = useState('');
  
  // Get URL parameters to determine if showing residential or commercial
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const typeParam = urlParams.get('type');
    if (typeParam === 'residential') {
      setPropertyType('Residential');
    } else if (typeParam === 'commercial') {
      setPropertyType('Commercial');
    }
  }, []);

  const properties = [
    {
      id: 1,
      title: "Luxury Villa in Juhu",
      location: "Juhu, Mumbai",
      price: "₹8.5 Cr",
      originalPrice: "₹9.2 Cr",
      type: "Residential",
      subType: "Villa",
      bedrooms: 4,
      bathrooms: 5,
      area: "4500 sq ft",
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=300&fit=crop",
      features: ["Swimming Pool", "Sea View", "Garden", "Parking"],
      rating: 4.8,
      reviews: 24,
      status: "Ready to Move",
      developer: "Lodha Group"
    },
    {
      id: 2,
      title: "Premium Apartment in Bandra",
      location: "Bandra West, Mumbai",
      price: "₹4.2 Cr",
      originalPrice: "₹4.8 Cr",
      type: "Residential",
      subType: "Apartment",
      bedrooms: 3,
      bathrooms: 3,
      area: "1800 sq ft",
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=300&fit=crop",
      features: ["Gym", "Club House", "Parking", "Power Backup"],
      rating: 4.6,
      reviews: 18,
      status: "Under Construction",
      developer: "Oberoi Realty"
    },
    {
      id: 3,
      title: "Sea View Penthouse in Worli",
      location: "Worli, Mumbai",
      price: "₹12.5 Cr",
      originalPrice: "₹14.0 Cr",
      type: "Residential",
      subType: "Penthouse",
      bedrooms: 4,
      bathrooms: 4,
      area: "3200 sq ft",
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=300&fit=crop",
      features: ["Sea View", "Private Terrace", "Jacuzzi", "Premium Finishes"],
      rating: 4.9,
      reviews: 32,
      status: "Ready to Move",
      developer: "Hiranandani Group"
    },
    {
      id: 4,
      title: "Corporate Office in BKC",
      location: "Bandra Kurla Complex, Mumbai",
      price: "₹3.5 Cr",
      originalPrice: "₹4.0 Cr",
      type: "Commercial",
      subType: "Office Space",
      bedrooms: 0,
      bathrooms: 2,
      area: "2500 sq ft",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&h=300&fit=crop",
      features: ["Metro Connectivity", "24/7 Security", "High-speed Internet", "Conference Rooms"],
      rating: 4.7,
      reviews: 28,
      status: "Ready to Move",
      developer: "Lodha Group"
    },
    {
      id: 5,
      title: "Premium Retail Space in Palladium Mall",
      location: "Lower Parel, Mumbai",
      price: "₹2.8 Cr",
      originalPrice: "₹3.2 Cr",
      type: "Commercial",
      subType: "Retail Space",
      bedrooms: 0,
      bathrooms: 1,
      area: "1200 sq ft",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=300&fit=crop",
      features: ["High Footfall", "Prime Location", "Parking Available", "24/7 Security"],
      rating: 4.5,
      reviews: 15,
      status: "Available for Lease",
      developer: "Palladium Group"
    },
    {
      id: 6,
      title: "IT Office Space in Powai",
      location: "Powai, Mumbai",
      price: "₹1.8 Cr",
      originalPrice: "₹2.1 Cr",
      type: "Commercial",
      subType: "IT Office",
      bedrooms: 0,
      bathrooms: 3,
      area: "3000 sq ft",
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=500&h=300&fit=crop",
      features: ["Tech Park Location", "Flexible Layout", "Cafeteria", "Ample Parking"],
      rating: 4.6,
      reviews: 22,
      status: "Ready to Occupy",
      developer: "Hiranandani Group"
    },
    {
      id: 7,
      title: "Warehouse in Bhiwandi",
      location: "Bhiwandi, Mumbai",
      price: "₹4.2 Cr",
      originalPrice: "₹4.8 Cr",
      type: "Commercial",
      subType: "Warehouse",
      bedrooms: 0,
      bathrooms: 2,
      area: "25000 sq ft",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&h=300&fit=crop",
      features: ["Highway Access", "Loading Docks", "Security Systems", "Large Space"],
      rating: 4.3,
      reviews: 18,
      status: "Ready for Use",
      developer: "Industrial Realty"
    },
    {
      id: 8,
      title: "Medical Center Space in Andheri",
      location: "Andheri East, Mumbai",
      price: "₹1.5 Cr",
      originalPrice: "₹1.7 Cr",
      type: "Commercial",
      subType: "Medical Space",
      bedrooms: 0,
      bathrooms: 4,
      area: "1800 sq ft",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=500&h=300&fit=crop",
      features: ["Medical Zoning", "Parking", "Accessibility Compliant", "Prime Medical Hub"],
      rating: 4.4,
      reviews: 12,
      status: "Available",
      developer: "Healthcare Realty"
    }
  ];

  const partnerDevelopers = [
    {
      name: "DLF",
      logo: "/lovable-uploads/a101aae9-2526-4b11-bf6b-62834c10f05a.png"
    },
    {
      name: "Godrej Properties",
      logo: "/lovable-uploads/84e06a40-cc48-4041-a0a6-2259dd178e35.png"
    },
    {
      name: "Lodha",
      logo: "/lovable-uploads/2f60dc4d-2374-4ea6-bcda-23a90e3fda86.png"
    },
    {
      name: "Adani Realty",
      logo: "/lovable-uploads/f398b657-ec1a-45cd-8f06-db3ea42e86c6.png"
    },
    {
      name: "Rustomjee",
      logo: "/lovable-uploads/2c394c2f-1d8f-47e6-87ef-bc538d3881a8.png"
    },
    {
      name: "Mahindra Lifespaces",
      logo: "/lovable-uploads/21130215-bbef-4e37-9770-dd46a8ea2827.png"
    }
  ];

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !propertyType || propertyType === 'all' || property.type === propertyType || property.subType === propertyType;
    const matchesLocation = !location || location === 'all' || property.location.includes(location);
    
    return matchesSearch && matchesType && matchesLocation;
  });

  const isCommercialSection = propertyType === 'Commercial';
  const isResidentialSection = propertyType === 'Residential';

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {isCommercialSection ? 'Commercial' : isResidentialSection ? 'Residential' : 'Premium'} <span className="text-brand-classic-gold">Properties</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              {isCommercialSection 
                ? 'Discover prime commercial spaces and investment opportunities in Mumbai\'s business districts'
                : isResidentialSection
                ? 'Find your dream home with our curated collection of luxury residential properties in Mumbai'
                : 'Discover luxury living with our curated collection of premium properties in Mumbai'
              }
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/90"
                />
              </div>
              
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="bg-white/90">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {isCommercialSection ? (
                    <>
                      <SelectItem value="Commercial">All Commercial</SelectItem>
                      <SelectItem value="Office Space">Office Space</SelectItem>
                      <SelectItem value="Retail Space">Retail Space</SelectItem>
                      <SelectItem value="Warehouse">Warehouse</SelectItem>
                      <SelectItem value="Medical Space">Medical Space</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="Residential">All Residential</SelectItem>
                      <SelectItem value="Villa">Villa</SelectItem>
                      <SelectItem value="Apartment">Apartment</SelectItem>
                      <SelectItem value="Penthouse">Penthouse</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>

              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="bg-white/90">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Juhu">Juhu</SelectItem>
                  <SelectItem value="Bandra">Bandra</SelectItem>
                  <SelectItem value="Worli">Worli</SelectItem>
                  <SelectItem value="Andheri">Andheri</SelectItem>
                  <SelectItem value="Powai">Powai</SelectItem>
                  <SelectItem value="Bandra Kurla Complex">BKC</SelectItem>
                  <SelectItem value="Lower Parel">Lower Parel</SelectItem>
                  <SelectItem value="Bhiwandi">Bhiwandi</SelectItem>
                </SelectContent>
              </Select>

              <Button className="bg-brand-classic-gold text-primary hover:bg-brand-soft-gold">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-primary">
                {filteredProperties.length} Properties Found
              </h2>
              <p className="text-brand-grey">
                {isCommercialSection 
                  ? 'Showing commercial properties and investment opportunities in Mumbai'
                  : isResidentialSection
                  ? 'Showing residential properties and luxury homes in Mumbai'
                  : 'Showing premium properties in Mumbai'
                }
              </p>
            </div>
            
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-luxury transition-all duration-300 group">
                <div className="relative">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-brand-maroon text-white">
                      {property.status}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Button size="sm" variant="outline" className="bg-white/90 border-white hover:bg-white">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="bg-white/90 border-white hover:bg-white">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <Badge variant="outline" className="bg-white text-primary border-white">
                      {property.subType || property.type}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.floor(property.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className="text-sm text-brand-grey ml-1">
                        {property.rating} ({property.reviews} reviews)
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-primary mb-2 group-hover:text-brand-maroon transition-colors">
                    {property.title}
                  </h3>
                  
                  <div className="flex items-center text-brand-grey mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{property.location}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-brand-classic-gold">
                        {property.price}
                      </span>
                      {property.originalPrice && (
                        <span className="text-sm text-brand-grey line-through ml-2">
                          {property.originalPrice}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-brand-grey">
                      by {property.developer}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4 text-sm text-brand-grey">
                    <div className="flex items-center space-x-4">
                      {property.type === 'Commercial' ? (
                        <>
                          <div className="flex items-center">
                            <Square className="h-4 w-4 mr-1" />
                            {property.area}
                          </div>
                          <div className="flex items-center">
                            <Bath className="h-4 w-4 mr-1" />
                            {property.bathrooms} Facilities
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center">
                            <BedDouble className="h-4 w-4 mr-1" />
                            {property.bedrooms > 0 ? `${property.bedrooms} Bed` : 'Studio'}
                          </div>
                          <div className="flex items-center">
                            <Bath className="h-4 w-4 mr-1" />
                            {property.bathrooms} Bath
                          </div>
                          <div className="flex items-center">
                            <Square className="h-4 w-4 mr-1" />
                            {property.area}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {property.features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-brand-classic-gold text-brand-classic-gold">
                          {feature}
                        </Badge>
                      ))}
                      {property.features.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{property.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button className="flex-1 bg-primary hover:bg-brand-navy">
                      View Details
                    </Button>
                    <Button variant="outline" className="border-brand-classic-gold text-brand-classic-gold hover:bg-brand-classic-gold hover:text-primary">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Developers */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Our Partner Developers
            </h2>
            <p className="text-xl text-brand-grey">
              {isCommercialSection 
                ? 'Trusted partnerships with Mumbai\'s leading commercial developers'
                : 'Trusted partnerships with Mumbai\'s leading residential developers'
              }
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            {partnerDevelopers.map((developer, index) => (
              <Card key={index} className="p-4 text-center hover:shadow-gold transition-all duration-300 bg-white">
                <CardContent className="p-0">
                  <div className="h-20 flex items-center justify-center mb-3">
                    <img 
                      src={developer.logo} 
                      alt={`${developer.name} logo`}
                      className="max-h-16 max-w-full object-contain"
                    />
                  </div>
                  <h3 className="font-semibold text-primary text-sm">
                    {developer.name}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-classic-gold">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Didn't Find What You're Looking For?
          </h2>
          <p className="text-lg text-primary/80 mb-8">
            Our property experts can help you find the perfect property that matches your exact requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary text-white hover:bg-brand-navy">
              <Phone className="mr-2 h-5 w-5" />
              Call: +91 99031 88690
            </Button>
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white">
              Custom Property Search
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}