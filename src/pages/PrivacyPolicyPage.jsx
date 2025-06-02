import React from "react";
import { motion } from "framer-motion";

const PrivacyPolicyPage = () => {
  return (
    <div className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last Updated: June 2, 2025
          </p>
        </div>

        <section className="space-y-4">
          <p>
            Shree Rang Designs ("Company," "we," "our," or "us") respects your privacy and is committed to protecting 
            the personal information you share with us. This Privacy Policy explains how we collect, use, disclose, 
            and safeguard your information when you visit our website, use our application, or access our services 
            (collectively, the "Service"). Please read this Privacy Policy carefully. By using our Service, you 
            consent to the practices described herein.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
          <p>We collect various types of information to provide and improve our Service:</p>
          
          <div className="pl-6">
            <h3 className="text-xl font-medium mt-4 mb-2">1.1 Personal Information</h3>
            <p>We may collect personal information that you provide to us when you interact with the Service, such as:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Billing address</li>
              <li>Payment information</li>
              <li>Account login credentials</li>
            </ul>

            <h3 className="text-xl font-medium mt-4 mb-2">1.2 Usage Data</h3>
            <p>We automatically collect information about how you interact with the Service, such as:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Pages visited on our site</li>
              <li>Time and date of access</li>
              <li>Referring URL</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
          <p>We use the information we collect for various purposes, including:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>To provide, maintain, and improve our Service</li>
            <li>To personalize your experience and communicate with you</li>
            <li>To process transactions and manage payments</li>
            <li>To respond to customer service inquiries and provide support</li>
            <li>To send promotional materials, offers, and updates (you can opt out at any time)</li>
            <li>To comply with legal obligations and enforce our policies</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. How We Share Your Information</h2>
          <p>We may share your information in the following circumstances:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Service Providers:</strong> We may share your data with third-party vendors who perform 
              services on our behalf, such as payment processing, analytics, and hosting services.
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose your information if required by law or if we 
              believe such action is necessary to protect our rights.
            </li>
            <li>
              <strong>Business Transfers:</strong> In the event of a merger or acquisition, your data may be 
              transferred as part of the transaction.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4. Data Security</h2>
          <p>
            We implement reasonable security measures to protect your personal information. However, no method of 
            transmission over the internet is 100% secure.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">5. Your Privacy Rights</h2>
          <p>You have certain rights regarding your personal data, including:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access to your personal data</li>
            <li>Correction of inaccurate data</li>
            <li>Deletion of your data (subject to certain conditions)</li>
            <li>Opting out of marketing communications</li>
            <li>Data portability</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">6. Children's Privacy</h2>
          <p>
            Our Service is not intended for individuals under the age of 16. We do not knowingly collect personal 
            data from children under 16.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">7. Updates to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of significant changes by 
            posting the new Privacy Policy on this page.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">8. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
          </p>
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p><strong>Shree Rang Designs</strong></p>
            <p>Naranpura, Ahmedabad, 380013, Gujarat</p>
            <p>Email: info.shreerangdesigns@gmail.com</p>
            <p>Phone: +91 8982377005</p>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicyPage;
