import { useState } from 'react';
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

  const properties = [
    {
      id: 1,
      title: "Luxury Villa in Juhu",
      location: "Juhu, Mumbai",
      price: "₹8.5 Cr",
      originalPrice: "₹9.2 Cr",
      type: "Villa",
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
      type: "Apartment",
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
      type: "Penthouse",
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
      title: "Modern Apartment in Andheri",
      location: "Andheri West, Mumbai",
      price: "₹2.8 Cr",
      originalPrice: "₹3.1 Cr",
      type: "Apartment",
      bedrooms: 2,
      bathrooms: 2,
      area: "1200 sq ft",
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=300&fit=crop",
      features: ["Swimming Pool", "Gym", "Garden", "24x7 Security"],
      rating: 4.4,
      reviews: 12,
      status: "Ready to Move",
      developer: "Godrej Properties"
    },
    {
      id: 5,
      title: "Luxury Villa in Powai",
      location: "Powai, Mumbai",
      price: "₹6.5 Cr",
      originalPrice: "₹7.2 Cr",
      type: "Villa",
      bedrooms: 3,
      bathrooms: 3,
      area: "2800 sq ft",
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=300&fit=crop",
      features: ["Lake View", "Garden", "Parking", "Security"],
      rating: 4.5,
      reviews: 15,
      status: "Under Construction",
      developer: "Kalpataru Limited"
    },
    {
      id: 6,
      title: "Commercial Space in BKC",
      location: "Bandra Kurla Complex, Mumbai",
      price: "₹3.5 Cr",
      originalPrice: "₹4.0 Cr",
      type: "Commercial",
      bedrooms: 0,
      bathrooms: 2,
      area: "2500 sq ft",
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=300&fit=crop",
      features: ["Metro Connectivity", "Security", "Elevator", "Prime Location"],
      rating: 4.7,
      reviews: 28,
      status: "Ready to Move",
      developer: "Lodha Group"
    }
  ];

  const partnerDevelopers = [
    "Lodha Group",
    "Godrej Properties",
    "Oberoi Realty",
    "Hiranandani Group", 
    "Kalpataru Limited"
  ];

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !propertyType || propertyType === 'all' || property.type === propertyType;
    const matchesLocation = !location || location === 'all' || property.location.includes(location);
    
    return matchesSearch && matchesType && matchesLocation;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Premium <span className="text-brand-classic-gold">Properties</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Discover luxury living with our curated collection of premium properties in Mumbai
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
                  <SelectItem value="Villa">Villa</SelectItem>
                  <SelectItem value="Apartment">Apartment</SelectItem>
                  <SelectItem value="Penthouse">Penthouse</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
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
                Showing premium properties in Mumbai
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
                      {property.type}
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
                      <div className="flex items-center">
                        <BedDouble className="h-4 w-4 mr-1" />
                        {property.bedrooms > 0 ? `${property.bedrooms} Bed` : 'Office'}
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        {property.bathrooms} Bath
                      </div>
                      <div className="flex items-center">
                        <Square className="h-4 w-4 mr-1" />
                        {property.area}
                      </div>
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
              Trusted partnerships with Mumbai's leading developers
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {partnerDevelopers.map((developer, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-gold transition-all duration-300">
                <CardContent className="p-0">
                  <div className="h-16 bg-gradient-accent rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">
                      {developer.split(' ')[0]}
                    </span>
                  </div>
                  <h3 className="font-semibold text-primary text-sm">
                    {developer}
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