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
    CHECK(LENGTH(name) BETWEEN 5 AND 60),
    CHECK(LENGTH(address) BETWEEN 10 AND 400)
);

CREATE TABLE stores(
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    address VARCHAR(400) NOT NULL,
    owner_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    average_rating DECIMAL(3,2) DEFAULT 0,
    rating_count INT DEFAULT 0,
    total_rating INT DEFAULT 0,      
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    CHECK(LENGTH(name) BETWEEN 5 AND 60),
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

-- trigger to update ratings
CREATE OR REPLACE FUNCTION insert_store_ratings()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE stores
    SET rating_count = rating_count + 1,
        total_rating = total_rating + NEW.rating,
        average_rating = ROUND( (total_rating + NEW.rating)::numeric / (rating_count + 1), 2)
    WHERE id = NEW.store_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_store_ratings()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE stores
    SET total_rating = total_rating + NEW.rating - OLD.rating,
        average_rating = ROUND( (total_rating + NEW.rating - OLD.rating)::numeric / rating_count, 2)
    WHERE id = NEW.store_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION delete_store_ratings()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE stores
    SET rating_count = rating_count - 1,
        total_rating = total_rating - OLD.rating,
        average_rating = CASE 
            WHEN rating_count > 1 
            THEN ROUND( (total_rating - OLD.rating)::numeric / (rating_count - 1), 2)
            ELSE 0
            END
    WHERE id = OLD.store_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER insert_ratings
AFTER INSERT ON ratings
FOR EACH ROW
EXECUTE FUNCTION insert_store_ratings();

CREATE TRIGGER update_ratings
AFTER UPDATE ON ratings
FOR EACH ROW
EXECUTE FUNCTION update_store_ratings();

CREATE TRIGGER delete_ratings
AFTER DELETE ON ratings
FOR EACH ROW
EXECUTE FUNCTION delete_store_ratings();

-- trigger for time stamp update
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

-- adding a default admin user, PASSWORD = Roxiler@123
INSERT INTO users (name, email, address, password, role) 
VALUES (
  'Roxiler', 
  'roxiler@roxiler.com', 
  'Room 1234, Plot 567, Maharashtra', 
  '$2b$10$hgF.E5GMZLc6hwq6Z46hb.4758PejWbSCH6mDoVytzbo3pNUzoN02', 
  'admin'
);
