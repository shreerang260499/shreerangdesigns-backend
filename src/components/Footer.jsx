
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
                <span>info@shreerangdesigns.in</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone size={16} />
                <span>+91 98765 43210</span>
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
