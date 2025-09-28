import React from "react";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";

const TermsAndConditions = () => (
  <>
    <Header />
    <main className="shopItemsSection" style={{ minHeight: '60vh' }}>
      <div className="shopItemsGrid" style={{ justifyContent: 'center' }}>
        <div className="shopItemCard" style={{ maxWidth: '700px', width: '100%' }}>
          <h1 className="shopItemName" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Terms and Conditions</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-gray-dark)' }}>
            By using this marketplace, you agree to abide by all local laws and regulations. Please review our terms and conditions for more information about your rights and responsibilities.
          </p>
        </div>
      </div>
    </main>
    <Footer />
  </>
);

export default TermsAndConditions;
