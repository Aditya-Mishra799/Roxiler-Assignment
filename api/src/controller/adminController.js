import pool from "../config/db.js";
import { createUser } from "../utlis/createUser.js";
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
    const {created, ...rest} = await createUser(owner)
    if(!created){
      return res.status(400).json(rest)
    }
    const ownerId = rest.id;
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
