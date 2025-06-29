import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { IconButton } from "@/components/ui/custom-buttons";
import { useAuth } from "@/contexts/AuthContext";
import NotificationsDropdown from "./NotificationsDropdown";
import SidebarUserInfo from "./SidebarUserInfo";
import SidebarNavigation from "./SidebarNavigation";
import SidebarFooter from "./SidebarFooter";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background rtl" dir="rtl">
      {/* Moroccan Pattern Background */}
      <div className="fixed inset-0 bg-moroccan-pattern opacity-5 pointer-events-none" />

      <div className="flex h-screen">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col
            lg:relative lg:translate-x-0
            ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
          `}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Link to="/" className="text-xl font-bold text-primary">
              سوق المغرب
            </Link>
            <IconButton
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </IconButton>
          </div>

          {/* User Info */}
          <SidebarUserInfo />

          {/* Navigation */}
          <SidebarNavigation onItemClick={() => setSidebarOpen(false)} />

          {/* Footer */}
          <SidebarFooter />
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Top Header */}
          <header className="bg-white shadow-sm border-b px-4 py-3 lg:px-6 lg:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-reverse space-x-3">
                <IconButton
                  className="lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </IconButton>
                <h1 className="text-xl lg:text-2xl font-bold text-foreground">
                  لوحة التحكم
                </h1>
              </div>

              <div className="flex items-center space-x-reverse space-x-3">
                <NotificationsDropdown />
                <Link to="/dashboard/profile">
                  <IconButton className="flex items-center space-x-reverse space-x-2 hover:bg-muted">
                    <img
                      src={
                        user?.avatar ||
                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                      }
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="hidden md:block text-sm font-medium">
                      {user?.firstName}
                    </span>
                  </IconButton>
                </Link>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 overflow-auto p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
