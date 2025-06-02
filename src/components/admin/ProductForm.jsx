import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { productTypes, categories as allCategories } from '@/data/products';
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProductForm = ({ onSubmit, initialData = {}, isEditing = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    productType: 'cnc', 
    imageUrl: '',
    downloadFormat: '',
    compatibility: '',
    dimensions: '',
    featured: false,
    bestseller: false,
    downloadUrl: '',
    ...initialData,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData, price: initialData.price?.toString() || '' }));
    }
  }, [initialData]);

  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    const filtered = allCategories.filter(cat => cat.productType === formData.productType || cat.id === 'all');
    setAvailableCategories(filtered);
    if (initialData.productType === formData.productType && !filtered.find(cat => cat.id === formData.category)) {
      setFormData(prev => ({ ...prev, category: '' }));
    } else if (!isEditing && filtered.length > 0 && filtered[0].id !== 'all') {
       setFormData(prev => ({ ...prev, category: filtered[0].id }));
    }

  }, [formData.productType, initialData.productType, isEditing]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'productType') {
        const currentCategory = allCategories.find(cat => cat.id === formData.category);
        if (currentCategory && currentCategory.productType !== value && currentCategory.id !== 'all') {
          setFormData(prev => ({ ...prev, category: '' })); 
        }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert price to number before submitting
    const submitData = { ...formData, price: formData.price ? parseFloat(formData.price) : 0 };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</CardTitle>
          <CardDescription>
            {isEditing ? 'Update the details of this product.' : 'Fill in the details for the new product.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (INR)</Label>
              <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="productType">Product Type</Label>
              <Select name="productType" value={formData.productType} onValueChange={(value) => handleSelectChange('productType', value)}>
                <SelectTrigger id="productType">
                  <SelectValue placeholder="Select product type" />
                </SelectTrigger>
                <SelectContent>
                  {productTypes.filter(pt => pt.id !== 'all').map(pt => (
                    <SelectItem key={pt.id} value={pt.id}>{pt.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" value={formData.category} onValueChange={(value) => handleSelectChange('category', value)} required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.filter(cat => cat.id !== 'all').map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (Pinterest placeholder supported)</Label>
            <Input id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Paste a Pinterest image URL or any image link" />
            <p className="text-xs text-muted-foreground">Paste a direct image URL from Pinterest or any image hosting site. Example: https://i.pinimg.com/...</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="downloadFormat">Download Format(s)</Label>
              <Input id="downloadFormat" name="downloadFormat" value={formData.downloadFormat} onChange={handleChange} placeholder="e.g., DXF, DWG or JPG, PNG (300 DPI)" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="dimensions">Dimensions / Sizes</Label>
              <Input id="dimensions" name="dimensions" value={formData.dimensions} onChange={handleChange} placeholder="e.g., Standard door size or A3, A4" />
            </div>
          </div>
          
          {formData.productType === 'cnc' && (
            <div className="space-y-2">
              <Label htmlFor="compatibility">Compatibility (for CNC)</Label>
              <Input id="compatibility" name="compatibility" value={formData.compatibility} onChange={handleChange} placeholder="e.g., Compatible with all standard CNC machines" />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="downloadUrl">Download URL</Label>
            <Input id="downloadUrl" name="downloadUrl" value={formData.downloadUrl || ''} onChange={handleChange} placeholder="https://... or /files/design.zip" />
            <p className="text-xs text-muted-foreground">Paste a direct link to the downloadable file (Google Drive, Dropbox, S3, etc.).</p>
          </div>

          <div className="flex items-center space-x-6 pt-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="featured" name="featured" checked={formData.featured} onCheckedChange={(checked) => handleSelectChange('featured', checked)} />
              <Label htmlFor="featured" className="font-normal">Featured Product</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="bestseller" name="bestseller" checked={formData.bestseller} onCheckedChange={(checked) => handleSelectChange('bestseller', checked)} />
              <Label htmlFor="bestseller" className="font-normal">Bestseller</Label>
            </div>
          </div>

        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>Cancel</Button>
          <Button type="submit">{isEditing ? 'Save Changes' : 'Add Product'}</Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default ProductForm;