import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";

const FeaturedProducts = ({ products }) => {
  const featuredProducts = products.filter(product => product.featured).slice(0, 3);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section className="py-16 bg-accent/30">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Designs</h2>
            <p className="text-muted-foreground mt-2">
              Our most popular and exclusive CNC & Printable designs
            </p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Link to="/designs">
              <Button variant="ghost" className="group">
                All CNC Designs
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/printable-designs">
              <Button variant="ghost" className="group">
                All Printable Art
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
        
        {featuredProducts.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        ) : (
          <p className="text-center text-muted-foreground">No featured products available at the moment.</p>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;