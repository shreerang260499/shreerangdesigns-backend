import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

const ProductCard = React.memo(({ product }) => {
  const { addItem } = useCart();
  
  const handleAddToCart = React.useCallback(() => {
    addItem(product);
  }, [product._id, addItem]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="product-card"
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <Link to={`/designs/${product._id}`}>
          <div className="aspect-square relative overflow-hidden">
            <img   
              loading="lazy"
              decoding="async"
              width={400}
              height={400}
              className="object-contain w-full h-full transition-transform duration-300 hover:scale-105 bg-white" 
              alt={`${product.name} - ${product.productType === 'cnc' ? 'CNC door design' : 'Printable Art'}`}
              src={product.imageUrl || "https://via.placeholder.com/400x400?text=No+Image"} 
              onError={(e) => e.target.src = "https://via.placeholder.com/400x400?text=Image+Error"} />
            
            {product.bestseller && (
              <Badge 
                variant="default" 
                className="absolute top-2 right-2 bg-primary/90 backdrop-blur-sm"
              >
                Bestseller
              </Badge>
            )}
             <Badge 
                variant="secondary" 
                className="absolute top-2 left-2 bg-secondary/90 backdrop-blur-sm capitalize"
              >
                {product.productType}
              </Badge>
          </div>
        </Link>
        
        <CardContent className="p-4 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="font-medium truncate">{product.name}</h3>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <span className="font-medium">{formatPrice(product.price)}</span>
          <Button 
            size="sm" 
            onClick={() => addItem(product)}
            className="gap-1"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add</span>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
});

export default ProductCard;