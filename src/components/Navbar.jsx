import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, User, LogOut, LogIn, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const ListItem = React.forwardRef(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";


const Navbar = () => {
  const { items } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  const UserAvatarFallback = user && user.name ? user.name.charAt(0).toUpperCase() : "U";

  const designCategories = [
    { title: "CNC Door Designs", href: "/designs", description: "Intricate designs for CNC routing on doors." },
    { title: "Printable Art", href: "/printable-designs", description: "High-resolution digital art for printing." },
  ];

  // Debug log to check cart items
  console.log('Cart items:', items);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/logo-original.svg" 
            alt="ShreeRang Designs Logo" 
            className="h-10 w-auto max-w-[200px] object-contain"
            style={{ aspectRatio: '749/479' }}
          />
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Designs</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {designCategories.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/about" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  About
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
               <Link to="/contact" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Contact
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2 md:gap-4">
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              {items.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {items.length}
                </span>
              )}
            </Button>
          </Link>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatarUrl || ""} alt={user.name || "User"} />
                    <AvatarFallback>{UserAvatarFallback}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center w-full">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                {user.isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin/dashboard" className="flex items-center w-full">
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      <span>Admin Panel</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center w-full cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="sm" className="hidden md:inline-flex items-center gap-1">
                <LogIn className="h-4 w-4" /> Login
              </Button>
            </Link>
          )}
          
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden border-t"
          >
            <div className="container py-4 flex flex-col space-y-2">
              <Link to="/" className="px-2 py-2 hover:bg-accent rounded-md text-sm" onClick={toggleMenu}>
                Home
              </Link>
              <Link to="/designs" className="px-2 py-2 hover:bg-accent rounded-md text-sm" onClick={toggleMenu}>
                CNC Door Designs
              </Link>
              <Link to="/printable-designs" className="px-2 py-2 hover:bg-accent rounded-md text-sm" onClick={toggleMenu}>
                Printable Art
              </Link>
              <Link to="/about" className="px-2 py-2 hover:bg-accent rounded-md text-sm" onClick={toggleMenu}>
                About
              </Link>
              <Link to="/contact" className="px-2 py-2 hover:bg-accent rounded-md text-sm" onClick={toggleMenu}>
                Contact
              </Link>
              <hr className="my-2"/>
              {user ? (
                <>
                  <Link to="/profile" className="px-2 py-2 hover:bg-accent rounded-md text-sm flex items-center" onClick={toggleMenu}>
                     <User className="mr-2 h-4 w-4" /> Profile
                  </Link>
                  {user.isAdmin && (
                     <Link to="/admin/dashboard" className="px-2 py-2 hover:bg-accent rounded-md text-sm flex items-center" onClick={toggleMenu}>
                       <ShieldCheck className="mr-2 h-4 w-4" /> Admin Panel
                    </Link>
                  )}
                  <button onClick={() => { handleLogout(); toggleMenu(); }} className="px-2 py-2 hover:bg-accent rounded-md text-sm text-left flex items-center">
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </button>
                </>
              ) : (
                <Link to="/login" className="px-2 py-2 hover:bg-accent rounded-md text-sm flex items-center" onClick={toggleMenu}>
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;