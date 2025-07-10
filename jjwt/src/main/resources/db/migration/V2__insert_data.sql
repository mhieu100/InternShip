INSERT INTO users (username, email, password) VALUES
('admin', 'admin@example.com', '$2a$10$8GnjnhRybcNwZpylRi0T6eEC1YsWY0ZKbIB2l6W/6s0aisMSWXK5u'),
('jane_smith', 'jane@example.com', '$2a$10$8GnjnhRybcNwZpylRi0T6eEC1YsWY0ZKbIB2l6W/6s0aisMSWXK5u'),
('alice_walker', 'alice@example.com', '$2a$10$8GnjnhRybcNwZpylRi0T6eEC1YsWY0ZKbIB2l6W/6s0aisMSWXK5u');


INSERT INTO orders (username, product_name, price, quantity) VALUES
('admin', 'Wireless Mouse', 25.99, 2),
('admin', 'Mechanical Keyboard', 79.50, 1),
('admin', 'USB-C Hub', 45.00, 3);
