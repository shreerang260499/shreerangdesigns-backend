import React from "react";
import { motion } from "framer-motion";

const TermsPage = () => {
  return (
    <div className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Terms and Conditions</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">1. Company Information</h2>
          <div className="space-y-4">
            <p>
              Shree Rang Designs ("we," "our," or "us") is a digital design company specializing in CNC door designs 
              and printable art. By accessing or using our services, you agree to these terms and conditions.
            </p>
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p><strong>Company Name:</strong> Shree Rang Designs</p>
              <p><strong>Email:</strong> info.shreerangdesigns@gmail.com</p>
              <p><strong>Phone:</strong> +91 8982377005</p>
              <p><strong>Address:</strong> Naranpura, Ahmedabad, 380013, Gujarat</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. Services</h2>
          <p>
            We provide digital downloads of CNC door designs and printable art. All designs are provided "as is" 
            and are subject to our licensing terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. Digital Products</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>All designs are provided as digital downloads</li>
            <li>Files are provided in standard formats compatible with CNC machines and printers</li>
            <li>No physical products are shipped</li>
            <li>Downloads are available immediately after payment confirmation</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4. Licensing Terms</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Single purchase grants single-use license</li>
            <li>Designs cannot be resold or redistributed</li>
            <li>Commercial use requires proper licensing</li>
            <li>Copyright remains with Shree Rang Designs</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">5. Refund Policy</h2>
          <p>
            Due to the digital nature of our products, we generally do not offer refunds. However, if you experience 
            technical issues with your download, please contact us within 24 hours of purchase.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">6. Contact</h2>
          <p>
            For any questions or concerns regarding these terms, please contact us at:
          </p>
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p>Email: info.shreerangdesigns@gmail.com</p>
            <p>Phone: +91 8982377005</p>
            <p>Address: Naranpura, Ahmedabad, 380013, Gujarat</p>
          </div>
        </section>

        <section className="space-y-4 mt-8">
          <p className="text-sm text-muted-foreground">
            By using our services, you acknowledge that you have read, understood, and agree to be bound by these 
            terms and conditions. We reserve the right to update these terms at any time without notice.
          </p>
        </section>
      </motion.div>
    </div>
  );
};

export default TermsPage;
