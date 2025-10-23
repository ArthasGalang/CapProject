
import React from "react";
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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
            {/* Dashboard Cards */}
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 220, background: '#f8fafc', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 1px 4px rgba(44,204,113,0.03)' }}>
                <div style={{ color: '#888', fontWeight: 500, fontSize: '1.05rem', marginBottom: 8 }}>Orders Pending</div>
                <div style={{ fontWeight: 700, fontSize: '2rem', color: 'var(--color-primary)' }}>₱114,801.25</div>
              </div>
              <div style={{ flex: 1, minWidth: 220, background: '#f8fafc', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 1px 4px rgba(44,204,113,0.03)' }}>
                <div style={{ color: '#888', fontWeight: 500, fontSize: '1.05rem', marginBottom: 8 }}>Sales (MTD)</div>
                <div style={{ fontWeight: 700, fontSize: '2rem', color: 'var(--color-primary)' }}>₱77,751.25</div>
              </div>
              <div style={{ flex: 1, minWidth: 220, background: '#f8fafc', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 1px 4px rgba(44,204,113,0.03)' }}>
                <div style={{ color: '#888', fontWeight: 500, fontSize: '1.05rem', marginBottom: 8 }}>New Customers (MTD)</div>
                <div style={{ fontWeight: 700, fontSize: '2rem', color: 'var(--color-primary)' }}>₱16,400.18</div>
              </div>
              <div style={{ flex: 1, minWidth: 220, background: '#f8fafc', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 1px 4px rgba(44,204,113,0.03)' }}>
                <div style={{ color: '#888', fontWeight: 500, fontSize: '1.05rem', marginBottom: 8 }}>Orders Completed (MTD)</div>
                <div style={{ fontWeight: 700, fontSize: '2rem', color: 'var(--color-primary)' }}>1</div>
              </div>
            </div>
            {/* Sales Trend and Sales by Salesperson */}
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              <div style={{ flex: 3.5, minWidth: 700, maxWidth: 900, background: '#f8fafc', borderRadius: '1rem', padding: '2.5rem', boxShadow: '0 1px 4px rgba(44,204,113,0.03)', marginBottom: '1rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '1.1rem', marginBottom: '1rem' }}>Sales Trend (Last 6 Months)</div>
                <div style={{ width: '100%', minWidth: 600, height: 340, background: '#e6f4ea', borderRadius: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
                  <Line
                    data={{
                      labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                      datasets: [
                        {
                          label: 'Sales',
                          data: [85000, 110000, 65000, 70000, 90000, 120000],
                          fill: true,
                          backgroundColor: 'rgba(44,204,113,0.15)',
                          borderColor: 'rgba(44,204,113,1)',
                          tension: 0.4,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                      },
                      scales: {
                        x: { grid: { display: false } },
                        y: { grid: { color: '#e6f4ea' }, beginAtZero: true },
                      },
                    }}
                    height={320}
                    width={800}
                  />
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 220, background: '#f8fafc', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 1px 4px rgba(44,204,113,0.03)', marginBottom: '1rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '1.1rem', marginBottom: '1rem' }}>Sales by Salesperson (MTD)</div>
                <div style={{ width: '100%', height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bar
                    data={{
                      labels: ['J. Doe', 'S. Smith', 'A. Lee'],
                      datasets: [
                        {
                          label: 'Sales',
                          data: [80000, 30000, 10000],
                          backgroundColor: [
                            'rgba(44,204,113,1)',
                            'rgba(90,210,177,1)',
                            'rgba(247,200,115,1)'
                          ],
                          borderRadius: 6,
                          barPercentage: 0.7,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { display: false },
                      },
                      indexAxis: 'y',
                      scales: {
                        x: { grid: { display: false }, beginAtZero: true },
                        y: { grid: { display: false } },
                      },
                    }}
                    height={120}
                  />
                </div>
              </div>
            </div>
            {/* Top 10 Open Orders by Value */}
            <div style={{ background: '#f8fafc', borderRadius: '1rem', boxShadow: '0 1px 4px rgba(44,204,113,0.03)', padding: '1.5rem', marginBottom: '1rem' }}>
              <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '1.1rem', marginBottom: '1.2rem' }}>Top 10 Open Orders by Value</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'transparent' }}>
                <thead>
                  <tr style={{ color: '#888', fontWeight: 600, fontSize: '1.05rem' }}>
                    <th style={{ padding: '0.8rem', textAlign: 'left' }}>Order ID</th>
                    <th style={{ padding: '0.8rem', textAlign: 'left' }}>Customer Name</th>
                    <th style={{ padding: '0.8rem', textAlign: 'left' }}>Order Date</th>
                    <th style={{ padding: '0.8rem', textAlign: 'left' }}>Salesperson</th>
                    <th style={{ padding: '0.8rem', textAlign: 'left' }}>Order Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: '#fff', borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.8rem', fontWeight: 600 }}>SO-10527</td>
                    <td style={{ padding: '0.8rem' }}>Apex Industries</td>
                    <td style={{ padding: '0.8rem' }}>2025-08-01</td>
                    <td style={{ padding: '0.8rem' }}>J. Doe</td>
                    <td style={{ padding: '0.8rem', fontWeight: 600 }}>$45,000.00</td>
                  </tr>
                  <tr style={{ background: '#fff', borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.8rem', fontWeight: 600 }}>SO-10525</td>
                    <td style={{ padding: '0.8rem' }}>Synergy Group</td>
                    <td style={{ padding: '0.8rem' }}>2025-08-05</td>
                    <td style={{ padding: '0.8rem' }}>S. Smith</td>
                    <td style={{ padding: '0.8rem', fontWeight: 600 }}>$18,950.75</td>
                  </tr>
                  <tr style={{ background: '#fff', borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.8rem', fontWeight: 600 }}>SO-10522</td>
                    <td style={{ padding: '0.8rem' }}>Innovate Inc.</td>
                    <td style={{ padding: '0.8rem' }}>2025-08-11</td>
                    <td style={{ padding: '0.8rem' }}>S. Smith</td>
                    <td style={{ padding: '0.8rem', fontWeight: 600 }}>$8,200.50</td>
                  </tr>
                  <tr style={{ background: '#fff', borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.8rem', fontWeight: 600 }}>SO-10524</td>
                    <td style={{ padding: '0.8rem' }}>New Ventures LLC</td>
                    <td style={{ padding: '0.8rem' }}>2025-08-09</td>
                    <td style={{ padding: '0.8rem' }}>A. Lee</td>
                    <td style={{ padding: '0.8rem', fontWeight: 600 }}>$5,600.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </>
);

export default ShopDashboard;
