-- =========================================================
-- WI-FI NETWORK PERFORMANCE MONITORING SYSTEM
-- PostgreSQL Database Schema
-- =========================================================

-- =========================================================
-- Run This SQL Script First
-- =========================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================================================
-- 1. USERS
-- =========================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'ADMIN',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT users_role_check
        CHECK (role IN ('ADMIN'))
);


-- =========================================================
-- 2. CAMPUSES
-- =========================================================

CREATE TABLE campuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL UNIQUE,
    location VARCHAR(255),
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 3. BUILDINGS
-- =========================================================

CREATE TABLE buildings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campus_id UUID NOT NULL,
    name VARCHAR(150) NOT NULL,
    location VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_building_campus
        FOREIGN KEY (campus_id)
        REFERENCES campuses(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_building_per_campus
        UNIQUE (campus_id, name)
);


-- =========================================================
-- 4. ACCESS POINTS
-- =========================================================

CREATE TABLE access_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    building_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    mac_address VARCHAR(50) NOT NULL UNIQUE,
    ip_address VARCHAR(45),
    ssid VARCHAR(100) NOT NULL,
    channel INTEGER,
    frequency VARCHAR(30),
    status VARCHAR(30) NOT NULL DEFAULT 'OFFLINE',
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    installed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_access_point_building
        FOREIGN KEY (building_id)
        REFERENCES buildings(id)
        ON DELETE CASCADE,

    CONSTRAINT access_point_status_check
        CHECK (status IN ('ONLINE', 'OFFLINE', 'WARNING'))
);


-- =========================================================
-- 5. NETWORK METRICS
-- =========================================================

CREATE TABLE network_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    access_point_id UUID NOT NULL,

    signal_strength DECIMAL(8,2),
    throughput DECIMAL(12,2),
    latency DECIMAL(8,2),
    packet_loss DECIMAL(8,2),
    bandwidth_utilization DECIMAL(8,2),
    connected_users INTEGER,
    access_point_utilization DECIMAL(8,2),
    network_availability DECIMAL(8,2),
    channel_utilization DECIMAL(8,2),

    recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_metric_access_point
        FOREIGN KEY (access_point_id)
        REFERENCES access_points(id)
        ON DELETE CASCADE,

    CONSTRAINT connected_users_check
        CHECK (connected_users IS NULL OR connected_users >= 0)
);


-- =========================================================
-- 6. NETWORK ALERTS
-- =========================================================

CREATE TABLE network_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    access_point_id UUID NOT NULL,

    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,

    severity VARCHAR(30) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'OPEN',

    metric VARCHAR(100),
    metric_value DECIMAL(12,2),
    threshold_value DECIMAL(12,2),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    acknowledged_at TIMESTAMP,
    resolved_at TIMESTAMP,

    CONSTRAINT fk_alert_access_point
        FOREIGN KEY (access_point_id)
        REFERENCES access_points(id)
        ON DELETE CASCADE,

    CONSTRAINT alert_severity_check
        CHECK (
            severity IN (
                'LOW',
                'MEDIUM',
                'HIGH',
                'CRITICAL'
            )
        ),

    CONSTRAINT alert_status_check
        CHECK (
            status IN (
                'OPEN',
                'ACKNOWLEDGED',
                'RESOLVED'
            )
        )
);


-- =========================================================
-- 7. RECOMMENDATIONS
-- =========================================================

CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    access_point_id UUID,

    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    reason TEXT,

    priority VARCHAR(30) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',

    metric VARCHAR(100),
    metric_value DECIMAL(12,2),
    recommended_value DECIMAL(12,2),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    implemented_at TIMESTAMP,

    CONSTRAINT fk_recommendation_access_point
        FOREIGN KEY (access_point_id)
        REFERENCES access_points(id)
        ON DELETE SET NULL,

    CONSTRAINT recommendation_priority_check
        CHECK (
            priority IN (
                'LOW',
                'MEDIUM',
                'HIGH',
                'CRITICAL'
            )
        ),

    CONSTRAINT recommendation_status_check
        CHECK (
            status IN (
                'PENDING',
                'ACCEPTED',
                'REJECTED',
                'IMPLEMENTED'
            )
        )
);


