import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  ChevronRight,
  X,
  Pause,
  Play
} from 'lucide-react';

interface Property {
  id: string;
  title: string;
  description?: string;
  location?: string;
  property_type?: string;
  bedrooms?: string;
  bathrooms?: string;
  area_sqft?: string;
  image_url?: string;
  additional_images?: string[];
  featured: boolean;
  status: string;
  price?: string;
  project_details?: string;
  youtube_url?: string;
  created_at: string;
}

// Property Card Image Gallery Component
const PropertyImageGallery = ({ property }: { property: Property }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const allImages = [property.image_url, ...(property.additional_images || [])].filter(Boolean);

  useEffect(() => {
    if (allImages.length <= 1) return;

    if (isAutoPlaying && !isHovered) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % allImages.length);
      }, 3000); // Auto-scroll every 3 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, isHovered, allImages.length]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  if (allImages.length === 0) {
    return (
      <div className="w-full h-64 bg-brand-beige-light flex items-center justify-center">
        <Building2 className="h-16 w-16 text-brand-beige-dark" />
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-64 overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={allImages[currentIndex]}
        alt={`${property.title} - Image ${currentIndex + 1}`}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />

      {allImages.length > 1 && (
        <>
          {/* Navigation Controls */}
          <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              className="bg-white/90 hover:bg-white border-white hover:scale-110 transition-all duration-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              className="bg-white/90 hover:bg-white border-white hover:scale-110 transition-all duration-200"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Auto-play Control */}
          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAutoPlay}
              className="bg-black/60 hover:bg-black/80 border-transparent text-white"
            >
              {isAutoPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            </Button>
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-black/60 text-white text-xs">
              {currentIndex + 1} / {allImages.length}
            </Badge>
          </div>

          {/* Progress Indicators */}
          <div className="absolute bottom-2 right-2 flex space-x-1">
            {allImages.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsAutoPlaying(false);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>

          {/* Auto-play Progress Bar */}
          {isAutoPlaying && !isHovered && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20">
              <div className="h-full bg-white/80 animate-[progress-bar_3s_linear_infinite]" />
            </div>
          )}
        </>
      )}

      <style>
        {`
          @keyframes progress-bar {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}
      </style>
    </div>
  );
};

export default function PropertiesDatabase() {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [propertyType, setPropertyType] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
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

  const formatProjectDetails = (details: string): string => {
    if (!details) return '';
    
    // Split into lines and process each line
    const lines = details.split('\n');
    const formattedLines = lines.map(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return line;
      
      // Check if line looks like it should be a bullet point
      if (!trimmedLine.startsWith('•') && 
          !trimmedLine.startsWith('*') && 
          !trimmedLine.startsWith('-') &&
          (trimmedLine.match(/^[A-Z][a-z]+ [a-z]+/) || // "Swimming pool", "Gym facilities"
           trimmedLine.match(/^24\/7/) || // "24/7 security"
           trimmedLine.includes('sqft') ||
           trimmedLine.includes('parking') ||
           trimmedLine.includes('amenities') ||
           trimmedLine.includes('facilities'))) {
        return `• ${trimmedLine}`;
      }
      
      return line;
    });
    
    return formattedLines.join('\n');
  };

  const parseProjectDetails = (details: string) => {
    if (!details) return { header1: 'Features', items1: [], header2: 'Amenities', items2: [] };
    
    const formatted = formatProjectDetails(details);
    const lines = formatted.split('\n').filter(line => line.trim());
    
    // Try to find headers (lines that start with ### or are all caps)
    const headers = lines.filter(line => 
      line.startsWith('###') || 
      (line === line.toUpperCase() && line.length > 3 && !line.startsWith('•'))
    );
    
    let header1 = 'Features';
    let header2 = 'Amenities';
    let items1: string[] = [];
    let items2: string[] = [];
    
    if (headers.length >= 1) {
      header1 = headers[0].replace('###', '').trim();
    }
    if (headers.length >= 2) {
      header2 = headers[1].replace('###', '').trim();
    }
    
    // Split items between two sections
    const bulletPoints = lines.filter(line => 
      line.startsWith('•') || line.startsWith('*') || line.startsWith('-')
    ).map(line => line.replace(/^[•*-]\s*/, ''));
    
    const midPoint = Math.ceil(bulletPoints.length / 2);
    items1 = bulletPoints.slice(0, midPoint);
    items2 = bulletPoints.slice(midPoint);
    
    return { header1, items1, header2, items2 };
  };

  const filteredProperties = properties.filter(property => {
    // Determine current section from URL
    const urlParams = new URLSearchParams(location.search);
    const typeParam = urlParams.get('type');
    const isCommercial = typeParam === 'commercial';
    const isResidential = typeParam === 'residential';

    // Enforce type per tab
    let matchesType = true;
    const typeValue = (property.property_type || '').toLowerCase();
    if (isCommercial) {
      matchesType = typeValue === 'commercial';
    } else if (isResidential) {
      // Show everything that's not commercial
      matchesType = typeValue !== 'commercial';
    } else if (propertyType !== 'all') {
      matchesType = property.property_type === propertyType;
    }

    // On commercial tab: ignore search/location filters completely
    if (isCommercial) {
      return matchesType;
    }

    // Otherwise, apply search and location filters normally
    const matchesSearch = property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (property.location?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         (property.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesLocation = locationFilter === 'all' || (property.location?.includes(locationFilter) || false);
    
    return matchesSearch && matchesType && matchesLocation;
  });

  // Sort properties based on selected option
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'price-low':
        // Handle text prices - put "Price on Request" at the end
        if (!a.price || a.price === 'Price on Request') return 1;
        if (!b.price || b.price === 'Price on Request') return -1;
        const priceA = parseFloat(a.price.replace(/[^\d.]/g, '')) || 0;
        const priceB = parseFloat(b.price.replace(/[^\d.]/g, '')) || 0;
        return priceA - priceB;
      case 'price-high':
        if (!a.price || a.price === 'Price on Request') return 1;
        if (!b.price || b.price === 'Price on Request') return -1;
        const priceHighA = parseFloat(a.price.replace(/[^\d.]/g, '')) || 0;
        const priceHighB = parseFloat(b.price.replace(/[^\d.]/g, '')) || 0;
        return priceHighB - priceHighA;
      default:
        return 0;
    }
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

  const getPropertyDetails = (property: Property) => {
    const isCommercial = property.property_type?.toLowerCase() === 'commercial';
    
    if (isCommercial) {
      // For commercial properties, show custom details
      return [
        property.bedrooms && { icon: Building2, label: property.bedrooms },
        property.bathrooms && { icon: Building2, label: property.bathrooms },
        property.area_sqft && { icon: Square, label: property.area_sqft }
      ].filter(Boolean);
    } else {
      // For residential properties, show traditional bedroom/bathroom info
      return [
        property.bedrooms && { icon: BedDouble, label: property.bedrooms },
        property.bathrooms && { icon: Bath, label: property.bathrooms },
        property.area_sqft && { icon: Square, label: property.area_sqft }
      ].filter(Boolean);
    }
  };

  const urlParams = new URLSearchParams(location.search);
  const typeParam = urlParams.get('type');
  const isCommercialSection = typeParam === 'commercial';
  const isResidentialSection = typeParam === 'residential';

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
        isResidentialSection ? 'bg-gradient-to-br from-brand-navy via-brand-grey to-brand-beige-dark' : 
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
                ? 'Discover prime residential properties and luxury homes in Mumbai\'s finest neighborhoods'
                : 'Discover luxury living with our curated collection of premium properties in Mumbai'
              }
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter - hidden entirely on Commercial tab */}
      {!isCommercialSection && (
        <section className="py-8 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {!isCommercialSection && !isResidentialSection && (
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
              )}
              
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
            </div>
          </div>
        </section>
      )}

      {/* Properties Grid */}
      <section className={`py-16 ${
        isCommercialSection ? 'bg-gradient-to-br from-brand-beige-light to-brand-cream' :
        isResidentialSection ? 'bg-gradient-to-br from-brand-beige-light to-brand-cream' : 
        'bg-background'
      } transition-all duration-700`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8 animate-fade-in">
            <div>
              <h2 className={`text-2xl font-bold ${(isResidentialSection || isCommercialSection) ? 'text-brand-navy' : 'text-primary'} animate-slide-up`}>
                {sortedProperties.length} Properties Found
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
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {sortedProperties.length === 0 ? (
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
              {sortedProperties.map((property, index) => (
                <Card 
                  key={property.id} 
                  className={`overflow-hidden hover:shadow-luxury transition-all duration-300 group animate-fade-in cursor-pointer flex flex-col h-full ${
                    (isResidentialSection || isCommercialSection) 
                      ? 'bg-brand-cream border-brand-beige hover:border-brand-beige-dark' 
                      : 'bg-card'
                  } hover:scale-105 hover:-translate-y-2`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => openPropertyDetail(property)}
                >
                  <div className="relative">
                    {/* Replace the simple image with the PropertyImageGallery component */}
                    <PropertyImageGallery property={property} />
                    
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
                    {property.additional_images && property.additional_images.length > 0 && (
                      <div className="absolute bottom-4 right-4">
                        <Badge className="bg-black/60 text-white text-xs">
                          +{property.additional_images.filter(Boolean).length + 1} photos
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6 flex flex-col flex-1">
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
                        <div className="text-lg font-bold text-brand-classic-gold">
                          {property.price || 'Price on Request'}
                        </div>
                        <div className="text-xs text-brand-beige-dark">Contact for Details</div>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-primary mb-2 group-hover:text-brand-maroon transition-colors line-clamp-2">
                      {property.title}
                    </h3>
                    
                    {property.location && (
                      <div className="flex items-center text-brand-grey mb-3">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="text-sm truncate">{property.location}</span>
                      </div>
                    )}

                    {property.description && (
                      <p className="text-sm text-brand-grey mb-3 line-clamp-2 flex-shrink-0">
                        {property.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between mb-4 text-sm text-brand-grey flex-shrink-0">
                      <div className="flex items-center space-x-4">
                        {getPropertyDetails(property).map((detail, idx) => (
                          <div key={idx} className="flex items-center">
                            <detail.icon className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{detail.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Project Details Preview - Clean & Minimal */}
                    {property.project_details && (
                      <div className="mb-4">
                        <div className="text-xs text-brand-grey space-y-1">
                          {(() => {
                            const formatted = formatProjectDetails(property.project_details);
                            const lines = formatted.split('\n').filter(line => line.trim());
                            const bulletPoints = lines.filter(line => 
                              line.startsWith('•') || line.startsWith('*') || line.startsWith('-')
                            );
                            
                            return bulletPoints.length > 0 ? (
                              <ScrollArea className="max-h-32 w-full"> {/* Increase height or remove for all points */}
                                <div className="space-y-0.5 pr-4">
                                  {bulletPoints.map((point, idx) => (
                                    <div key={idx} className="flex items-start">
                                      <span className="text-brand-classic-gold mr-2 mt-0.5 flex-shrink-0 text-xs">•</span>
                                      <span className="text-xs">
                                        {point.replace(/^[•*-]\s*/, '')}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </ScrollArea>
                            ) : null;
                          })()}
                        </div>
                      </div>
                    )}

                    {/* Buttons - Fixed at bottom */}
                    <div className="flex space-x-2 mt-auto pt-2">
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
                        Contact Us
                      </Button>
                      {property.youtube_url && (
                        <Button 
                          variant="outline" 
                          className={`${
                            (isResidentialSection || isCommercialSection)
                              ? 'border-red-500 text-red-500 hover:bg-red-50'
                              : 'border-red-500 text-red-500 hover:bg-red-50'
                          } hover:scale-105 transition-all duration-200`}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(property.youtube_url, '_blank');
                          }}
                          title="Watch Property Video"
                        >
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                          </svg>
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        className={`${
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

      {/* Property Detail Modal with Enhanced Image Gallery */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={closePropertyDetail}>
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
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
              
              <Button
                variant="outline"
                size="sm"
                className="absolute top-4 right-4 bg-white/90 hover:bg-white"
                onClick={closePropertyDetail}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

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

              {selectedProperty.project_details && (
                <div className="mb-6 p-4 bg-brand-beige-light rounded-lg">
                  <h3 className="text-lg font-semibold text-brand-navy mb-3">Project Details & Amenities</h3>
                  <ScrollArea className="h-48 w-full">
                    <ul className="space-y-1 text-sm text-brand-grey pr-4">
                      {(() => {
                        const details = parseProjectDetails(selectedProperty.project_details || '');
                        // Combine both arrays for single column
                        const allItems = [...details.items1, ...details.items2];
                        return allItems.length > 0 ? (
                          allItems.map((item, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-brand-classic-gold mr-2 mt-1 flex-shrink-0">•</span>
                              <span>{item}</span>
                            </li>
                          ))
                        ) : (
                          <div className="whitespace-pre-line text-brand-grey text-sm">
                            {formatProjectDetails(selectedProperty.project_details)}
                          </div>
                        );
                      })()}
                    </ul>
                  </ScrollArea>
                </div>
              )}

              {(() => {
                const details = parseProjectDetails(selectedProperty.project_details || '');
                const propertyDetails = getPropertyDetails(selectedProperty);
                
                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {propertyDetails.map((detail, index) => (
                      <div key={index} className="flex items-center p-4 bg-brand-beige-light rounded-lg">
                        <detail.icon className="h-8 w-8 text-brand-navy mr-3" />
                        <div>
                          <div className="font-semibold text-brand-navy">
                            {selectedProperty.property_type?.toLowerCase() === 'commercial' 
                              ? index === 0 ? details.header1 : index === 1 ? details.header2 : 'Area'
                              : index === 0 ? 'Bedrooms' : index === 1 ? 'Bathrooms' : 'Area'
                            }
                          </div>
                          <div className="text-brand-grey">{detail.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              <div className="flex space-x-4">
                <Button 
                  className="flex-1 bg-brand-classic-gold text-white hover:bg-brand-soft-gold"
                  onClick={() => navigate('/contact')}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Us
                </Button>
                {selectedProperty.youtube_url && (
                  <Button 
                    variant="outline" 
                    className="border-red-500 text-red-500 hover:bg-red-50"
                    onClick={() => window.open(selectedProperty.youtube_url, '_blank')}
                    title="Watch Property Video"
                  >
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    Video Tour
                  </Button>
                )}
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
