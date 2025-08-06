
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

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
  status: string;
  featured: boolean;
  image_url: string;
  created_at: string;
}

interface AdminPropertyActionsProps {
  property: Property;
  onEdit: (property: Property) => void;
  onDelete: (id: string) => void;
}

const AdminPropertyActions = ({ property, onEdit, onDelete }: AdminPropertyActionsProps) => {
  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onEdit(property)}
        className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
      >
        <Edit className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onDelete(property.id)}
        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default AdminPropertyActions;
