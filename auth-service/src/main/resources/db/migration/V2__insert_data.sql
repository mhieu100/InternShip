-- Active: 1754012529564@@127.0.0.1@5432@demo
INSERT INTO
    users (
        name,
        email,
        password,
        role,
        age,
        address,
        created_at
    )
VALUES (
        'Admin',
        'admin@gmail.com',
        '$2a$10$tqRD5ZOONUi2H0CO.6vBJOf.jvEVbWIUAidGDz1zYOMdh7w6WNGmq',
        'ADMIN',
        25,
        '123 Hanoi Street',
        NOW()
    );

INSERT INTO
    cameras (
        name,
        location,
        status,
        stream_url,
        is_live,
        type,
        is_public
    )
VALUES (
        'Main Entrance Camera',
        'Building A Entrance',
        'ONLINE',
        'rtsp://192.168.1.10:554/stream1',
        false,
        'SECURITY',
        true
    ),
    (
        'Parking Lot Camera',
        'North Parking Lot',
        'ONLINE',
        'rtsp://192.168.1.11:554/stream2',
        false,
        'SECURITY',
        true
    ),
    (
        'Lobby Camera',
        'Main Lobby',
        'ONLINE',
        'rtsp://192.168.1.12:554/stream3',
        false,
        'INDOOR',
        false
    ),
    (
        'Backyard Camera',
        'Building B Backyard',
        'ONLINE',
        'rtsp://192.168.1.13:554/stream4',
        false,
        'OUTDOOR',
        true
    ),
    (
        'Server Room Camera',
        'Data Center',
        'ONLINE',
        'rtsp://192.168.1.14:554/stream5',
        false,
        'MONITORING',
        false
    ),
    (
        'Highway Camera',
        'Highway Exit 42',
        'ONLINE',
        'rtsp://192.168.1.15:554/stream6',
        false,
        'TRAFFIC',
        true
    ),
    (
        'Reception Camera',
        'Front Desk',
        'ONLINE',
        'rtsp://192.168.1.16:554/stream7',
        false,
        'INDOOR',
        true
    ),
    (
        'Warehouse Camera',
        'Storage Area',
        'ONLINE',
        'rtsp://192.168.1.17:554/stream8',
        false,
        'MONITORING',
        false
    );