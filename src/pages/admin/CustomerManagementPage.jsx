import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';

const CustomerManagementPage = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiRequest(`${import.meta.env.VITE_API_URL}/orders`, 'GET', null, token);
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchOrders();
  }, [token]);

  // Group orders by user
  const customers = {};
  orders.forEach(order => {
    const email = order.user?.email || 'Unknown';
    if (!customers[email]) {
      customers[email] = {
        name: order.user?.name || 'Unknown',
        email,
        orders: [],
        totalSpent: 0
      };
    }
    customers[email].orders.push(order);
    customers[email].totalSpent += order.amount;
  });

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Customer Management</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading customers...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : Object.keys(customers).length === 0 ? (
            <div>No customers found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border">
                <thead>
                  <tr className="bg-accent/30">
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Email</th>
                    <th className="p-2 border">Orders</th>
                    <th className="p-2 border">Total Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(customers).map((customer, idx) => (
                    <tr key={customer.email} className={idx % 2 ? 'bg-accent/10' : ''}>
                      <td className="p-2 border">{customer.name}</td>
                      <td className="p-2 border">{customer.email}</td>
                      <td className="p-2 border">{customer.orders.length}</td>
                      <td className="p-2 border">₹{customer.totalSpent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerManagementPage;
