-- Add Rating column to product_details_view using average from reviews table
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
  CONCAT(u.FirstName, ' ', u.LastName) AS `User`,
  (
    SELECT AVG(r.Rating)
    FROM reviews r
    WHERE r.ProductID = p.ProductID
  ) AS Rating
FROM products p
LEFT JOIN shops s ON p.ShopID = s.ShopID
LEFT JOIN users u ON s.UserID = u.UserID;
