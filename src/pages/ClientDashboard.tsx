import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  Plus, 
  Edit, 
  Trash2, 
  MapPin, 
  BedDouble, 
  Bath, 
  Square, 
  Home,
  Building2,
  User,
  Phone,
  Mail,
  Building
} from 'lucide-react';

interface ClientUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company_name?: string;
}

interface Property {
  id: string;
  title: string;
  description?: string;
  location?: string;
  property_type?: string;
  bedrooms?: number;
  bathrooms?: number;
  area_sqft?: number;
  image_url?: string;
  featured: boolean;
  status: string;
  created_at: string;
}

export default function ClientDashboard() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [clientUser, setClientUser] = useState<ClientUser | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Form states
  const [propertyForm, setPropertyForm] = useState({
    title: '',
    description: '',
    location: '',
    property_type: 'Residential',
    bedrooms: '',
    bathrooms: '',
    area_sqft: '',
    image_url: '',
    status: 'available'
  });

  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    company_name: ''
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (user) {
      fetchClientData();
    }
  }, [user, loading, navigate]);

  const fetchClientData = async () => {
    try {
      // Check if client user exists
      const { data: clientData, error: clientError } = await supabase
        .from('client_users')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (clientError && clientError.code !== 'PGRST116') {
        throw clientError;
      }

      if (clientData) {
        setClientUser(clientData);
        setProfileForm({
          name: clientData.name,
          email: clientData.email,
          phone: clientData.phone || '',
          company_name: clientData.company_name || ''
        });

        // Fetch properties
        const { data: propertiesData, error: propertiesError } = await supabase
          .from('properties')
          .select('*')
          .eq('client_user_id', clientData.id)
          .order('created_at', { ascending: false });

        if (propertiesError) throw propertiesError;
        setProperties(propertiesData || []);
      } else {
        // Client user doesn't exist, show profile creation
        setIsProfileDialogOpen(true);
        setProfileForm({
          name: user?.user_metadata?.full_name || '',
          email: user?.email || '',
          phone: '',
          company_name: ''
        });
      }
    } catch (error) {
      console.error('Error fetching client data:', error);
      toast({
        title: "Error",
        description: "Failed to load your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const handleCreateProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('client_users')
        .insert({
          user_id: user?.id,
          name: profileForm.name,
          email: profileForm.email,
          phone: profileForm.phone || null,
          company_name: profileForm.company_name || null
        })
        .select()
        .single();

      if (error) throw error;

      setClientUser(data);
      setIsProfileDialogOpen(false);
      toast({
        title: "Success",
        description: "Profile created successfully!",
      });
    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProfile = async () => {
    if (!clientUser) return;

    try {
      const { error } = await supabase
        .from('client_users')
        .update({
          name: profileForm.name,
          email: profileForm.email,
          phone: profileForm.phone || null,
          company_name: profileForm.company_name || null
        })
        .eq('id', clientUser.id);

      if (error) throw error;

      setClientUser({ ...clientUser, ...profileForm });
      setIsProfileDialogOpen(false);
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateProperty = async () => {
    if (!clientUser) return;

    try {
      const { data, error } = await supabase
        .from('properties')
        .insert({
          client_user_id: clientUser.id,
          title: propertyForm.title,
          description: propertyForm.description || null,
          location: propertyForm.location || null,
          property_type: propertyForm.property_type || null,
          bedrooms: propertyForm.bedrooms ? parseInt(propertyForm.bedrooms) : null,
          bathrooms: propertyForm.bathrooms ? parseInt(propertyForm.bathrooms) : null,
          area_sqft: propertyForm.area_sqft ? parseInt(propertyForm.area_sqft) : null,
          image_url: propertyForm.image_url || null,
          status: propertyForm.status,
          featured: false
        })
        .select()
        .single();

      if (error) throw error;

      setProperties([data, ...properties]);
      setIsCreateDialogOpen(false);
      setPropertyForm({
        title: '',
        description: '',
        location: '',
        property_type: 'Residential',
        bedrooms: '',
        bathrooms: '',
        area_sqft: '',
        image_url: '',
        status: 'available'
      });
      toast({
        title: "Success",
        description: "Property added successfully!",
      });
    } catch (error) {
      console.error('Error creating property:', error);
      toast({
        title: "Error",
        description: "Failed to create property. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProperty = async () => {
    if (!editingProperty) return;

    try {
      const { error } = await supabase
        .from('properties')
        .update({
          title: propertyForm.title,
          description: propertyForm.description || null,
          location: propertyForm.location || null,
          property_type: propertyForm.property_type || null,
          bedrooms: propertyForm.bedrooms ? parseInt(propertyForm.bedrooms) : null,
          bathrooms: propertyForm.bathrooms ? parseInt(propertyForm.bathrooms) : null,
          area_sqft: propertyForm.area_sqft ? parseInt(propertyForm.area_sqft) : null,
          image_url: propertyForm.image_url || null,
          status: propertyForm.status
        })
        .eq('id', editingProperty.id);

      if (error) throw error;

      const updatedProperties = properties.map(p => 
        p.id === editingProperty.id 
          ? { 
              ...p, 
              ...propertyForm, 
              bedrooms: propertyForm.bedrooms ? parseInt(propertyForm.bedrooms) : null,
              bathrooms: propertyForm.bathrooms ? parseInt(propertyForm.bathrooms) : null,
              area_sqft: propertyForm.area_sqft ? parseInt(propertyForm.area_sqft) : null
            }
          : p
      );
      setProperties(updatedProperties);
      setIsEditDialogOpen(false);
      setEditingProperty(null);
      toast({
        title: "Success",
        description: "Property updated successfully!",
      });
    } catch (error) {
      console.error('Error updating property:', error);
      toast({
        title: "Error",
        description: "Failed to update property. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) throw error;

      setProperties(properties.filter(p => p.id !== propertyId));
      toast({
        title: "Success",
        description: "Property deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: "Error",
        description: "Failed to delete property. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (property: Property) => {
    setEditingProperty(property);
    setPropertyForm({
      title: property.title,
      description: property.description || '',
      location: property.location || '',
      property_type: property.property_type || 'Residential',
      bedrooms: property.bedrooms?.toString() || '',
      bathrooms: property.bathrooms?.toString() || '',
      area_sqft: property.area_sqft?.toString() || '',
      image_url: property.image_url || '',
      status: property.status
    });
    setIsEditDialogOpen(true);
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-classic-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-beige-light to-brand-cream">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-brand-navy">Property Dashboard</h1>
              <p className="text-brand-beige-dark">
                Welcome back, {clientUser?.name || 'Property Owner'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsProfileDialogOpen(true)}
                className="border-brand-beige hover:bg-brand-beige-light"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="border-brand-beige hover:bg-brand-beige-light"
              >
                <Home className="h-4 w-4 mr-2" />
                Back to Website
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border-brand-beige">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-brand-beige-dark">Total Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-navy">{properties.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-brand-beige">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-brand-beige-dark">Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {properties.filter(p => p.status === 'available').length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-brand-beige">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-brand-beige-dark">Under Construction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {properties.filter(p => p.status === 'Under Construction').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Properties Section */}
        <Card className="bg-white border-brand-beige">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-brand-navy">Your Properties</CardTitle>
                <CardDescription>Manage your property listings</CardDescription>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-brand-classic-gold hover:bg-brand-soft-gold text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Property
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Property</DialogTitle>
                    <DialogDescription>
                      Fill in the details for your new property listing
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Property Title *</Label>
                      <Input
                        id="title"
                        value={propertyForm.title}
                        onChange={(e) => setPropertyForm({...propertyForm, title: e.target.value})}
                        placeholder="e.g., Luxury Villa in Juhu"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={propertyForm.location}
                        onChange={(e) => setPropertyForm({...propertyForm, location: e.target.value})}
                        placeholder="e.g., Juhu, Mumbai"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="property_type">Property Type</Label>
                      <Select value={propertyForm.property_type} onValueChange={(value) => setPropertyForm({...propertyForm, property_type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Residential">Residential</SelectItem>
                          <SelectItem value="Commercial">Commercial</SelectItem>
                          <SelectItem value="Villa">Villa</SelectItem>
                          <SelectItem value="Apartment">Apartment</SelectItem>
                          <SelectItem value="Office">Office</SelectItem>
                          <SelectItem value="Warehouse">Warehouse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={propertyForm.status} onValueChange={(value) => setPropertyForm({...propertyForm, status: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="Ready to Move">Ready to Move</SelectItem>
                          <SelectItem value="Under Construction">Under Construction</SelectItem>
                          <SelectItem value="Sold">Sold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bedrooms">Bedrooms</Label>
                      <Input
                        id="bedrooms"
                        type="number"
                        value={propertyForm.bedrooms}
                        onChange={(e) => setPropertyForm({...propertyForm, bedrooms: e.target.value})}
                        placeholder="e.g., 3"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bathrooms">Bathrooms</Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        value={propertyForm.bathrooms}
                        onChange={(e) => setPropertyForm({...propertyForm, bathrooms: e.target.value})}
                        placeholder="e.g., 2"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="area_sqft">Area (sq ft)</Label>
                      <Input
                        id="area_sqft"
                        type="number"
                        value={propertyForm.area_sqft}
                        onChange={(e) => setPropertyForm({...propertyForm, area_sqft: e.target.value})}
                        placeholder="e.g., 1200"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="image_url">Image URL</Label>
                      <Input
                        id="image_url"
                        value={propertyForm.image_url}
                        onChange={(e) => setPropertyForm({...propertyForm, image_url: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={propertyForm.description}
                        onChange={(e) => setPropertyForm({...propertyForm, description: e.target.value})}
                        placeholder="Describe your property features, amenities, etc."
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateProperty} disabled={!propertyForm.title}>
                      Create Property
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          
          <CardContent>
            {properties.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-brand-beige-dark mx-auto mb-4" />
                <h3 className="text-lg font-medium text-brand-navy mb-2">No properties yet</h3>
                <p className="text-brand-beige-dark mb-4">Add your first property to get started</p>
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-brand-classic-gold hover:bg-brand-soft-gold text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <Card key={property.id} className="overflow-hidden border-brand-beige hover:shadow-lg transition-shadow">
                    <div className="aspect-video relative">
                      {property.image_url ? (
                        <img
                          src={property.image_url}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-brand-beige-light flex items-center justify-center">
                          <Building2 className="h-12 w-12 text-brand-beige-dark" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-brand-classic-gold text-white">
                          {property.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-brand-navy mb-2">{property.title}</h3>
                      
                      {property.location && (
                        <div className="flex items-center text-sm text-brand-beige-dark mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          {property.location}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-brand-beige-dark mb-4">
                        {property.bedrooms && (
                          <div className="flex items-center">
                            <BedDouble className="h-4 w-4 mr-1" />
                            {property.bedrooms}
                          </div>
                        )}
                        {property.bathrooms && (
                          <div className="flex items-center">
                            <Bath className="h-4 w-4 mr-1" />
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
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(property)}
                          className="flex-1 border-brand-beige hover:bg-brand-beige-light"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteProperty(property.id)}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Property Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Property</DialogTitle>
            <DialogDescription>
              Update your property details
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Property Title *</Label>
              <Input
                id="edit-title"
                value={propertyForm.title}
                onChange={(e) => setPropertyForm({...propertyForm, title: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                value={propertyForm.location}
                onChange={(e) => setPropertyForm({...propertyForm, location: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-property_type">Property Type</Label>
              <Select value={propertyForm.property_type} onValueChange={(value) => setPropertyForm({...propertyForm, property_type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Residential">Residential</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Villa">Villa</SelectItem>
                  <SelectItem value="Apartment">Apartment</SelectItem>
                  <SelectItem value="Office">Office</SelectItem>
                  <SelectItem value="Warehouse">Warehouse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={propertyForm.status} onValueChange={(value) => setPropertyForm({...propertyForm, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="Ready to Move">Ready to Move</SelectItem>
                  <SelectItem value="Under Construction">Under Construction</SelectItem>
                  <SelectItem value="Sold">Sold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-bedrooms">Bedrooms</Label>
              <Input
                id="edit-bedrooms"
                type="number"
                value={propertyForm.bedrooms}
                onChange={(e) => setPropertyForm({...propertyForm, bedrooms: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-bathrooms">Bathrooms</Label>
              <Input
                id="edit-bathrooms"
                type="number"
                value={propertyForm.bathrooms}
                onChange={(e) => setPropertyForm({...propertyForm, bathrooms: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-area_sqft">Area (sq ft)</Label>
              <Input
                id="edit-area_sqft"
                type="number"
                value={propertyForm.area_sqft}
                onChange={(e) => setPropertyForm({...propertyForm, area_sqft: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-image_url">Image URL</Label>
              <Input
                id="edit-image_url"
                value={propertyForm.image_url}
                onChange={(e) => setPropertyForm({...propertyForm, image_url: e.target.value})}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={propertyForm.description}
                onChange={(e) => setPropertyForm({...propertyForm, description: e.target.value})}
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProperty} disabled={!propertyForm.title}>
              Update Property
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Dialog */}
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{clientUser ? 'Update Profile' : 'Create Profile'}</DialogTitle>
            <DialogDescription>
              {clientUser ? 'Update your profile information' : 'Please create your profile to get started'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Name *</Label>
              <Input
                id="profile-name"
                value={profileForm.name}
                onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                placeholder="Your full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="profile-email">Email *</Label>
              <Input
                id="profile-email"
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                placeholder="your@email.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="profile-phone">Phone</Label>
              <Input
                id="profile-phone"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                placeholder="+91 98765 43210"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="profile-company">Company Name</Label>
              <Input
                id="profile-company"
                value={profileForm.company_name}
                onChange={(e) => setProfileForm({...profileForm, company_name: e.target.value})}
                placeholder="Your company name (optional)"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            {clientUser && (
              <Button variant="outline" onClick={() => setIsProfileDialogOpen(false)}>
                Cancel
              </Button>
            )}
            <Button 
              onClick={clientUser ? handleUpdateProfile : handleCreateProfile}
              disabled={!profileForm.name || !profileForm.email}
            >
              {clientUser ? 'Update Profile' : 'Create Profile'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}