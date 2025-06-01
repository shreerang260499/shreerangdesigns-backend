
import React from "react";
import { motion } from "framer-motion";

const AboutPage = () => {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold tracking-tight mb-4">About ShreeRang Designs</h1>
          <p className="text-muted-foreground">
            Premium CNC door designs for modern homes and businesses
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img  
              className="rounded-lg shadow-lg" 
              alt="ShreeRang Designs workshop"
             src="https://images.unsplash.com/photo-1583824159840-b85725a711b4" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold">Our Story</h2>
            <p>
              Founded in 2018, ShreeRang Designs has been at the forefront of innovative door design in India. 
              What started as a small workshop has grown into a digital design studio specializing in CNC door patterns.
            </p>
            <p>
              Our team combines traditional Indian design elements with modern aesthetics to create unique door designs 
              that stand out in any space.
            </p>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="mb-4">
            At ShreeRang Designs, we believe that doors are not just functional elements but an expression of style and personality. 
            Our mission is to provide high-quality, ready-to-use CNC door designs that help homeowners, interior designers, and 
            manufacturers create stunning doors without the hassle of custom design work.
          </p>
          <p>
            We are committed to preserving traditional Indian design elements while embracing modern technology and aesthetics.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-4">Our Design Process</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {[
              {
                step: "Research & Inspiration",
                description: "We draw inspiration from traditional patterns, architecture, and nature."
              },
              {
                step: "Digital Design",
                description: "Our designers create precise digital models optimized for CNC machines."
              },
              {
                step: "Testing & Refinement",
                description: "Each design is tested on actual CNC machines to ensure perfect results."
              }
            ].map((item, index) => (
              <div key={index} className="border rounded-lg p-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold mb-4">
                  {index + 1}
                </div>
                <h3 className="font-medium mb-2">{item.step}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
          <p>
            This meticulous process ensures that every design in our collection is not only beautiful but also 
            technically sound and ready for production.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
