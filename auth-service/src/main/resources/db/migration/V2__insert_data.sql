INSERT INTO users (name, email, password, role, age, address, created_at)
VALUES
    ('Admin', 'admin@gmail.com', '$2a$10$tqRD5ZOONUi2H0CO.6vBJOf.jvEVbWIUAidGDz1zYOMdh7w6WNGmq', 'ADMIN', 25, '123 Hanoi Street', NOW());