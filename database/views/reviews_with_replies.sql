CREATE OR REPLACE VIEW reviews_with_replies AS
SELECT
  r.ProductID,
  r.ReviewID,
  r.UserID AS ReviewerID,
  CONCAT(reviewer.FirstName, ' ', reviewer.LastName) AS ReviewerName,
  r.Rating,
  r.Comment AS ReviewContent,
  (
    SELECT GROUP_CONCAT(rp.ReplyID ORDER BY rp.ReplyID)
    FROM replies rp
    WHERE rp.ReviewID = r.ReviewID
  ) AS Replies,
  (
    SELECT GROUP_CONCAT(rp.Comment ORDER BY rp.ReplyID SEPARATOR '|||')
    FROM replies rp
    WHERE rp.ReviewID = r.ReviewID
  ) AS RepliesContent,
  (
    SELECT GROUP_CONCAT(CONCAT(u2.FirstName, ' ', u2.LastName) ORDER BY rp.ReplyID SEPARATOR '|||')
    FROM replies rp
    LEFT JOIN users u2 ON rp.UserID = u2.UserID
    WHERE rp.ReviewID = r.ReviewID
  ) AS RepliesNames,
  r.created_at AS ReviewDate
FROM reviews r
LEFT JOIN users reviewer ON r.UserID = reviewer.UserID;
