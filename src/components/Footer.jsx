import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <span className="text-lg font-bold">ShreeRang Designs</span>
            <p className="text-sm text-muted-foreground">
              Premium CNC door designs for modern homes and businesses.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="https://instagram.com" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="https://twitter.com" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="https://wa.me/918982377005" className="text-muted-foreground hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M20.52 3.48A12.07 12.07 0 0 0 12 0C5.37 0 0 5.37 0 12a11.93 11.93 0 0 0 1.64 6.01L0 24l6.25-1.63A12.07 12.07 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.21-1.25-6.23-3.48-8.52zM12 22c-1.7 0-3.36-.44-4.81-1.27l-.34-.2-3.71.97.99-3.62-.22-.37A9.94 9.94 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.13-7.47c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.41-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.18.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.36-.01-.56-.01-.2 0-.52.07-.8.36-.28.28-1.06 1.04-1.06 2.54 0 1.5 1.09 2.95 1.24 3.16.15.21 2.15 3.29 5.22 4.48.73.31 1.3.5 1.75.64.74.24 1.41.21 1.94.13.59-.09 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.18-.53-.32z"/></svg>
                <span className="sr-only">WhatsApp</span>
              </a>
            </div>
          </div>
          
          <div className="space-y-4">
            <span className="text-sm font-medium">Quick Links</span>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/designs" className="text-muted-foreground hover:text-foreground transition-colors">
                  Designs
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <span className="text-sm font-medium">Categories</span>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/designs?category=traditional" className="text-muted-foreground hover:text-foreground transition-colors">
                  Traditional Designs
                </Link>
              </li>
              <li>
                <Link to="/designs?category=modern" className="text-muted-foreground hover:text-foreground transition-colors">
                  Modern Designs
                </Link>
              </li>
              <li>
                <Link to="/designs?category=luxury" className="text-muted-foreground hover:text-foreground transition-colors">
                  Luxury Designs
                </Link>
              </li>
              <li>
                <Link to="/designs?category=nature" className="text-muted-foreground hover:text-foreground transition-colors">
                  Nature-Inspired
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <span className="text-sm font-medium">Contact Us</span>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail size={16} />
                <span>info.shreerangdesigns@gmail.com</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone size={16} />
                <span>+91 8982377005</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ShreeRang Designs. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
