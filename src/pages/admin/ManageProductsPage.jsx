import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProducts } from '@/context/ProductContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Trash2, Search } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { productTypes, categories as allCategories } from '@/data/products';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const BulkAddModal = ({ open, onClose, onBulkAdd }) => {
  const [csv, setCsv] = useState('');
  const [preview, setPreview] = useState([]);
  const [error, setError] = useState('');

  const parseCsv = () => {
    setError('');
    try {
      const lines = csv.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      const products = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const obj = {};
        headers.forEach((h, i) => { obj[h] = values[i]; });
        return obj;
      });
      setPreview(products);
    } catch (e) {
      setError('Invalid CSV format');
    }
  };

  const handleBulkAdd = () => {
    onBulkAdd(preview);
    setCsv('');
    setPreview([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Add Products (CSV)</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <textarea
            className="w-full border rounded p-2 text-sm"
            rows={6}
            placeholder="name,description,price,category,productType,imageUrl,downloadFormat,compatibility,dimensions"
            value={csv}
            onChange={e => setCsv(e.target.value)}
          />
          <Button size="sm" onClick={parseCsv}>Preview</Button>
          {error && <div className="text-red-500 text-xs">{error}</div>}
          {preview.length > 0 && (
            <div className="max-h-40 overflow-auto border rounded p-2 text-xs bg-muted/30">
              <pre>{JSON.stringify(preview, null, 2)}</pre>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleBulkAdd} disabled={preview.length === 0}>Add All</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ManageProductsPage = () => {
  const { products, deleteProduct, loading, addProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [bulkOpen, setBulkOpen] = useState(false);

  const filteredProducts = products
    .filter(p => searchTerm === '' || p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(p => filterType === 'all' || p.productType === filterType)
    .filter(p => filterCategory === 'all' || p.category === filterCategory);

  if (loading) {
    return <div className="container py-12 text-center">Loading products...</div>;
  }
  
  const availableCategories = allCategories.filter(cat => 
    filterType === 'all' || cat.productType === filterType || cat.id === 'all'
  );

  const handleBulkAdd = async (products) => {
    for (const p of products) {
      await addProduct(p);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Manage Products</h1>
          <p className="text-muted-foreground">View, edit, or delete your products.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/products/add">
            <Button className="flex items-center gap-2 w-full sm:w-auto">
              <PlusCircle className="h-4 w-4" /> Add New Product
            </Button>
          </Link>
          <Button variant="outline" onClick={() => setBulkOpen(true)}>
            Bulk Add Products
          </Button>
        </div>
      </div>
      <BulkAddModal open={bulkOpen} onClose={() => setBulkOpen(false)} onBulkAdd={handleBulkAdd} />
      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          <CardDescription>A list of all products in your store.</CardDescription>
           <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                {productTypes.map(pt => (
                  <SelectItem key={pt.id} value={pt.id}>{pt.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden sm:table-cell">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell className="hidden sm:table-cell">
                      <img 
                        alt={product.name}
                        className="aspect-square rounded-md object-cover"
                        style={{ height: '64px', width: '64px' }}
                       src="https://images.unsplash.com/photo-1646193186132-7976c1670e81" />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="capitalize">{product.productType}</TableCell>
                    <TableCell className="capitalize">{product.category}</TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Link to={`/admin/products/edit/${product._id}`}>
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the product "{product.name}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteProduct(product._id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    No products found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ManageProductsPage;