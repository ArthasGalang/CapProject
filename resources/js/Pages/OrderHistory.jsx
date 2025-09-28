import React from "react";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";

const OrderHistory = () => (
  <>
    <Header />
    <main className="shopItemsSection" style={{ minHeight: '60vh' }}>
      <div className="shopItemsGrid" style={{ justifyContent: 'center' }}>
        <div className="shopItemCard" style={{ maxWidth: '700px', width: '100%' }}>
          <h1 className="shopItemName" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Order History</h1>
          <div className="orderHistoryContent" style={{ marginTop: '1.5rem' }}>
            <p style={{ color: 'var(--color-gray-dark)' }}>No orders found.</p>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </>
);

export default OrderHistory;
