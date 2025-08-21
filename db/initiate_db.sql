CREATE TYPE user_role AS ENUM('admin', 'user', 'owner');
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(400) NOT NULL,
    role user_role NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    CHECK(LENGTH(name) BETWEEN 20 AND 60),
    CHECK(LENGTH(address) <= 400)
);

CREATE TABLE stores(
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    address VARCHAR(400) NOT NULL,
    owner_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    CHECK(LENGTH(name) BETWEEN 20 AND 60),
    CHECK(LENGTH(address) <= 400)
);

CREATE TABLE ratings(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, store_id),
    CHECK(rating BETWEEN 1 AND 5)
);

CREATE INDEX idx_stores_name ON stores(name);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_ratings_store_id ON ratings(store_id);

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$ 
BEGIN 
    NEW.updated_at  = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_time
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_stores_time
BEFORE UPDATE ON stores
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_ratings_time
BEFORE UPDATE ON ratings
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();