import pkg from 'pg';
import dotenv from 'dotenv'
dotenv.config()

const {Pool} = pkg;
const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    password: process.env.PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DATABASE,
})
export default pool;
