import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Calendar, AlertTriangle } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container py-12 text-center">
        <p>Loading user profile...</p>
      </div>
    );
  }

  const handleRedownload = (itemName, downloadUrl, expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);

    if (now > expiry) {
      toast({
        title: "Download Expired",
        description: `The download link for ${itemName} has expired.`,
        variant: "destructive",
      });
    } else {
      // Simulate download
      toast({
        title: "Download Started",
        description: `Downloading ${itemName}... (This is a mock download)`,
      });
      // In a real app, you would trigger a file download here:
      // window.location.href = downloadUrl;
      console.log("Mock download URL:", downloadUrl);
    }
  };

  const isDownloadExpired = (expiryDate) => {
    return new Date() > new Date(expiryDate);
  };

  return (
    <div className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome, {user.name || "User"}!</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is your profile page where you can view your purchase history and manage your account.</p>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mb-6">Purchase History</h2>
        {user.purchaseHistory && user.purchaseHistory.length > 0 ? (
          <div className="space-y-6">
            {user.purchaseHistory.map((order) => (
              <Card key={order.orderId}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Order ID: {order.orderId}</CardTitle>
                      <CardDescription>
                        Date: {new Date(order.date).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <span className="text-lg font-semibold">{formatPrice(order.total)}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="text-md font-semibold mb-2">Items:</h3>
                  <ul className="space-y-4">
                    {order.items.map((item) => {
                      const expired = isDownloadExpired(item.expiryDate);
                      return (
                        <li key={item.id} className="flex flex-col sm:flex-row justify-between sm:items-center p-3 border rounded-md bg-muted/30">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{formatPrice(item.price)}</p>
                            <div className={`flex items-center text-xs mt-1 ${expired ? 'text-destructive' : 'text-muted-foreground'}`}>
                              {expired ? <AlertTriangle className="h-3 w-3 mr-1" /> : <Calendar className="h-3 w-3 mr-1" />}
                              Download expires: {new Date(item.expiryDate).toLocaleDateString()}
                              {expired && " (Expired)"}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant={expired ? "secondary" : "default"}
                            onClick={() => handleRedownload(item.name, item.downloadUrl, item.expiryDate)}
                            className="mt-2 sm:mt-0 gap-1"
                            disabled={expired && !item.downloadUrl} 
                          >
                            <Download className="h-4 w-4" />
                            {expired ? "Expired" : "Re-download"}
                          </Button>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">You have no purchase history yet.</p>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default ProfilePage;