
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
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
  Star,
  ExternalLink,
  Building2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface Property {
  id: string;
  title: string;
  description?: string;
  location?: string;
  property_type?: string;
  bedrooms?: string; // Changed to string
  bathrooms?: string; // Changed to string
  area_sqft?: number;
  image_url?: string;
  additional_images?: string[];
  featured: boolean;
  status: string;
  price?: string; // Changed to string
  created_at: string;
}

export default function PropertiesDatabase() {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [propertyType, setPropertyType] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get URL parameters to determine if showing residential or commercial
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const typeParam = urlParams.get('type');
    if (typeParam === 'residential') {
      setPropertyType('Residential');
    } else if (typeParam === 'commercial') {
      setPropertyType('Commercial');
    }
  }, [location.search]);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
        // Removed any limit() to show all properties

      if (error) {
        console.error('Supabase error:', error);
        setProperties([]);
      } else {
        setProperties(data || []);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (property.location?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         (property.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesType = propertyType === 'all' || property.property_type === propertyType;
    const matchesLocation = locationFilter === 'all' || (property.location?.includes(locationFilter) || false);
    
    return matchesSearch && matchesType && matchesLocation;
  });

  const openPropertyDetail = (property: Property) => {
    setSelectedProperty(property);
    setCurrentImageIndex(0);
  };

  const closePropertyDetail = () => {
    setSelectedProperty(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (!selectedProperty) return;
    const allImages = [selectedProperty.image_url, ...(selectedProperty.additional_images || [])].filter(Boolean);
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    if (!selectedProperty) return;
    const allImages = [selectedProperty.image_url, ...(selectedProperty.additional_images || [])].filter(Boolean);
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const isCommercialSection = propertyType === 'Commercial';
  const isResidentialSection = propertyType === 'Residential';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-classic-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className={`relative overflow-hidden text-white py-20 ${
        isCommercialSection ? 'bg-gradient-to-br from-brand-navy via-brand-grey to-brand-beige-dark' : 
        isResidentialSection ? 'bg-gradient-beige min-h-[70vh] flex items-center' : 
        'bg-gradient-hero'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8">
            <h1 className={`text-4xl md:text-6xl font-bold mb-4 animate-slide-down ${
              (isResidentialSection || isCommercialSection) ? 'text-brand-navy' : 'text-white'
            }`}>
              {isCommercialSection ? 'Commercial' : isResidentialSection ? 'Residential' : 'Premium'} 
              <span className="text-brand-classic-gold animate-pulse"> Properties</span>
            </h1>
            <p className={`text-xl md:text-2xl max-w-3xl mx-auto animate-slide-up [animation-delay:300ms] ${
              (isResidentialSection || isCommercialSection) ? 'text-brand-beige-dark' : 'text-white/90'
            }`}>
              {isCommercialSection 
                ? 'Discover prime commercial spaces and investment opportunities in Mumbai\'s business districts'
                : isResidentialSection
                ? 'Find your dream home with our curated collection of luxury residential properties in Mumbai'
                : 'Discover luxury living with our curated collection of premium properties in Mumbai'
              }
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter - Made visible again */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger>
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Residential">Residential</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="land">Land</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="Mumbai">Mumbai</SelectItem>
                <SelectItem value="Andheri">Andheri</SelectItem>
                <SelectItem value="Bandra">Bandra</SelectItem>
                <SelectItem value="Juhu">Juhu</SelectItem>
                <SelectItem value="Worli">Worli</SelectItem>
              </SelectContent>
            </Select>
            
            <Button className="bg-brand-classic-gold hover:bg-brand-soft-gold text-white">
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters ({filteredProperties.length})
            </Button>
          </div>
        </div>
      </section>

      {/* Properties Grid - Showing all properties */}
      <section className={`py-16 ${
        isCommercialSection ? 'bg-gradient-to-br from-brand-beige-light to-brand-cream' :
        isResidentialSection ? 'bg-gradient-to-br from-brand-cream via-brand-beige-light to-brand-beige' : 
        'bg-background'
      } transition-all duration-700`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8 animate-fade-in">
            <div>
              <h2 className={`text-2xl font-bold ${(isResidentialSection || isCommercialSection) ? 'text-brand-navy' : 'text-primary'} animate-slide-up`}>
                {filteredProperties.length} Properties Found
              </h2>
              <p className={`${(isResidentialSection || isCommercialSection) ? 'text-brand-beige-dark' : 'text-brand-grey'} animate-slide-up [animation-delay:200ms]`}>
                {isCommercialSection 
                  ? 'Showing all commercial properties and investment opportunities in Mumbai'
                  : isResidentialSection
                  ? 'Showing all residential properties and luxury homes in Mumbai'
                  : 'Showing all premium properties in Mumbai'
                }
              </p>
            </div>
            
            <Select defaultValue="newest">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredProperties.length === 0 ? (
            <div className="text-center py-16">
              <Building2 className="h-24 w-24 text-brand-beige-dark mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-brand-navy mb-4">No Properties Found</h3>
              <p className="text-brand-beige-dark mb-6">
                No properties match your current filters. Try adjusting your search criteria.
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setPropertyType('all');
                  setLocationFilter('all');
                }}
                className="bg-brand-classic-gold hover:bg-brand-soft-gold text-white"
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property, index) => (
                <Card 
                  key={property.id} 
                  className={`overflow-hidden hover:shadow-luxury transition-all duration-300 group animate-fade-in cursor-pointer ${
                    (isResidentialSection || isCommercialSection) 
                      ? 'bg-brand-cream border-brand-beige hover:border-brand-beige-dark' 
                      : 'bg-card'
                  } hover:scale-105 hover:-translate-y-2`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => openPropertyDetail(property)}
                >
                  <div className="relative">
                    {property.image_url ? (
                      <img
                        src={property.image_url}
                        alt={property.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-64 bg-brand-beige-light flex items-center justify-center">
                        <Building2 className="h-16 w-16 text-brand-beige-dark" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge 
                        className={`${
                          (isResidentialSection || isCommercialSection)
                            ? 'bg-brand-beige text-brand-navy animate-pulse'
                            : 'bg-brand-maroon text-white'
                        }`}
                      >
                        {property.status}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <Button size="sm" variant="outline" className="bg-white/90 border-white hover:bg-white hover:scale-110 transition-all duration-200">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="bg-white/90 border-white hover:bg-white hover:scale-110 transition-all duration-200">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <Badge 
                        variant="outline" 
                        className={`${
                          (isResidentialSection || isCommercialSection)
                            ? 'bg-brand-cream text-brand-navy border-brand-beige'
                            : 'bg-white text-primary border-white'
                        } animate-slide-up`}
                      >
                        {property.property_type || 'Property'}
                      </Badge>
                    </div>
                    {/* Show indicator if property has multiple images */}
                    {property.additional_images && property.additional_images.length > 0 && (
                      <div className="absolute bottom-4 right-4">
                        <Badge className="bg-black/60 text-white text-xs">
                          +{property.additional_images.length + 1} photos
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                        <span className="text-sm text-brand-grey ml-1">
                          4.5 (15 reviews)
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-brand-classic-gold">
                          {/* Display price as text */}
                          {property.price || 'Price on Request'}
                        </div>
                        <div className="text-sm text-brand-beige-dark">Contact for Details</div>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-primary mb-2 group-hover:text-brand-maroon transition-colors">
                      {property.title}
                    </h3>
                    
                    {property.location && (
                      <div className="flex items-center text-brand-grey mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{property.location}</span>
                      </div>
                    )}

                    {property.description && (
                      <p className="text-sm text-brand-grey mb-4 line-clamp-2">
                        {property.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between mb-4 text-sm text-brand-grey">
                      <div className="flex items-center space-x-4">
                        {property.bedrooms && (
                          <div className="flex items-center">
                            <BedDouble className="h-4 w-4 mr-1" />
                            {/* Display bedrooms as text */}
                            {property.bedrooms}
                          </div>
                        )}
                        {property.bathrooms && (
                          <div className="flex items-center">
                            <Bath className="h-4 w-4 mr-1" />
                            {/* Display bathrooms as text */}
                            {property.bathrooms}
                          </div>
                        )}
                        {property.area_sqft && (
                          <div className="flex items-center">
                            <Square className="h-4 w-4 mr-1" />
                            {property.area_sqft} sq ft
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        className={`flex-1 ${
                          (isResidentialSection || isCommercialSection)
                            ? 'bg-brand-classic-gold text-white hover:bg-brand-soft-gold'
                            : 'bg-brand-maroon text-white hover:bg-brand-maroon/90'
                        } hover:scale-105 transition-all duration-200`}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/contact');
                        }}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Enquire Now
                      </Button>
                      <Button 
                        variant="outline" 
                        className={`flex-1 ${
                          (isResidentialSection || isCommercialSection)
                            ? 'border-brand-beige text-brand-navy hover:bg-brand-beige-light'
                            : 'border-brand-grey text-primary hover:bg-brand-grey/10'
                        } hover:scale-105 transition-all duration-200`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Property Detail Modal with Image Gallery */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={closePropertyDetail}>
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              {/* Image Gallery */}
              <div className="relative h-96">
                {(() => {
                  const allImages = [selectedProperty.image_url, ...(selectedProperty.additional_images || [])].filter(Boolean);
                  return allImages.length > 0 ? (
                    <>
                      <img
                        src={allImages[currentImageIndex]}
                        alt={selectedProperty.title}
                        className="w-full h-full object-cover"
                      />
                      {allImages.length > 1 && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                            onClick={prevImage}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                            onClick={nextImage}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                            {currentImageIndex + 1} / {allImages.length}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Building2 className="h-24 w-24 text-gray-400" />
                    </div>
                  );
                })()}
              </div>
              
              {/* Close Button */}
              <Button
                variant="outline"
                size="sm"
                className="absolute top-4 right-4 bg-white/90 hover:bg-white"
                onClick={closePropertyDetail}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Property Details */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-brand-navy mb-2">{selectedProperty.title}</h2>
                  {selectedProperty.location && (
                    <div className="flex items-center text-brand-grey mb-4">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>{selectedProperty.location}</span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-brand-classic-gold mb-2">
                    {selectedProperty.price || 'Price on Request'}
                  </div>
                  <Badge className="bg-brand-beige text-brand-navy">
                    {selectedProperty.status}
                  </Badge>
                </div>
              </div>

              {selectedProperty.description && (
                <p className="text-brand-grey mb-6">{selectedProperty.description}</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {selectedProperty.bedrooms && (
                  <div className="flex items-center p-4 bg-brand-beige-light rounded-lg">
                    <BedDouble className="h-8 w-8 text-brand-navy mr-3" />
                    <div>
                      <div className="font-semibold text-brand-navy">Bedrooms</div>
                      <div className="text-brand-grey">{selectedProperty.bedrooms}</div>
                    </div>
                  </div>
                )}
                {selectedProperty.bathrooms && (
                  <div className="flex items-center p-4 bg-brand-beige-light rounded-lg">
                    <Bath className="h-8 w-8 text-brand-navy mr-3" />
                    <div>
                      <div className="font-semibold text-brand-navy">Bathrooms</div>
                      <div className="text-brand-grey">{selectedProperty.bathrooms}</div>
                    </div>
                  </div>
                )}
                {selectedProperty.area_sqft && (
                  <div className="flex items-center p-4 bg-brand-beige-light rounded-lg">
                    <Square className="h-8 w-8 text-brand-navy mr-3" />
                    <div>
                      <div className="font-semibold text-brand-navy">Area</div>
                      <div className="text-brand-grey">{selectedProperty.area_sqft} sq ft</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-4">
                <Button 
                  className="flex-1 bg-brand-classic-gold text-white hover:bg-brand-soft-gold"
                  onClick={() => navigate('/contact')}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Agent
                </Button>
                <Button variant="outline" className="flex-1 border-brand-beige text-brand-navy hover:bg-brand-beige-light">
                  <Heart className="h-4 w-4 mr-2" />
                  Save Property
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
