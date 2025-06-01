import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProductProvider } from "@/context/ProductContext";
import { Toaster } from "@/components/ui/toaster";

// Layout Components
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminLayout from "@/components/admin/AdminLayout";

// Pages
import HomePage from "@/pages/HomePage";
import DesignsPage from "@/pages/DesignsPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import LoginPage from "@/pages/LoginPage";
import ProfilePage from "@/pages/ProfilePage";
import ProtectedRoute from "@/components/ProtectedRoute";
import PrintableDesignsPage from "@/pages/PrintableDesignsPage";
import SignupPage from "@/pages/SignupPage";
import ResetPasswordRequestPage from "@/pages/ResetPasswordRequestPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";

// Admin Pages
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import ManageProductsPage from "@/pages/admin/ManageProductsPage";
import AddProductPage from "@/pages/admin/AddProductPage";
import EditProductPage from "@/pages/admin/EditProductPage";
import CustomerManagementPage from "@/pages/admin/CustomerManagementPage";
import PromoCodesPage from "@/pages/admin/PromoCodesPage";


function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <Router>
            <div className="flex min-h-screen flex-col">
              <Routes>
                <Route path="/admin/*" element={
                  <ProtectedRoute adminRequired={true}>
                    <AdminLayout>
                      <Routes>
                        <Route path="dashboard" element={<AdminDashboardPage />} />
                        <Route path="products" element={<ManageProductsPage />} />
                        <Route path="products/add" element={<AddProductPage />} />
                        <Route path="products/edit/:id" element={<EditProductPage />} />
                        <Route path="customers" element={<CustomerManagementPage />} />
                        <Route path="promocodes" element={<PromoCodesPage />} />
                      </Routes>
                    </AdminLayout>
                  </ProtectedRoute>
                } />
                <Route path="/*" element={<MainApp />} />
              </Routes>
            </div>
            <Toaster />
          </Router>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

const MainApp = () => (
  <>
    <Navbar />
    <main className="flex-1">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/designs" element={<DesignsPage />} />
        <Route path="/designs/:id" element={<ProductDetailPage />} />
        <Route path="/printable-designs" element={<PrintableDesignsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        <Route path="/reset-password" element={<ResetPasswordRequestPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Routes>
    </main>
    <Footer />
  </>
);

export default App;