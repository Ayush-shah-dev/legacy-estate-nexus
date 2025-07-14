import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Plus, Edit, Trash2, Check, X, Star } from 'lucide-react';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  phone_verified: boolean;
  created_at: string;
}

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  image_url: string;
  featured: boolean;
  status: string;
}

interface Review {
  id: string;
  name: string;
  rating: number;
  review_text: string;
  approved: boolean;
  created_at: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [newProperty, setNewProperty] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    property_type: 'Apartment',
    bedrooms: '',
    bathrooms: '',
    area_sqft: '',
    image_url: '',
    featured: false,
    status: 'available'
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Check if user is admin
        const { data: adminUser } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (adminUser) {
          setUser(user);
          setIsAuthorized(true);
          loadData();
        } else {
          toast({
            title: "Access Denied",
            description: "You are not authorized to access this dashboard.",
            variant: "destructive",
          });
          navigate('/');
        }
      } else {
        // Redirect to sign in
        const { error } = await supabase.auth.signInWithPassword({
          email: 'admin@regalestate.com',
          password: 'admin123'
        });
        
        if (error) {
          toast({
            title: "Authentication Required",
            description: "Please contact admin for access credentials.",
            variant: "destructive",
          });
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      // Load contact submissions
      const { data: contactData } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Load properties
      const { data: propertyData } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Load reviews
      const { data: reviewData } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      setContacts(contactData || []);
      setProperties(propertyData || []);
      setReviews(reviewData || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleAddProperty = async () => {
    try {
      const { error } = await supabase.from('properties').insert([{
        ...newProperty,
        price: parseFloat(newProperty.price),
        bedrooms: parseInt(newProperty.bedrooms),
        bathrooms: parseInt(newProperty.bathrooms),
        area_sqft: parseInt(newProperty.area_sqft)
      }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Property added successfully",
      });
      
      setIsAddPropertyOpen(false);
      setNewProperty({
        title: '',
        description: '',
        price: '',
        location: '',
        property_type: 'Apartment',
        bedrooms: '',
        bathrooms: '',
        area_sqft: '',
        image_url: '',
        featured: false,
        status: 'available'
      });
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add property",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProperty = async (id: string) => {
    try {
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Property deleted successfully",
      });
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      });
    }
  };

  const handleApproveReview = async (id: string, approved: boolean) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ approved })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Review ${approved ? 'approved' : 'rejected'} successfully`,
      });
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update review",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthorized) {
    return <div className="flex items-center justify-center min-h-screen">Access Denied</div>;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Regal Estate Admin Dashboard</h1>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="contacts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="contacts">Contact Submissions</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <CardTitle>Contact Submissions</CardTitle>
                <CardDescription>
                  Manage customer inquiries and contact form submissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Phone Verified</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell>{contact.name}</TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell>{contact.phone}</TableCell>
                        <TableCell>
                          <Badge variant={contact.phone_verified ? "default" : "secondary"}>
                            {contact.phone_verified ? "Verified" : "Not Verified"}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{contact.message}</TableCell>
                        <TableCell>{new Date(contact.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="properties">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Properties</CardTitle>
                    <CardDescription>Manage property listings</CardDescription>
                  </div>
                  <Dialog open={isAddPropertyOpen} onOpenChange={setIsAddPropertyOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Property
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Property</DialogTitle>
                        <DialogDescription>Fill in the property details</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={newProperty.title}
                            onChange={(e) => setNewProperty({...newProperty, title: e.target.value})}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={newProperty.description}
                            onChange={(e) => setNewProperty({...newProperty, description: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="price">Price</Label>
                            <Input
                              id="price"
                              type="number"
                              value={newProperty.price}
                              onChange={(e) => setNewProperty({...newProperty, price: e.target.value})}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="property_type">Type</Label>
                            <Select
                              value={newProperty.property_type}
                              onValueChange={(value) => setNewProperty({...newProperty, property_type: value})}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Apartment">Apartment</SelectItem>
                                <SelectItem value="Villa">Villa</SelectItem>
                                <SelectItem value="Commercial">Commercial</SelectItem>
                                <SelectItem value="Plot">Plot</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={newProperty.location}
                            onChange={(e) => setNewProperty({...newProperty, location: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="bedrooms">Bedrooms</Label>
                            <Input
                              id="bedrooms"
                              type="number"
                              value={newProperty.bedrooms}
                              onChange={(e) => setNewProperty({...newProperty, bedrooms: e.target.value})}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="bathrooms">Bathrooms</Label>
                            <Input
                              id="bathrooms"
                              type="number"
                              value={newProperty.bathrooms}
                              onChange={(e) => setNewProperty({...newProperty, bathrooms: e.target.value})}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="area_sqft">Area (sqft)</Label>
                            <Input
                              id="area_sqft"
                              type="number"
                              value={newProperty.area_sqft}
                              onChange={(e) => setNewProperty({...newProperty, area_sqft: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="image_url">Image URL</Label>
                          <Input
                            id="image_url"
                            value={newProperty.image_url}
                            onChange={(e) => setNewProperty({...newProperty, image_url: e.target.value})}
                          />
                        </div>
                      </div>
                      <Button onClick={handleAddProperty} className="w-full">
                        Add Property
                      </Button>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {properties.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell>{property.title}</TableCell>
                        <TableCell>{property.property_type}</TableCell>
                        <TableCell>{property.location}</TableCell>
                        <TableCell>₹{property.price?.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={property.status === 'available' ? "default" : "secondary"}>
                            {property.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={property.featured ? "default" : "outline"}>
                            {property.featured ? "Featured" : "Regular"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleDeleteProperty(property.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
                <CardDescription>Manage customer reviews and testimonials</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Review</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews.map((review) => (
                      <TableRow key={review.id}>
                        <TableCell>{review.name}</TableCell>
                        <TableCell>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{review.review_text}</TableCell>
                        <TableCell>
                          <Badge variant={review.approved ? "default" : "secondary"}>
                            {review.approved ? "Approved" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(review.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleApproveReview(review.id, true)}
                              disabled={review.approved}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleApproveReview(review.id, false)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}