import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

export default function SidebarUserInfo() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="p-4 border-b border-border">
      <div className="flex items-center space-x-reverse space-x-3">
        <img
          src={
            user.avatar ||
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
          }
          alt={`${user.firstName} ${user.lastName}`}
          className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm truncate">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          <div className="flex items-center gap-1 mt-1">
            {user.isVerified && (
              <Badge variant="secondary" className="text-xs">
                محقق ✓
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {user.city}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
