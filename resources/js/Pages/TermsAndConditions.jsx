import React from "react";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";

const TermsAndConditions = () => (
  <>
    <Header />
    <main className="shopItemsSection">
      <div className="shopItemsGrid">
        <div className="shopItemCard">
          <h1 className="shopItemName">Terms and Conditions</h1>
          <p className="terms-text">
            By using this marketplace, you agree to abide by all local laws and regulations. Please review our terms and conditions for more information about your rights and responsibilities.
          </p>
        </div>
      </div>
    </main>
    <Footer />
  </>
);

export default TermsAndConditions;
