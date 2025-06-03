import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useProducts } from "@/context/ProductContext";
import { categories as allCategories } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import SearchBar from "@/components/SearchBar";
import { filterProductsByCategory, searchProducts } from "@/lib/utils";
import { FixedSizeGrid as Grid } from "react-window";
import useWindowDimensions from "../lib/useWindowDimensions"; // We'll add a simple hook for responsive grid width

const GRID_COLUMN_COUNT = 4; // xl: 4 columns
const GRID_ROW_HEIGHT = 370; // px, adjust as needed for ProductCard
const GRID_GAP = 24; // px, matches gap-6

const DesignsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get("category");
  
  const { products, loading: productsLoading, hasMore, loadMore } = useProducts();
  const cncProducts = products.filter(p => p.productType === 'cnc');
  const cncCategories = [{ id: "all", name: "All CNC Designs", productType: "cnc" }, ...allCategories.filter(c => c.productType === "cnc" || c.productType === "all" && c.id === "all")];
  
  const observerTarget = React.useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !productsLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, productsLoading, loadMore]);


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

  // Responsive column count
  const { width: windowWidth } = useWindowDimensions();
  let columnCount = 1;
  if (windowWidth >= 1280) columnCount = 4;
  else if (windowWidth >= 1024) columnCount = 3;
  else if (windowWidth >= 640) columnCount = 2;

  const columnWidth = Math.floor((windowWidth - 2 * 32 - (columnCount - 1) * GRID_GAP) / columnCount); // 32px container padding
  const rowCount = Math.ceil(filteredProducts.length / columnCount);

  // Virtualized cell renderer
  const Cell = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * columnCount + columnIndex;
    if (index >= filteredProducts.length) return null;
    const product = filteredProducts[index];
    return (
      <div style={{ ...style, left: style.left + GRID_GAP * columnIndex, top: style.top + GRID_GAP * rowIndex, width: style.width - GRID_GAP, height: style.height - GRID_GAP }}>
        <ProductCard key={product._id} product={product} />
      </div>
    );
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
        <div style={{ width: "100%", minHeight: 400, position: "relative" }}>
          <Grid
            columnCount={columnCount}
            columnWidth={columnWidth}
            height={Math.min(3, rowCount) * GRID_ROW_HEIGHT + (Math.min(3, rowCount) - 1) * GRID_GAP}
            rowCount={rowCount}
            rowHeight={GRID_ROW_HEIGHT}
            width={windowWidth - 2 * 32}
            style={{ overflowX: "hidden" }}
          >
            {Cell}
          </Grid>
          {/* Infinite scroll trigger */}
          {hasMore && (
            <div ref={observerTarget} className="col-span-full flex justify-center py-8">
              {productsLoading && (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              )}
            </div>
          )}
        </div>
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