import React from "react";
import { useParams } from "react-router-dom";

const ShopDashboard = () => {
  // Get ShopID from route params
  const { shopId } = useParams();

  return (
    <div style={{padding: '2rem'}}>
      <h1>Shop Dashboard</h1>
      <p>ShopID: {shopId}</p>
      {/* Add more dashboard content here */}
    </div>
  );
};

export default ShopDashboard;
