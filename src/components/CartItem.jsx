
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

const CartItem = ({ item, onRemove }) => {
  return (
    <div className="flex items-center py-4 border-b">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
        <img  
          className="h-full w-full object-cover" 
          alt={item.name}
         src="https://images.unsplash.com/photo-1568572722184-a2e82ce38577" />
      </div>
      
      <div className="ml-4 flex-1">
        <h3 className="text-sm font-medium">{item.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{item.category}</p>
        <p className="mt-1 text-sm font-medium">{formatPrice(item.price)}</p>
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onRemove(item.id)}
        className="text-muted-foreground hover:text-foreground"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Remove</span>
      </Button>
    </div>
  );
};

export default CartItem;
