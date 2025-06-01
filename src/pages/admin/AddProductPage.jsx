import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProducts } from '@/context/ProductContext';
import ProductForm from '@/components/admin/ProductForm';

const AddProductPage = () => {
  const navigate = useNavigate();
  const { addProduct } = useProducts();

  const handleSubmit = (productData) => {
    addProduct(productData);
    navigate('/admin/products');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ProductForm onSubmit={handleSubmit} />
    </motion.div>
  );
};

export default AddProductPage;