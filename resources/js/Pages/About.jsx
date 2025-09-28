import React from "react";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";

const About = () => (
  <>
    <Header />
    <main className="shopItemsSection" style={{ minHeight: '60vh' }}>
      <div className="shopItemsGrid" style={{ justifyContent: 'center' }}>
        <div className="shopItemCard" style={{ maxWidth: '700px', width: '100%' }}>
          <h1 className="shopItemName" style={{ fontSize: '2rem', marginBottom: '1rem' }}>About Us</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-gray-dark)' }}>
            Barangay Gen T. De Leon Marketplace is dedicated to empowering local commerce and connecting residents with local treasures. Our mission is to make buying and selling easy, safe, and rewarding for everyone in the community.
          </p>
        </div>
      </div>
    </main>
    <Footer />
  </>
);

export default About;
