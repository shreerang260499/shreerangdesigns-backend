import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useProducts } from "@/context/ProductContext";
import { categories as allCategories } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import SearchBar from "@/components/SearchBar";
import { filterProductsByCategory, searchProducts } from "@/lib/utils";

const PrintableDesignsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get("category");

  const { products, loading: productsLoading } = useProducts();
  const printableProducts = products.filter(p => p.productType === 'printable');
  const printableCategories = [{ id: "all", name: "All Printable Art", productType: "printable" }, ...allCategories.filter(c => c.productType === "printable" || c.productType === "all" && c.id === "all")];

  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(printableProducts);

  useEffect(() => {
    let result = printableProducts;

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
        staggerChildren: 0.1,
      },
    },
  };

  if (productsLoading) {
    return <div className="container py-12 text-center">Loading printable designs...</div>;
  }

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Explore Printable Art</h1>
        <p className="text-muted-foreground">
          High-resolution digital designs ready for printing. Perfect for home decor, gifts, and more.
        </p>
      </div>

      <div className="mb-8">
        <SearchBar value={searchTerm} onChange={handleSearch} />
        <CategoryFilter
          categories={printableCategories}
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
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No printable art found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
};

export default PrintableDesignsPage;