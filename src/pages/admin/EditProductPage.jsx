import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProducts } from '@/context/ProductContext';
import ProductForm from '@/components/admin/ProductForm';
import { toast } from '@/components/ui/use-toast';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, updateProduct, loading } = useProducts();
  
  const productToEdit = getProductById(id);

  if (loading) {
    return <div className="container py-12 text-center">Loading product data...</div>;
  }

  if (!productToEdit) {
    toast({ title: "Error", description: "Product not found.", variant: "destructive" });
    navigate('/admin/products');
    return null;
  }

  const handleSubmit = (productData) => {
    updateProduct(id, productData);
    navigate('/admin/products');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ProductForm onSubmit={handleSubmit} initialData={productToEdit} isEditing={true} />
    </motion.div>
  );
};

export default EditProductPage;