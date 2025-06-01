import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, PlusCircle, Users, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/products', icon: Package, label: 'Manage Products' },
    { href: '/admin/products/add', icon: PlusCircle, label: 'Add Product' },
  ];

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="sticky top-0 h-screen hidden w-64 flex-col border-r bg-background p-4 sm:flex">
        <div className="mb-8 flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold tracking-tight">ShreeRang Admin</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-accent',
                location.pathname === item.href && 'bg-accent text-primary font-medium'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto">
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" /> Log Out
          </Button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
          <span className="font-semibold text-lg">Admin Panel</span>
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0 space-y-4">
          {children}
        </main>
        <footer className="border-t p-4 text-center text-sm text-muted-foreground">
          ShreeRang Designs Admin Panel &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;