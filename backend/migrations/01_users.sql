CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    role_id BIGINT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
