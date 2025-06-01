
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((category) => (
        <motion.div
          key={category.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => onSelectCategory(category.id)}
            className="rounded-full"
          >
            {category.name}
          </Button>
        </motion.div>
      ))}
    </div>
  );
};

export default CategoryFilter;
