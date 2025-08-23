import pool from "../config/db.js";
import { createUser } from "../utlis/createUser.js";
import { escapeRegex } from "../utlis/escapeRegex.js";
import { storeSchema } from "../validation_schema/storeValidationSchema.js";

export const createStore = async (req, res) => {
  let { store, owner } = req.body;
  const storeResult = storeSchema.safeParse(store);
  owner = { ...owner, role: "owner" };
  if (!storeResult.success) {
    return res.status(400).json({
      message: "Invalid Data",
      details: storeResult.error.errors.map((error) => error.message),
    });
  }
  try {
    const checkStore = await pool.query(
      `SELECT id from stores where email = $1;`,
      [store.email]
    );
    if (checkStore.rows[0]) {
      return res
        .status(409)
        .json({ message: "A store is already registered with this email." });
    }
    const { created, ...rest } = await createUser(owner);
    if (!created) {
      return res.status(400).json(rest);
    }
    const ownerId = rest.data.id;
    // Insert the store with the linked owner_id
    await pool.query(
      `INSERT INTO stores (name, email, address, owner_id) VALUES ($1,$2,$3,$4)`,
      [store.name, store.email, store.address, ownerId]
    );

    res.json({ message: "Store and owner created successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const createNewUser = async (req, res) => {
  const user = req.body;
  try {
    const { created, ...rest } = await createUser(user);
    if (!created) {
      return res.status(400).json(rest);
    }
    res.json({ message: "User created successfully", user: rest.data });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const fetchUsers = async (req, res) => {
  const {
    name = "",
    email = "",
    address = "",
    role = "",
    page = 1,
    limit = 10,
    sortBy,
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
    if (role.trim()) {
      filterClauses.push(`role = $${paramIndex++}`);
      filterValues.push(role.trim());
    }
    const whereClause = filterClauses.length
      ? `WHERE ${filterClauses.join(" AND ")}`
      : "";
    const allowedSortKeys = ["name", "email", "role", "address", "created_at"];
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
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM users ${whereClause};`,
      filterValues
    );
    const total = parseInt(countResult.rows[0].count);
    filterValues.push(parseInt(limit), offset);
    const query = `
    SELECT name, email, role, address, created_at
    FROM users
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

export const getDashboardMetrics = async (req, res) => {
  try {
    const users = await pool.query("SELECT COUNT(*) FROM users;");
    const stores = await pool.query("SELECT COUNT(*) FROM stores;");
    const ratings = await pool.query("SELECT COUNT(*) FROM ratings;");
    return res.json({
      totalUsers: parseInt(users.rows[0].count),
      totalStores: parseInt(stores.rows[0].count),
      totalRatings: parseInt(ratings.rows[0].count),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
