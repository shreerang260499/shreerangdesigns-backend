import React from "react";
import { motion } from "framer-motion";
import Hero from "@/components/hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import { useProducts } from "@/context/ProductContext";
import { ArrowRight, Download, Shield, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const { products, loading } = useProducts();

  const features = [
    {
      icon: <Download className="h-10 w-10 text-primary" />,
      title: "Instant Downloads",
      description: "Get your designs immediately after purchase. No waiting time."
    },
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: "Quality Guaranteed",
      description: "All designs are tested and optimized for CNC machines & print quality."
    },
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: "Time-Saving",
      description: "Skip the design process and go straight to production or printing."
    }
  ];

  if (loading) {
    return <div className="container py-12 text-center">Loading page content...</div>;
  }

  return (
    <div>
      <Hero />
      
      <FeaturedProducts products={products} />
      
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Why Choose Our Designs</h2>
            <p className="text-muted-foreground mt-4">
              Premium quality CNC & printable designs by expert designers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center p-6 rounded-lg border bg-card"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight">Ready to Transform Your Space?</h2>
              <p className="mt-4 text-primary-foreground/80">
                Browse our collections of premium CNC door designs and printable art.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/designs">
                <Button size="lg" variant="secondary" className="group w-full sm:w-auto">
                  Explore CNC Designs
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
               <Link to="/printable-designs">
                <Button size="lg" variant="secondary" className="group w-full sm:w-auto">
                  Explore Printable Art
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-accent/30">
        <div className="container">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">What Our Customers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Rajesh Sharma",
                role: "Interior Designer",
                content: "The CNC designs from ShreeRang are exceptional. The detail and precision are perfect for my clients who want unique door designs."
              },
              {
                name: "Anjali Mehta",
                role: "Art Enthusiast",
                content: "I love the printable art collection! The quality is amazing and I've decorated my entire living room with their designs."
              },
              {
                name: "Vikram Singh",
                role: "Furniture Manufacturer",
                content: "As a manufacturer, I appreciate the technical accuracy of these designs. They work flawlessly with our CNC machines."
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card p-6 rounded-lg border"
              >
                <p className="italic text-muted-foreground mb-4">"{testimonial.content}"</p>
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;