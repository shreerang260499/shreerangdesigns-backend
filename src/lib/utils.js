
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

// Format price to currency
export function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(price);
}

// Generate a random ID
export function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

// Filter products by category
export function filterProductsByCategory(products, category) {
  if (!category || category === 'all') return products;
  return products.filter(product => product.category === category);
}

// Search products by name
export function searchProducts(products, searchTerm) {
  if (!searchTerm) return products;
  const term = searchTerm.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(term) || 
    product.description.toLowerCase().includes(term)
  );
}
