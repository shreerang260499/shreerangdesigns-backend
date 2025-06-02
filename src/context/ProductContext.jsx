import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await apiRequest(`${API_URL}/products`);
        setProducts(data);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Add product (admin)
  const addProduct = async (productData) => {
    setLoading(true);
    try {
      // Check if productData is FormData
      const isFormData = productData instanceof FormData;
      const newProduct = await apiRequest(
        `${API_URL}/products`, 
        'POST', 
        productData, 
        token,
        isFormData
      );
      setProducts(prev => [...prev, newProduct]);
      toast({ title: 'Product Added', description: `${newProduct.name} has been successfully added.` });
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Update product (admin)
  const updateProduct = async (productId, productData) => {
    setLoading(true);
    try {
      // Check if productData is FormData
      const isFormData = productData instanceof FormData;
      const updated = await apiRequest(
        `${API_URL}/products/${productId}`, 
        'PUT', 
        productData, 
        token,
        isFormData
      );
      setProducts(prev => prev.map(p => p._id === productId ? updated : p));
      toast({ title: 'Product Updated', description: `${updated.name} has been successfully updated.` });
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Delete product (admin)
  const deleteProduct = async (productId) => {
    setLoading(true);
    try {
      await apiRequest(`${API_URL}/products/${productId}`, 'DELETE', null, token);
      setProducts(prev => prev.filter(p => p._id !== productId));
      toast({ title: 'Product Deleted', description: 'Product has been deleted.', variant: 'destructive' });
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const getProductById = (productId) => products.find(p => p._id === productId);

  return (
    <ProductContext.Provider value={{ products, loading, addProduct, updateProduct, deleteProduct, getProductById }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};