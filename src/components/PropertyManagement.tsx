
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Search, Home } from "lucide-react";
import PropertyForm from "./PropertyForm";

interface Property {
  id: string;
  title: string;
  description: string;
  price: string;
  location: string;
  property_type: string;
  bedrooms: string;
  bathrooms: string;
  area_sqft: string;
  status: string;
  featured: boolean;
  image_url: string;
  additional_images?: string[];
  youtube_url?: string;
  created_at: string;
}

const PropertyManagement = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        title: "Error",
        description: "Failed to fetch properties",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Property deleted successfully",
      });

      fetchProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProperty(null);
  };

  const handleFormSave = () => {
    fetchProperties();
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || property.status === statusFilter;
    const matchesType = typeFilter === "all" || property.property_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const statusColors = {
      available: "bg-green-500/20 text-green-400 border-green-500/20",
      sold: "bg-red-500/20 text-red-400 border-red-500/20",
      rented: "bg-blue-500/20 text-blue-400 border-blue-500/20",
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/20",
    };

    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || "bg-gray-500/20 text-gray-400"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPropertyDetails = (property: Property) => {
    const isCommercial = property.property_type === 'commercial';
    if (isCommercial) {
      return `${property.bedrooms} • ${property.bathrooms} • ${property.area_sqft}`;
    }
    return `${property.bedrooms} • ${property.bathrooms} • ${property.area_sqft}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-black/20 border-blue-500/20 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-blue-100 flex items-center">
              <Home className="w-5 h-5 mr-2 text-blue-400" />
              Property Management
            </CardTitle>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/20 border-blue-500/20 text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-black/20 border-blue-500/20 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="rented">Rented</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-black/20 border-blue-500/20 text-white">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="land">Land</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border border-blue-500/20 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-blue-500/20 hover:bg-blue-500/5">
                  <TableHead className="text-blue-100">Title</TableHead>
                  <TableHead className="text-blue-100">Type</TableHead>
                  <TableHead className="text-blue-100">Location</TableHead>
                  <TableHead className="text-blue-100">Price</TableHead>
                  <TableHead className="text-blue-100">Status</TableHead>
                  <TableHead className="text-blue-100">Details</TableHead>
                  <TableHead className="text-blue-100">Gallery</TableHead>
                  <TableHead className="text-blue-100">Featured</TableHead>
                  <TableHead className="text-blue-100">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.map((property) => (
                  <TableRow key={property.id} className="border-blue-500/20 hover:bg-blue-500/5">
                    <TableCell className="text-white font-medium">
                      <div className="flex items-center space-x-3">
                        {property.image_url && (
                          <img
                            src={property.image_url}
                            alt={property.title}
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium">{property.title}</div>
                          <div className="text-sm text-gray-400 truncate max-w-[200px]">
                            {property.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <Badge variant="outline" className="border-gray-500 text-gray-300">
                        {property.property_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">{property.location}</TableCell>
                    <TableCell className="text-green-400 font-medium">
                      {property.price || 'Price on Request'}
                    </TableCell>
                    <TableCell>{getStatusBadge(property.status)}</TableCell>
                    <TableCell className="text-gray-300">
                      <div className="text-sm">
                        {getPropertyDetails(property)}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className="text-sm">
                        {property.additional_images?.length 
                          ? `${(property.additional_images.length + 1)} photos` 
                          : '1 photo'
                        }
                      </div>
                    </TableCell>
                    <TableCell>
                      {property.featured && (
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/20">
                          Featured
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(property)}
                          className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(property.id)}
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredProperties.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <Home className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No properties found matching your filters.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {showForm && (
        <PropertyForm
          property={editingProperty || undefined}
          onCancel={handleCloseForm}
          onSave={handleFormSave}
        />
      )}
    </div>
  );
};

export default PropertyManagement;
