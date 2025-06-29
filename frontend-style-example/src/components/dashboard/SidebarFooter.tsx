import { LogOut } from "lucide-react";
import { DangerButton } from "@/components/ui/custom-buttons";
import { useAuth } from "@/contexts/AuthContext";

export default function SidebarFooter() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div className="p-4 border-t border-border">
      <DangerButton
        onClick={handleLogout}
        variant="outline"
        className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
      >
        <LogOut className="h-4 w-4 ml-2" />
        تسجيل الخروج
      </DangerButton>
    </div>
  );
}
