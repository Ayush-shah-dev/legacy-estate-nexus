
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const AdminLoginButton = () => {
  const { user, isAdmin } = useAuth();

  // Don't show login button if user is already logged in and not an admin
  if (user && !isAdmin) {
    return null;
  }

  // Show admin dashboard link if already logged in as admin
  if (user && isAdmin) {
    return (
      <Link to="/admin">
        <Button variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
          <Shield className="w-4 h-4 mr-2" />
          Admin Dashboard
        </Button>
      </Link>
    );
  }

  // Show admin login for non-logged in users
  return (
    <Link to="/auth">
      <Button variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
        <Shield className="w-4 h-4 mr-2" />
        Admin Login
      </Button>
    </Link>
  );
};

export default AdminLoginButton;
