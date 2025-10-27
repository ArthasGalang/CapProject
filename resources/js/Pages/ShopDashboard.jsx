
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
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import ShopSidebar from "@/Components/ShopSidebar";

import React, { useState, useEffect } from "react";

const getDefaultWeek = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sun) - 6 (Sat)
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    start: monday.toISOString().slice(0, 10),
    end: sunday.toISOString().slice(0, 10),
  };
};

const ShopDashboard = (props) => {
  // Get shopId from props, route, or hardcode for now (e.g. 20000001)
  const shopId = props.shopId || (window.shopId ? window.shopId : 20000001);
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Fetch dashboard data
    fetch('/api/shop_dashboard_view')
      .then(res => res.json())
      .then(data => {
        setDashboardData(data);
        setLoading(false);
        console.log('shop_dashboard_view:', data);
      })
      .catch(err => {
        setLoading(false);
        console.error('Error fetching shop_dashboard_view:', err);
      });
  }, []);

  // Fetch top products for the shop
  const [topProducts, setTopProducts] = useState([]);
  useEffect(() => {
    fetch(`/api/top_products_by_shop?shop_id=${shopId}`)
      .then(res => res.json())
      .then(data => {
        setTopProducts(Array.isArray(data) ? data.slice(0, 5) : []);
      })
      .catch(() => setTopProducts([]));
  }, [shopId]);
  const defaultWeek = getDefaultWeek();
  const [dateRange, setDateRange] = useState({ start: defaultWeek.start, end: defaultWeek.end });

  // Generate labels and dummy data for the selected range
  const getDateLabels = (start, end) => {
    const labels = [];
    let d = new Date(start);
    const endDate = new Date(end);
    while (d <= endDate) {
      labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      d.setDate(d.getDate() + 1);
    }
    return labels;
  };
  const labels = getDateLabels(dateRange.start, dateRange.end);
  // Sales data for the chart (sum of TotalAmount per day)
  const salesByDate = {};
  dashboardData.filter(row => row.ShopID == shopId).forEach(row => {
    if (!salesByDate[row.OrderDate]) salesByDate[row.OrderDate] = 0;
    salesByDate[row.OrderDate] += parseFloat(row.TotalAmount);
  });
  const salesData = labels.map(label => {
    // Convert label back to yyyy-mm-dd for matching
    const dateObj = new Date(dateRange.start);
    const [month, day] = label.split(' ');
    dateObj.setMonth(['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(month));
    dateObj.setDate(parseInt(day));
    const key = dateObj.toISOString().slice(0,10);
    return salesByDate[key] || 0;
  });

  // Dashboard cards
  const shopRows = dashboardData.filter(row => row.ShopID == shopId);
  // Sort shopRows by OrderDate descending for recent orders
  const recentOrders = [...shopRows].sort((a, b) => new Date(b.OrderDate) - new Date(a.OrderDate));
  // Filter to unique orders by OrderID
  const uniqueRecentOrders = [];
  const seenOrderIds = new Set();
  for (const row of recentOrders) {
    if (!seenOrderIds.has(row.OrderID)) {
      uniqueRecentOrders.push(row);
      seenOrderIds.add(row.OrderID);
    }
  }
  const pendingOrders = shopRows.filter(row => row.OrderStatus === 'Preparing' || row.OrderStatus === 'To Pay').length;
  const completedOrders = shopRows.filter(row => row.OrderStatus === 'Completed').length;
  const totalSales = shopRows.filter(row => row.OrderStatus === 'Completed').reduce((sum, row) => sum + parseFloat(row.TotalAmount), 0);
  // Low stock products: Stock <= 5 OR Stock <= SoldAmount * 0.1
  const lowStockProducts = Array.from(
    new Map(
      shopRows
        .filter(row => row.Stock <= 5 || row.Stock <= row.SoldAmount * 0.1)
        .map(row => [row.ProductID, row])
    ).values()
  );

  return (
    <>
      <Header />
      <main style={{ background: '#f7f8fb', minHeight: '70vh', padding: '2rem 0' }}>
        <div style={{ maxWidth: 1500, margin: '0 auto', display: 'flex', gap: '2.5rem' }}>
          {/* Sidebar */}
          <ShopSidebar active="dashboard" />
          {/* Main Content */}
          <div style={{ flex: 1 }}>
            <div style={{ background: '#fff', borderRadius: '1.2rem', boxShadow: '0 2px 16px rgba(44,204,113,0.07)', padding: '2.5rem 2rem', marginBottom: '2rem' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1.6rem', color: 'var(--color-primary)', marginBottom: '2rem', letterSpacing: 0.5 }}>Shop Dashboard</h2>
            {/* Enhanced Dashboard Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
              <div style={{ background: '#f8fafc', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 1px 4px rgba(44,204,113,0.03)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ color: '#888', fontWeight: 500, fontSize: '1.05rem', marginBottom: 8 }}>Pending Orders</div>
                <div style={{ fontWeight: 700, fontSize: '2rem', color: 'var(--color-primary)' }}>{loading ? '...' : pendingOrders}</div>
              </div>
              <div style={{ background: '#f8fafc', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 1px 4px rgba(44,204,113,0.03)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ color: '#888', fontWeight: 500, fontSize: '1.05rem', marginBottom: 8 }}>Completed Orders (MTD)</div>
                <div style={{ fontWeight: 700, fontSize: '2rem', color: 'var(--color-primary)' }}>{loading ? '...' : completedOrders}</div>
              </div>
              <div style={{ background: '#f8fafc', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 1px 4px rgba(44,204,113,0.03)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ color: '#888', fontWeight: 500, fontSize: '1.05rem', marginBottom: 8 }}>Total Sales (MTD)</div>
                <div style={{ fontWeight: 700, fontSize: '2rem', color: 'var(--color-primary)' }}>{loading ? '...' : `₱${totalSales.toLocaleString(undefined, {minimumFractionDigits:2})}`}</div>
              </div>
              <div style={{ background: '#f8fafc', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 1px 4px rgba(44,204,113,0.03)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ color: '#888', fontWeight: 500, fontSize: '1.05rem', marginBottom: 8 }}>Low Stock Products</div>
                <div style={{ fontWeight: 700, fontSize: '2rem', color: 'var(--color-primary)' }}>{loading ? '...' : lowStockProducts.length}</div>
              </div>
            </div>

            {/* Sales Trend Line Chart (User Date Range) */}
            <div style={{ background: '#fff', borderRadius: '1.2rem', boxShadow: '0 2px 16px rgba(44,204,113,0.07)', padding: '2rem', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '1.1rem' }}>Sales Trend</div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <label style={{ fontWeight: 500, color: '#888', fontSize: '0.98rem' }}>From:</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    max={dateRange.end}
                    onChange={e => setDateRange(r => ({ ...r, start: e.target.value }))}
                    style={{ border: '1px solid #eee', borderRadius: 6, padding: '0.2rem 0.5rem' }}
                  />
                  <label style={{ fontWeight: 500, color: '#888', fontSize: '0.98rem' }}>To:</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    min={dateRange.start}
                    onChange={e => setDateRange(r => ({ ...r, end: e.target.value }))}
                    style={{ border: '1px solid #eee', borderRadius: 6, padding: '0.2rem 0.5rem' }}
                  />
                </div>
              </div>
                  <Line
                    data={{
                      labels,
                      datasets: [
                        {
                          label: 'Sales',
                          data: salesData,
                          borderColor: 'rgba(44,204,113,1)',
                          backgroundColor: (context) => {
                            const ctx = context.chart.ctx;
                            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                            gradient.addColorStop(0, 'rgba(44,204,113,0.25)');
                            gradient.addColorStop(1, 'rgba(44,204,113,0)');
                            return gradient;
                          },
                          tension: 0.4,
                          fill: true,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { display: false },
                      },
                      scales: {
                        y: { beginAtZero: true, ticks: { callback: value => `₱${value.toLocaleString()}` } },
                      },
                    }}
                    height={80}
                  />
            </div>

            {/* 2-column section: Order Status Pie & Top Products Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
              {/* Order Status Pie Chart */}
              <div style={{ background: '#fff', borderRadius: '1.2rem', boxShadow: '0 2px 16px rgba(44,204,113,0.07)', padding: '2rem', minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '1.1rem', marginBottom: '1.2rem' }}>Order Status Distribution</div>
                <Bar
                  data={{
                    labels: ['Completed', 'Preparing', 'To Pay', 'Cancelled'],
                    datasets: [
                      {
                        label: 'Orders',
                        data: [
                          shopRows.filter(row => row.OrderStatus === 'Completed').length,
                          shopRows.filter(row => row.OrderStatus === 'Preparing').length,
                          shopRows.filter(row => row.OrderStatus === 'To Pay').length,
                          shopRows.filter(row => row.OrderStatus === 'Cancelled').length
                        ],
                        backgroundColor: [
                          'rgba(44,204,113,0.8)',
                          'rgba(52,152,219,0.8)',
                          'rgba(241,196,15,0.8)',
                          'rgba(231,76,60,0.8)'
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    indexAxis: 'y',
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      x: { beginAtZero: true },
                    },
                  }}
                  height={120}
                />
              </div>
              {/* Top Products Bar Chart */}
              <div style={{ background: '#fff', borderRadius: '1.2rem', boxShadow: '0 2px 16px rgba(44,204,113,0.07)', padding: '2rem', minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '1.1rem', marginBottom: '1.2rem' }}>Top Products (Completed Orders)</div>
                <Bar
                  data={{
                    labels: topProducts.map(p => p.ProductName),
                    datasets: [
                      {
                        label: 'Units Sold',
                        data: topProducts.map(p => p.UnitsSold),
                        backgroundColor: 'rgba(44,204,113,0.8)',
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      y: { beginAtZero: true },
                    },
                  }}
                  height={120}
                />
              </div>
            </div>
            {/* Tables Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {/* Recent Orders Table */}
              <div style={{ background: '#f8fafc', borderRadius: '1rem', boxShadow: '0 1px 4px rgba(44,204,113,0.03)', padding: '1.5rem', minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '1.1rem', marginBottom: '1.2rem' }}>Recent Orders</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'transparent' }}>
                  <thead>
                    <tr style={{ color: '#888', fontWeight: 600, fontSize: '1.05rem' }}>
                      <th style={{ padding: '0.8rem', textAlign: 'left' }}>Order ID</th>
                      <th style={{ padding: '0.8rem', textAlign: 'left' }}>Customer</th>
                      <th style={{ padding: '0.8rem', textAlign: 'left' }}>Order Date</th>
                      <th style={{ padding: '0.8rem', textAlign: 'left' }}>Status</th>
                      <th style={{ padding: '0.8rem', textAlign: 'left' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={5}>Loading...</td></tr>
                    ) : (
                      uniqueRecentOrders.slice(0, 3).map((row, idx) => (
                        <tr key={row.OrderID + '-' + row.ProductID + '-' + idx} style={{ background: '#fff', borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '0.8rem', fontWeight: 600 }}>#{row.OrderID}</td>
                          <td style={{ padding: '0.8rem' }}>{row.CustomerName}</td>
                          <td style={{ padding: '0.8rem' }}>{row.OrderDate}</td>
                          <td style={{ padding: '0.8rem' }}>{row.OrderStatus}</td>
                          <td style={{ padding: '0.8rem', fontWeight: 600 }}>₱{parseFloat(row.TotalAmount).toLocaleString(undefined, {minimumFractionDigits:2})}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {/* Low Stock Products Table */}
              <div style={{ background: '#f8fafc', borderRadius: '1rem', boxShadow: '0 1px 4px rgba(44,204,113,0.03)', padding: '1.5rem', minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '1.1rem', marginBottom: '1.2rem' }}>Low Stock Products</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'transparent' }}>
                  <thead>
                    <tr style={{ color: '#888', fontWeight: 600, fontSize: '1.05rem' }}>
                      <th style={{ padding: '0.8rem', textAlign: 'left' }}>Product</th>
                      <th style={{ padding: '0.8rem', textAlign: 'left' }}>SKU</th>
                      <th style={{ padding: '0.8rem', textAlign: 'left' }}>Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={3}>Loading...</td></tr>
                    ) : (
                      lowStockProducts.slice(0, 3).map((p, idx) => (
                        <tr key={p.ProductID + '-' + idx} style={{ background: '#fff', borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '0.8rem' }}>{p.ProductName}</td>
                          <td style={{ padding: '0.8rem' }}>{p.SKU}</td>
                          <td style={{ padding: '0.8rem', fontWeight: 600 }}>{p.Stock}</td>
                        </tr>
                      ))
                    )}
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
};

export default ShopDashboard;
