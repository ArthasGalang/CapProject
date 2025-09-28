import React from 'react';

import Header from '../Components/Header';
import Footer from '../Components/Footer';
import ShopSidebar from '../Components/ShopSidebar';

const ShopOrders = () => (
  <>
    <Header />
    <main style={{ background: '#f7f8fa', minHeight: '70vh', padding: '2rem 0' }}>
      <div style={{ maxWidth: 1500, margin: '0 auto', display: 'flex', gap: '2.5rem' }}>
        <ShopSidebar active="orders" />
        <div style={{ flex: 1 }}>
          <div style={{ background: '#fff', borderRadius: '1.2rem', boxShadow: '0 2px 16px rgba(44,204,113,0.07)', padding: '2.5rem 2rem' }}>
            <div className="order-management">
              <div className="order-management__header">
                <h2 className="order-management__title">Shop Orders</h2>
                <div className="order-management__subtitle">Manage and process your customer orders</div>
              </div>
              <div className="order-management__filter">
                <select className="order-management__select">
                  <option>All Orders</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </div>
              <div className="order-management__table-wrapper">
                <table className="order-management__table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>#ORD-5523</td>
                      <td>Anjie Co</td>
                      <td>May 15, 2025</td>
                      <td>P125.00</td>
                      <td><span className="order-status order-status--processing">Processing</span></td>
                      <td><button className="order-action-btn">Details</button></td>
                    </tr>
                    <tr>
                      <td>#ORD-5522</td>
                      <td>Jhaycee Bocarile</td>
                      <td>May 14, 2025</td>
                      <td>P89.50</td>
                      <td><span className="order-status order-status--shipped">Shipped</span></td>
                      <td><button className="order-action-btn">Details</button></td>
                    </tr>
                    <tr>
                      <td>#ORD-5521</td>
                      <td>Rence Cababan</td>
                      <td>May 14, 2025</td>
                      <td>P245.99</td>
                      <td><span className="order-status order-status--delivered">Delivered</span></td>
                      <td><button className="order-action-btn">Details</button></td>
                    </tr>
                    <tr>
                      <td>#ORD-5520</td>
                      <td>Jan Galang</td>
                      <td>May 13, 2025</td>
                      <td>P112.75</td>
                      <td><span className="order-status order-status--cancelled">Cancelled</span></td>
                      <td><button className="order-action-btn">Details</button></td>
                    </tr>
                    <tr>
                      <td>#ORD-5519</td>
                      <td>Ryan Sales</td>
                      <td>May 13, 2025</td>
                      <td>P78.25</td>
                      <td><span className="order-status order-status--shipped">Shipped</span></td>
                      <td><button className="order-action-btn">Details</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </>
);

export default ShopOrders;
