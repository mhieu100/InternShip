-- Creating table for User entity
CREATE TABLE users (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50),
    age INTEGER,
    address VARCHAR(255),
    refresh_token TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Creating table for Order entity
CREATE TABLE orders (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id BIGINT NOT NULL,
    product_name VARCHAR(255),
    price DOUBLE PRECISION,
    quantity INTEGER,
    total_price DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) CHECK (status IN ('PENDING', 'COMPLETED', 'CANCELLED'))
);