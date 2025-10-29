import React from 'react';
import AdminLayout from '../../Components/Admin/AdminLayout';

const ShopManagement = () => {
  const [shops, setShops] = React.useState([]);
  const [owners, setOwners] = React.useState({});
  React.useEffect(() => {
    fetch('/api/shops')
      .then(res => res.json())
      .then(async shopsData => {
        setShops(Array.isArray(shopsData) ? shopsData : []);
        // Fetch owner data for each shop
        const ownerMap = {};
        for (const shop of shopsData) {
          if (shop.UserID) {
            try {
              const res = await fetch(`/api/user/${shop.UserID}`);
              const user = await res.json();
              ownerMap[shop.ShopID] = user;
            } catch (err) {
              ownerMap[shop.ShopID] = null;
            }
          }
        }
        setOwners(ownerMap);
      })
      .catch(err => {
        console.error('Error fetching shops:', err);
      });
  }, []);
  return (
    <AdminLayout>
      <div className="admin-reports-container">
        <h1 className="admin-reports-title">Shop Management</h1>
        <div className="admin-reports-subtitle">View and manage all shops</div>
        <div className="admin-reports-table-wrapper">
          <table className="admin-reports-table">
            <thead className="admin-reports-thead">
              <tr>
                <th className="admin-reports-th">Shop Name</th>
                <th className="admin-reports-th">Owner</th>
                <th className="admin-reports-th">Category</th>
                <th className="admin-reports-th">Created</th>
                <th className="admin-reports-th">Verification</th>
                <th className="admin-reports-th">Action</th>
              </tr>
            </thead>
            <tbody className="admin-reports-tbody">
              {shops.map((shop) => (
                <tr key={shop.ShopID} className="admin-reports-tr" onMouseOver={e => e.currentTarget.style.background = '#f3f4f6'} onMouseOut={e => e.currentTarget.style.background = ''}>
                  <td className="admin-reports-td">{shop.ShopName || 'N/A'}</td>
                  <td className="admin-reports-td">{
                    owners[shop.ShopID]
                      ? (owners[shop.ShopID].FirstName + ' ' + owners[shop.ShopID].LastName)
                      : 'N/A'
                  }</td>
                  <td className="admin-reports-td">{shop.Category || shop.ShopCategory || 'N/A'}</td>
                  <td className="admin-reports-td">{shop.created_at ? new Date(shop.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</td>
                  <td className="admin-reports-td">{
                    shop.Verification === 'Verified' ? 'Verified'
                    : shop.Verification === 'Pending' ? 'Pending'
                    : shop.Verification === 'Rejected' ? 'Rejected'
                    : 'N/A'
                  }</td>
                  <td className="admin-reports-td">
                    <button className="admin-reports-view-btn">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ShopManagement;
