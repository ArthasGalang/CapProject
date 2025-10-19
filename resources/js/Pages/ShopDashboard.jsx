import React from "react";

import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import ShopSidebar from "@/Components/ShopSidebar";

const ShopDashboard = () => (
  <>
    <Header />
    <main style={{ background: '#f7f8fb', minHeight: '70vh', padding: '2rem 0' }}>
      <div style={{ maxWidth: 1500, margin: '0 auto', display: 'flex', gap: '2.5rem' }}>
        {/* Sidebar */}
        <ShopSidebar active="dashboard" />
        {/* Main Content */}
        <div style={{ flex: 1 }}>
          <div style={{ background: '#fff', borderRadius: '1.2rem', boxShadow: '0 2px 16px rgba(44,204,113,0.07)', padding: '2.5rem 2rem', marginBottom: '2rem' }}>
            <h1 style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '2rem', marginBottom: '0.2rem' }}>Dashboard</h1>
            <div style={{ color: '#5C6060', fontWeight: 500, fontSize: '1.08rem', marginBottom: '2.2rem' }}>Welcome back! Here's an overview of your store performance</div>
            {/* Recent Orders */}
            <div style={{ background: '#f7f8fa', borderRadius: '1rem', marginBottom: '2rem', boxShadow: '0 1px 4px rgba(44,204,113,0.03)' }}>
              <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '1.2rem', padding: '1.2rem 1.5rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Recent Orders</span>
                <a href="#" style={{ color: 'var(--color-primary)', fontWeight: 500, fontSize: '1rem', textDecoration: 'none' }}>View All</a>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'transparent' }}>
                <thead>
                  <tr style={{ color: '#888', fontWeight: 600, fontSize: '1.05rem' }}>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Order ID</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Customer</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Amount</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: '#fff', borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>#ORD-5523</td>
                    <td style={{ padding: '1rem' }}>Anjie Co</td>
                    <td style={{ padding: '1rem' }}>May 15, 2025</td>
                    <td style={{ padding: '1rem' }}>₱125.00</td>
                    <td style={{ padding: '1rem' }}><span style={{ background: '#FFF9E5', color: '#B8860B', fontWeight: 600, borderRadius: '0.7rem', padding: '0.4rem 1.1rem', fontSize: '0.98rem' }}>Processing</span></td>
                    <td style={{ padding: '1rem' }}><button style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.98rem', padding: '0.5rem 1.2rem', cursor: 'pointer' }}>Details</button></td>
                  </tr>
                  <tr style={{ background: '#fff', borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>#ORD-5522</td>
                    <td style={{ padding: '1rem' }}>Jhaycee Bocarile</td>
                    <td style={{ padding: '1rem' }}>May 14, 2025</td>
                    <td style={{ padding: '1rem' }}>₱89.50</td>
                    <td style={{ padding: '1rem' }}><span style={{ background: '#E6F7F7', color: 'var(--color-primary)', fontWeight: 600, borderRadius: '0.7rem', padding: '0.4rem 1.1rem', fontSize: '0.98rem' }}>Shipped</span></td>
                    <td style={{ padding: '1rem' }}><button style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.98rem', padding: '0.5rem 1.2rem', cursor: 'pointer' }}>Details</button></td>
                  </tr>
                  <tr style={{ background: '#fff', borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>#ORD-5521</td>
                    <td style={{ padding: '1rem' }}>Rence Cababan</td>
                    <td style={{ padding: '1rem' }}>May 14, 2025</td>
                    <td style={{ padding: '1rem' }}>₱245.99</td>
                    <td style={{ padding: '1rem' }}><span style={{ background: '#E6F7EC', color: 'var(--color-primary)', fontWeight: 600, borderRadius: '0.7rem', padding: '0.4rem 1.1rem', fontSize: '0.98rem' }}>Delivered</span></td>
                    <td style={{ padding: '1rem' }}><button style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.98rem', padding: '0.5rem 1.2rem', cursor: 'pointer' }}>Details</button></td>
                  </tr>
                  <tr style={{ background: '#fff', borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>#ORD-5520</td>
                    <td style={{ padding: '1rem' }}>Jan Galang</td>
                    <td style={{ padding: '1rem' }}>May 13, 2025</td>
                    <td style={{ padding: '1rem' }}>₱112.75</td>
                    <td style={{ padding: '1rem' }}><span style={{ background: '#FFEAEA', color: '#E74C3C', fontWeight: 600, borderRadius: '0.7rem', padding: '0.4rem 1.1rem', fontSize: '0.98rem' }}>Cancelled</span></td>
                    <td style={{ padding: '1rem' }}><button style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.98rem', padding: '0.5rem 1.2rem', cursor: 'pointer' }}>Details</button></td>
                  </tr>
                  <tr style={{ background: '#fff', borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>#ORD-5519</td>
                    <td style={{ padding: '1rem' }}>Ryan Sales</td>
                    <td style={{ padding: '1rem' }}>May 13, 2025</td>
                    <td style={{ padding: '1rem' }}>₱78.25</td>
                    <td style={{ padding: '1rem' }}><span style={{ background: '#E6F7F7', color: 'var(--color-primary)', fontWeight: 600, borderRadius: '0.7rem', padding: '0.4rem 1.1rem', fontSize: '0.98rem' }}>Shipped</span></td>
                    <td style={{ padding: '1rem' }}><button style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.98rem', padding: '0.5rem 1.2rem', cursor: 'pointer' }}>Details</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Performance and Inventory Alerts */}
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              {/* Performance Report */}
              <div style={{ flex: 2, background: '#fff', borderRadius: '1rem', boxShadow: '0 1px 4px rgba(44,204,113,0.03)', marginTop: '0.5rem', padding: '1.5rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '1.1rem', marginBottom: '1rem' }}>Performance Report</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ color: '#888', fontWeight: 500, fontSize: '1rem' }}>Last 7 Days</span>
                  <button style={{ color: 'var(--color-primary)', background: '#f3f4f6', border: 'none', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.98rem', padding: '0.4rem 1.1rem', cursor: 'pointer' }}>Download</button>
                </div>
                {/* Placeholder Bar Chart */}
                <div style={{ display: 'flex', alignItems: 'flex-end', height: 120, gap: '1.2rem', marginTop: '1rem' }}>
                  {[60, 100, 40, 80, 110, 70, 50].map((h, i) => (
                    <div key={i} style={{ width: 32, height: h, background: 'var(--color-primary)', borderRadius: '0.5rem', transition: 'height 0.2s' }}></div>
                  ))}
                </div>
              </div>
              {/* Inventory Alerts */}
              <div style={{ flex: 1, background: '#fff', borderRadius: '1rem', boxShadow: '0 1px 4px rgba(44,204,113,0.03)', marginTop: '0.5rem', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '1.1rem' }}>Inventory Alerts</div>
                  <a href="#" style={{ color: 'var(--color-primary)', fontWeight: 500, fontSize: '0.98rem', textDecoration: 'none' }}>Manage Inventory</a>
                </div>
                {/* Alerts */}
                <div style={{ background: '#FFEAEA', color: '#E74C3C', borderRadius: '0.7rem', padding: '1rem 1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>Out of Stock</div>
                    <div style={{ fontWeight: 500, fontSize: '0.98rem', color: '#E74C3C' }}>Product Name (SKU: HD-5523)</div>
                  </div>
                  <button style={{ background: '#E74C3C', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.98rem', padding: '0.5rem 1.2rem', cursor: 'pointer' }}>Restock</button>
                </div>
                <div style={{ background: '#FFF9E5', color: '#B8860B', borderRadius: '0.7rem', padding: '1rem 1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>Low Stock (3 left)</div>
                    <div style={{ fontWeight: 500, fontSize: '0.98rem', color: '#B8860B' }}>Product Name (SKU: MS-8845)</div>
                  </div>
                  <button style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.98rem', padding: '0.5rem 1.2rem', cursor: 'pointer' }}>Restock</button>
                </div>
                <div style={{ background: '#FFF9E5', color: '#B8860B', borderRadius: '0.7rem', padding: '1rem 1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>Low Stock (5 left)</div>
                    <div style={{ fontWeight: 500, fontSize: '0.98rem', color: '#B8860B' }}>Product Name (SKU: SP-7712)</div>
                  </div>
                  <button style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.98rem', padding: '0.5rem 1.2rem', cursor: 'pointer' }}>Restock</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </>
);

export default ShopDashboard;
