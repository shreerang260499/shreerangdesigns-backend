import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';
import { initialProducts } from '@/data/products';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('API URL:', API_URL); // Debug API URL

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [cache, setCache] = useState(new Map());
  const { token } = useAuth();

  // Cache product data by ID for faster lookups
  const memoizedGetProductById = React.useCallback((productId) => {
    if (cache.has(productId)) {
      return cache.get(productId);
    }
    const product = products.find(p => p._id === productId);
    if (product) {
      setCache(prev => new Map(prev).set(productId, product));
    }
    return product;
  }, [products, cache]);

  // Fetch products with pagination and better error handling
  useEffect(() => {
    const fetchProducts = async () => {
      if (!hasMore || loading) return;
      setLoading(true);
      setError(null);
      
      console.log('Fetching products, page:', page); // Debug pagination
      
      try {
        const limit = 20;
        console.log('Fetching from:', `${API_URL}/products?page=${page}&limit=${limit}`); // Debug URL
        
        const data = await apiRequest(`${API_URL}/products?page=${page}&limit=${limit}`);
        console.log('Received products:', data?.length || 0); // Debug response
        
        if (!data || !Array.isArray(data)) {
          console.error('Invalid products data:', data);
          throw new Error('Invalid response from server');
        }

        setProducts(prev => {
          const existingIds = new Set(prev.map(p => p._id));
          const newProducts = data.filter(p => !existingIds.has(p._id));
          const result = page === 1 ? data : [...prev, ...newProducts];
          console.log('Total products after update:', result.length); // Debug state update
          return result;
        });

        if (!data || data.length < limit) {
          setHasMore(false);
          console.log('No more products to load'); // Debug pagination end
        }
      } catch (err) {
        const errorMessage = err.message || 'Failed to load products';
        console.error('Product fetch error:', err, '\nAPI URL:', API_URL); // Detailed error log
        setError(errorMessage);
        
        if (page === 1) {
          console.log('Falling back to static products'); // Debug fallback
          setProducts(initialProducts);
          setHasMore(false);
        }
        
        toast({ 
          title: 'Error loading products',
          description: errorMessage,
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page]);

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

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const value = React.useMemo(() => ({
    products,
    loading,
    error,
    hasMore,
    loadMore,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById: memoizedGetProductById
  }), [products, loading, error, hasMore, loadMore, addProduct, updateProduct, deleteProduct, memoizedGetProductById]);

  return (
    <ProductContext.Provider value={value}>
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