-- database/views/create_shop_orders_view.sql
-- This SQL creates a view for ShopOrders.jsx to fetch all shop orders

CREATE OR REPLACE VIEW shop_orders AS
SELECT
  o.OrderID,
  o.ShopID,
  s.ShopName,
  o.UserID,
  CONCAT(u.FirstName, ' ', u.LastName) AS BuyerName,
  o.OrderDate,
  o.Status,
  o.TotalAmount AS TotalPrice,
  o.BuyerNote
FROM orders o
JOIN shops s ON o.ShopID = s.ShopID
JOIN users u ON o.UserID = u.UserID;

-- To apply: Run this SQL in your MySQL database.
-- This view will allow ShopOrders.jsx to fetch all orders for a shop, including shop name, buyer name, order date, status, total price, and buyer note.
-- You can filter by ShopID and Status in your API query, e.g.:
-- SELECT * FROM shop_orders WHERE ShopID = ? AND Status = ?;
