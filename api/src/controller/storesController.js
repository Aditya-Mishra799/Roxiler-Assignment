import pool from "../config/db.js";

export const fetchStores = async (req, res) => {
  const {
    name = "",
    email = "",
    address = "",
    average_rating = null,
    page = 1,
    limit = 10,
    sortBy = [],
    owner_id,
  } = req.query;
  try {
    const filterClauses = [];
    const filterValues = [];
    let paramIndex = 1;
    if (name.trim()) {
      filterClauses.push(`name ILIKE $${paramIndex++}`);
      filterValues.push(`%${name.trim()}%`);
    }
    if (email.trim()) {
      filterClauses.push(`email ILIKE $${paramIndex++}`);
      filterValues.push(`%${email.trim()}%`);
    }
    if (address.trim()) {
      filterClauses.push(`address ILIKE $${paramIndex++}`);
      filterValues.push(`%${address.trim()}%`);
    }
    if (average_rating && average_rating <= 5 && average_rating >= 0) {
      filterClauses.push(`FLOOR(average_rating) = $${paramIndex++}`);
      filterValues.push(parseInt(average_rating));
    }
    if (owner_id) {
      filterClauses.push(`owner_id = $${paramIndex++}`);
      filterValues.push(parseInt(owner_id));
    }
    const whereClause = filterClauses.length
      ? `WHERE ${filterClauses.join(" AND ")}`
      : "";
    const allowedSortKeys = [
      "name",
      "email",
      "average_rating",
      "address",
      "created_at",
    ];
    const sortByArray = Array.isArray(sortBy) ? sortBy : [sortBy];
    const sortRules = sortByArray
      .map((rule) => {
        const [key, order = "ASC"] = rule.split(":");
        if (allowedSortKeys.includes(key)) {
          return `${key} ${order.toUpperCase() === "DESC" ? "DESC" : "ASC"}`;
        }
        return null;
      })
      .filter(Boolean)
      .join(", ");
    const orderByClause = sortRules
      ? `ORDER BY ${sortRules}`
      : "ORDER BY created_at";
    const offset = (parseInt(page) - 1) * limit;
    const countQuery = `
    SELECT COUNT(*) AS total
    FROM stores
    ${whereClause};
  `;
    const countResult = await pool.query(countQuery, filterValues);
    const total = parseInt(countResult.rows[0].total);

    filterValues.push(req.user.id, parseInt(limit), offset);
    const query = `
      SELECT stores.id, stores.name, stores.email,
      stores.average_rating, stores.address,
      stores.created_at, stores.owner_id, ratings.rating AS user_rating

      FROM stores LEFT JOIN ratings ON stores.id = ratings.store_id AND ratings.user_id =  $${paramIndex++}
      ${whereClause}
      ${orderByClause}
      LIMIT $${paramIndex++} OFFSET $${paramIndex++};
    `;
    const result = await pool.query(query, filterValues);

    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: result.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const upsertRating = async (req, res) => {
  let { store_id, rating } = req.body;
  rating = parseInt(rating);
  if (!rating || !(rating >= 1 && rating <= 5)) {
    return res.status(400).json({ message: "Rating must be between 1 to 5" });
  }
  const user_id = req.user.id;
  try {
    const oldRating = await pool.query(
      `SELECT * FROM ratings WHERE store_id = $1 AND user_id = $2;`,
      [store_id, user_id]
    );
    if (oldRating.rows[0]) {
      const updateRating = await pool.query(
        `UPDATE ratings SET rating = $1  WHERE store_id = $2 AND user_id = $3 RETURNING  id, rating, store_id;`,
        [rating, store_id, user_id]
      );
      return res.status(203).json({
        message: "Updated the rating successfully",
        data: updateRating.rows[0],
      });
    }
    const insertedRating = await pool.query(
      `INSERT INTO ratings (store_id, user_id, rating) VALUES ($1, $2, $3) RETURNING id;`,
      [store_id, user_id, rating]
    );
    return res.status(200).json({
      message: "Added the rating successfully",
      data: insertedRating.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const fetchStoreRatings = async (req, res) => {
  const owner_id = req.user.id;
  let { page = 1, limit = 10 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);
  try {
    const store = await pool.query(
      `SELECT id, average_rating FROM stores WHERE owner_id = $1;`,
      [owner_id]
    );
    if (!store.rows[0]) {
      return res.status(404).json({ message: "No registered store found !!!" });
    }
    const store_id = store.rows[0].id;
    const offset = (page - 1) * limit;
    const ratings = await pool.query(
      `SELECT u.name, u.email, r.rating, r.created_at
    FROM ratings r JOIN users u ON r.user_id =  u.id 
    WHERE r.store_id = $1
    ORDER BY r.created_at DESC
    LIMIT $2 OFFSET $3;
    `,
      [store_id, limit, offset]
    );
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM ratings WHERE store_id = $1;`,
      [store_id]
    );
    const total = parseInt(countResult.rows[0].count);
    res.json({
      total,
      page,
      limit,
      data: {
        ratings: ratings.rows,
        average_rating: store.rows[0]?.average_rating,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
