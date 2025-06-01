import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProducts } from '@/context/ProductContext';
import { useAuth } from '@/context/AuthContext';
import { Package, DollarSign, Users, ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { fetchAllOrders } from '@/lib/orders';

const AdminDashboardPage = () => {
  const { products, loading: productsLoading } = useProducts();
  const { user, token, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    const getOrders = async () => {
      if (!token) return;
      setOrdersLoading(true);
      try {
        const data = await fetchAllOrders(token);
        setOrders(data);
      } catch {
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };
    getOrders();
  }, [token]);

  if (productsLoading || authLoading || ordersLoading) {
    return <div className="container py-12 text-center">Loading dashboard data...</div>;
  }

  const totalProducts = products.length;
  const cncProductsCount = products.filter(p => p.productType === 'cnc').length;
  const printableProductsCount = products.filter(p => p.productType === 'printable').length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
  const totalCustomers = new Set(orders.map(order => order.user?.email)).size;

  const stats = [
    { title: 'Total Products', value: totalProducts, icon: <Package className="h-6 w-6 text-primary" />, color: "bg-blue-500/10" },
    { title: 'CNC Designs', value: cncProductsCount, icon: <Package className="h-6 w-6 text-green-500" />, color: "bg-green-500/10" },
    { title: 'Printable Art', value: printableProductsCount, icon: <Package className="h-6 w-6 text-purple-500" />, color: "bg-purple-500/10" },
    { title: 'Total Orders', value: totalOrders, icon: <ShoppingBag className="h-6 w-6 text-orange-500" />, color: "bg-orange-500/10" },
    { title: 'Total Revenue', value: formatPrice(totalRevenue), icon: <DollarSign className="h-6 w-6 text-red-500" />, color: "bg-red-500/10" },
    { title: 'Total Customers', value: totalCustomers, icon: <Users className="h-6 w-6 text-blue-500" />, color: "bg-blue-500/10" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className={`overflow-hidden ${stat.color}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-muted-foreground">No orders yet.</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {orders.slice(0, 5).map(order => (
                  <li key={order._id} className="text-sm">
                    Order #{order._id} by {order.user?.email || 'Unknown'} — {formatPrice(order.amount)}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Customer Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-muted-foreground">No customer purchases yet.</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {orders.slice(0, 5).map(order => (
                  <li key={order._id} className="text-sm">
                    {order.user?.email || 'Unknown'} purchased {order.products.length} item(s) on {new Date(order.createdAt).toLocaleDateString()} — {formatPrice(order.amount)}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default AdminDashboardPage;