import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useProducts } from "@/context/ProductContext";
import { categories as allCategories } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import SearchBar from "@/components/SearchBar";
import { filterProductsByCategory, searchProducts } from "@/lib/utils";

const DesignsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get("category");
  
  const { products, loading: productsLoading } = useProducts();
  const cncProducts = products.filter(p => p.productType === 'cnc');
  const cncCategories = [{ id: "all", name: "All CNC Designs", productType: "cnc" }, ...allCategories.filter(c => c.productType === "cnc" || c.productType === "all" && c.id === "all")];


  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(cncProducts);
  
  useEffect(() => {
    let result = cncProducts;
    
    if (selectedCategory !== "all") {
      result = filterProductsByCategory(result, selectedCategory);
    }
    
    if (searchTerm) {
      result = searchProducts(result, searchTerm);
    }
    
    setFilteredProducts(result);
  }, [selectedCategory, searchTerm, products]);
  
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };
  
  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (productsLoading) {
    return <div className="container py-12 text-center">Loading designs...</div>;
  }

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Browse Our CNC Door Designs</h1>
        <p className="text-muted-foreground">
          Discover our collection of premium CNC door designs for your home or business
        </p>
      </div>
      
      <div className="mb-8">
        <SearchBar value={searchTerm} onChange={handleSearch} />
        <CategoryFilter 
          categories={cncCategories} 
          selectedCategory={selectedCategory} 
          onSelectCategory={handleCategorySelect} 
        />
      </div>
      
      {filteredProducts.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No designs found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
};

export default DesignsPage;