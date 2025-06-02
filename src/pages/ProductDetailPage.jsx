import React from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart, Download, FileText, Maximize } from "lucide-react";
import { useProducts } from "@/context/ProductContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const { products, loading, getProductById } = useProducts();
  
  const product = getProductById(id);
  
  if (loading) {
    return <div className="container py-12 text-center">Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Design Not Found</h1>
        <p className="mb-6">The design you're looking for doesn't exist or has been removed.</p>
        <Link to="/designs">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Designs
          </Button>
        </Link>
      </div>
    );
  }
  
  const relatedProducts = products
    .filter(p => p._id !== product._id && p.category === product.category && p.productType === product.productType)
    .slice(0, 3);

  return (
    <div className="container py-12">
      <Link to={product.productType === 'cnc' ? "/designs" : "/printable-designs"} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to {product.productType === 'cnc' ? 'CNC Designs' : 'Printable Art'}
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-lg border"
        >
          <img   
            className="w-full h-auto object-contain aspect-square bg-white" 
            alt={`${product.name} - ${product.productType === 'cnc' ? 'CNC door design' : 'Printable Art'}`}
            src={product.imageUrl || "https://via.placeholder.com/800x800?text=No+Image"} 
            onError={(e) => e.target.src = "https://via.placeholder.com/800x800?text=Image+Error"} />
          
          {product.bestseller && (
            <Badge 
              variant="default" 
              className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm"
            >
              Bestseller
            </Badge>
          )}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div>
            <Badge variant="secondary" className="mb-2 capitalize">
              {product.category}
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            <p className="text-2xl font-bold mt-2">{formatPrice(product.price)}</p>
          </div>
          
          <p className="text-muted-foreground">{product.description}</p>
          
          <div className="space-y-4 border-t border-b py-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span>Format: {product.downloadFormat}</span>
            </div>
            {product.compatibility && (
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-muted-foreground" />
                <span>{product.compatibility}</span>
              </div>
            )}
             {product.dimensions && (
              <div className="flex items-center gap-2">
                <Maximize className="h-5 w-5 text-muted-foreground" />
                <span>Dimensions: {product.dimensions}</span>
              </div>
            )}
          </div>
          
          <Button 
            size="lg" 
            onClick={() => addItem(product)}
            className="w-full sm:w-auto"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
          
          <div className="text-sm text-muted-foreground">
            <p>
              After purchase, you'll receive an instant download link for your design files.
            </p>
          </div>
        </motion.div>
      </div>
      
      {relatedProducts.length > 0 && (
        <div className="mt-20">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map(relatedP => (
              <ProductCard key={relatedP._id} product={relatedP} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;