-- =========================================================
-- 8. PERFORMANCE REPORTS
-- =========================================================

CREATE TABLE performance_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    generated_by UUID NOT NULL,

    report_type VARCHAR(30) NOT NULL,
    title VARCHAR(200) NOT NULL,

    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,

    total_access_points INTEGER,

    average_signal DECIMAL(10,2),
    average_throughput DECIMAL(12,2),
    average_latency DECIMAL(10,2),
    average_packet_loss DECIMAL(10,2),
    average_bandwidth_utilization DECIMAL(10,2),
    average_availability DECIMAL(10,2),

    file_path VARCHAR(500),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_report_user
        FOREIGN KEY (generated_by)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT report_type_check
        CHECK (
            report_type IN (
                'DAILY',
                'WEEKLY',
                'MONTHLY',
                'CUSTOM'
            )
        )
);


-- =========================================================
-- 9. MONITORING SESSIONS
-- =========================================================

CREATE TABLE monitoring_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,

    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',

    metrics_collected INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT monitoring_session_status_check
        CHECK (
            status IN (
                'ACTIVE',
                'COMPLETED',
                'STOPPED'
            )
        )
);


-- =========================================================
-- 10. SYSTEM SETTINGS
-- =========================================================

CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value VARCHAR(255) NOT NULL,
    description TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 11. AUDIT LOGS
-- =========================================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID,

    action VARCHAR(50) NOT NULL,

    entity VARCHAR(100),
    entity_id UUID,

    description TEXT,

    ip_address VARCHAR(45),
    user_agent TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_audit_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);


-- =========================================================
-- INDEXES
-- =========================================================

CREATE INDEX idx_buildings_campus
    ON buildings(campus_id);

CREATE INDEX idx_access_points_building
    ON access_points(building_id);

CREATE INDEX idx_access_points_status
    ON access_points(status);

CREATE INDEX idx_network_metrics_access_point
    ON network_metrics(access_point_id);

CREATE INDEX idx_network_metrics_recorded_at
    ON network_metrics(recorded_at);

CREATE INDEX idx_network_alerts_access_point
    ON network_alerts(access_point_id);

CREATE INDEX idx_network_alerts_status
    ON network_alerts(status);

CREATE INDEX idx_network_alerts_created_at
    ON network_alerts(created_at);

CREATE INDEX idx_recommendations_access_point
    ON recommendations(access_point_id);

CREATE INDEX idx_recommendations_status
    ON recommendations(status);

CREATE INDEX idx_reports_generated_by
    ON performance_reports(generated_by);

CREATE INDEX idx_reports_created_at
    ON performance_reports(created_at);

CREATE INDEX idx_monitoring_sessions_status
    ON monitoring_sessions(status);

CREATE INDEX idx_audit_logs_user
    ON audit_logs(user_id);

CREATE INDEX idx_audit_logs_created_at
    ON audit_logs(created_at);


-- =========================================================
-- UPDATE TIMESTAMP FUNCTION
-- =========================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- =========================================================
-- UPDATE TIMESTAMP TRIGGERS
-- =========================================================

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


CREATE TRIGGER update_campuses_updated_at
BEFORE UPDATE ON campuses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


CREATE TRIGGER update_buildings_updated_at
BEFORE UPDATE ON buildings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


CREATE TRIGGER update_access_points_updated_at
BEFORE UPDATE ON access_points
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


CREATE TRIGGER update_recommendations_updated_at
BEFORE UPDATE ON recommendations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


CREATE TRIGGER update_system_settings_updated_at
BEFORE UPDATE ON system_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();