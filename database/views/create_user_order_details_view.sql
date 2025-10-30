  -- database/views/create_user_order_details_view.sql
  -- This SQL creates a view for AccountOrders.jsx to fetch all order details for a user

  CREATE OR REPLACE VIEW user_order_details AS
  SELECT
    oi.OrderItemID,
    o.OrderID,
    o.UserID,
    o.ShopID,
    s.ShopName,
    o.OrderDate,
    o.Status,
    o.BuyerNote,
    oi.ProductID,
    p.ProductName,
    p.Image,
    oi.Quantity,
    oi.Subtotal,
    o.PaymentMethod
  FROM order_items oi
  JOIN orders o ON oi.OrderID = o.OrderID
  JOIN products p ON oi.ProductID = p.ProductID
  JOIN shops s ON o.ShopID = s.ShopID;

  -- To apply: Run this SQL in your MySQL database.
  -- This view will allow AccountOrders.jsx to fetch all necessary order details for a user.
  -- You can filter by UserID and Status in your API query, e.g.:
  -- SELECT * FROM user_order_details WHERE UserID = ? AND Status = ?;
