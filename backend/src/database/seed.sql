-- =========================================================
-- WI-FI NETWORK MONITORING SYSTEM
-- INITIAL SEED DATA
-- =========================================================

-- =========================================================
-- 1. ADMINISTRATOR
-- =========================================================

INSERT INTO users (
    username,
    email,
    password,
    full_name,
    role
)
VALUES (
    'admin',
    'admin@wifimonitor.local',
    'Admin@123',
    'System Administrator',
    'ADMIN'
);


-- =========================================================
-- 2. CAMPUS
-- =========================================================

INSERT INTO campuses (
    name,
    location,
    description
)
VALUES (
    'Main University Campus',
    'University Campus',
    'Main campus for Wi-Fi network monitoring and management.'
);


-- =========================================================
-- 3. BUILDINGS
-- =========================================================

INSERT INTO buildings (
    campus_id,
    name,
    location,
    description
)
SELECT
    id,
    'ICT Building',
    'Main Campus',
    'Information and Communication Technology building.'
FROM campuses
WHERE name = 'Main University Campus';


INSERT INTO buildings (
    campus_id,
    name,
    location,
    description
)
SELECT
    id,
    'University Library',
    'Main Campus',
    'University library and digital learning facility.'
FROM campuses
WHERE name = 'Main University Campus';


INSERT INTO buildings (
    campus_id,
    name,
    location,
    description
)
SELECT
    id,
    'Faculty of Science',
    'Main Campus',
    'Faculty building supporting teaching and research activities.'
FROM campuses
WHERE name = 'Main University Campus';


-- =========================================================
-- 4. ACCESS POINTS
-- =========================================================

INSERT INTO access_points (
    building_id,
    name,
    mac_address,
    ip_address,
    ssid,
    channel,
    frequency,
    status
)
SELECT
    id,
    'AP-ICT-01',
    '00:11:22:33:44:01',
    '192.168.1.101',
    'University-WiFi',
    6,
    '2.4GHz',
    'ONLINE'
FROM buildings
WHERE name = 'ICT Building';


INSERT INTO access_points (
    building_id,
    name,
    mac_address,
    ip_address,
    ssid,
    channel,
    frequency,
    status
)
SELECT
    id,
    'AP-LIB-01',
    '00:11:22:33:44:02',
    '192.168.1.102',
    'University-WiFi',
    11,
    '2.4GHz',
    'ONLINE'
FROM buildings
WHERE name = 'University Library';


INSERT INTO access_points (
    building_id,
    name,
    mac_address,
    ip_address,
    ssid,
    channel,
    frequency,
    status
)
SELECT
    id,
    'AP-SCI-01',
    '00:11:22:33:44:03',
    '192.168.1.103',
    'University-WiFi',
    1,
    '2.4GHz',
    'ONLINE'
FROM buildings
WHERE name = 'Faculty of Science';


-- =========================================================
-- 5. MONITORING SETTINGS
-- =========================================================

INSERT INTO system_settings (
    setting_key,
    setting_value,
    description
)
VALUES
(
    'signal_strength_threshold',
    '-70',
    'Minimum acceptable Wi-Fi signal strength in dBm.'
),
(
    'latency_threshold',
    '50',
    'Maximum acceptable network latency in milliseconds.'
),
(
    'packet_loss_threshold',
    '2',
    'Maximum acceptable packet loss percentage.'
),
(
    'bandwidth_utilization_threshold',
    '80',
    'Maximum recommended bandwidth utilization percentage.'
),
(
    'availability_threshold',
    '99',
    'Minimum acceptable network availability percentage.'
),
(
    'access_point_utilization_threshold',
    '80',
    'Maximum recommended access point utilization percentage.'
);