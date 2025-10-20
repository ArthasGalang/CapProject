CREATE OR REPLACE VIEW product_details_view AS
SELECT
  p.ProductID,
  p.ProductName,
  p.Price,
  p.SoldAmount AS Sold,
  p.Image,
  p.AdditionalImages,
  p.Stock,
  p.Description,
  s.ShopName AS Shop,
  s.LogoImage,
  CONCAT(u.FirstName, ' ', u.LastName) AS `User`
FROM products p
LEFT JOIN shops s ON p.ShopID = s.ShopID
LEFT JOIN users u ON s.UserID = u.UserID;
