import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';

const PromoCodesPage = () => {
  const { token } = useAuth();
  const [promos, setPromos] = useState([]);
  const [form, setForm] = useState({ code: '', discountPercent: '', description: '', expiresAt: '' });
  const [loading, setLoading] = useState(false);

  const fetchPromos = async () => {
    setLoading(true);
    const data = await apiRequest(`${import.meta.env.VITE_API_URL}/promocodes`, 'GET', null, token);
    setPromos(data);
    setLoading(false);
  };

  useEffect(() => { fetchPromos(); }, [token]);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    await apiRequest(`${import.meta.env.VITE_API_URL}/promocodes`, 'POST', form, token);
    setForm({ code: '', discountPercent: '', description: '', expiresAt: '' });
    fetchPromos();
  };

  const handleDelete = async id => {
    await apiRequest(`${import.meta.env.VITE_API_URL}/promocodes/${id}`, 'DELETE', null, token);
    fetchPromos();
  };

  return (
    <div className="container py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add Promo Code</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
            <Input name="code" placeholder="Code (e.g. SAVE10)" value={form.code} onChange={handleChange} required />
            <Input name="discountPercent" type="number" placeholder="Discount %" value={form.discountPercent} onChange={handleChange} required min={1} max={100} />
            <Input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
            <Input name="expiresAt" type="date" value={form.expiresAt} onChange={handleChange} />
            <Button type="submit">Add Promo Code</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>All Promo Codes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <p>Loading...</p> : (
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Discount %</th>
                  <th>Description</th>
                  <th>Expires</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {promos.map(p => (
                  <tr key={p._id}>
                    <td>{p.code}</td>
                    <td>{p.discountPercent}</td>
                    <td>{p.description}</td>
                    <td>{p.expiresAt ? new Date(p.expiresAt).toLocaleDateString() : '-'}</td>
                    <td><Button size="sm" variant="destructive" onClick={() => handleDelete(p._id)}>Delete</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PromoCodesPage;
