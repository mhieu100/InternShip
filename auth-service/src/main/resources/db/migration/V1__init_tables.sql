DROP TABLE IF EXISTS flyway_schema_history;

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

CREATE TABLE cameras (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL,
    stream_url VARCHAR(255),
    is_live BOOLEAN NOT NULL,
    type VARCHAR(20) NOT NULL,
    resolution VARCHAR(20),
    fps VARCHAR(10),
    is_public BOOLEAN NOT NULL
);

CREATE INDEX idx_cameras_status ON cameras(status);

CREATE INDEX idx_cameras_type ON cameras(type);