import pool from "../config/database";

export async function getPerformanceReport(
  startDate?: string,
  endDate?: string,
  accessPointId?: string,
) {
  const values: string[] = [];
  const conditions: string[] = [];

  let query = `
    SELECT
      nm.id,
      nm.access_point_id,
      ap.name AS access_point_name,
      b.name AS building_name,
      c.name AS campus_name,
      nm.signal_strength,
      nm.throughput,
      nm.latency,
      nm.packet_loss,
      nm.bandwidth_utilization,
      nm.connected_users,
      nm.access_point_utilization,
      nm.network_availability,
      nm.channel_utilization,
      nm.recorded_at
    FROM network_metrics nm
    INNER JOIN access_points ap
      ON ap.id = nm.access_point_id
    INNER JOIN buildings b
      ON b.id = ap.building_id
    INNER JOIN campuses c
      ON c.id = b.campus_id
  `;

  if (startDate) {
    values.push(startDate);
    conditions.push(`nm.recorded_at >= $${values.length}`);
  }

  if (endDate) {
    values.push(endDate);
    conditions.push(`nm.recorded_at <= $${values.length}`);
  }

  if (accessPointId) {
    values.push(accessPointId);
    conditions.push(`nm.access_point_id = $${values.length}`);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  query += `
    ORDER BY nm.recorded_at DESC
  `;

  const result = await pool.query(query, values);

  return result.rows;
}

export async function getAlertReport(
  startDate?: string,
  endDate?: string,
  accessPointId?: string,
) {
  const values: string[] = [];
  const conditions: string[] = [];

  let query = `
    SELECT
      na.id,
      na.access_point_id,
      ap.name AS access_point_name,
      b.name AS building_name,
      c.name AS campus_name,
      na.title,
      na.message,
      na.severity,
      na.status,
      na.metric,
      na.metric_value,
      na.threshold_value,
      na.created_at,
      na.acknowledged_at,
      na.resolved_at
    FROM network_alerts na
    INNER JOIN access_points ap
      ON ap.id = na.access_point_id
    INNER JOIN buildings b
      ON b.id = ap.building_id
    INNER JOIN campuses c
      ON c.id = b.campus_id
  `;

  if (startDate) {
    values.push(startDate);
    conditions.push(`na.created_at >= $${values.length}`);
  }

  if (endDate) {
    values.push(endDate);
    conditions.push(`na.created_at <= $${values.length}`);
  }

  if (accessPointId) {
    values.push(accessPointId);
    conditions.push(`na.access_point_id = $${values.length}`);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  query += `
    ORDER BY na.created_at DESC
  `;

  const result = await pool.query(query, values);

  return result.rows;
}

export async function getRecommendationReport(
  startDate?: string,
  endDate?: string,
  accessPointId?: string,
) {
  const values: string[] = [];
  const conditions: string[] = [];

  let query = `
    SELECT
      r.id,
      r.access_point_id,
      ap.name AS access_point_name,
      b.name AS building_name,
      c.name AS campus_name,
      r.title,
      r.description,
      r.reason,
      r.priority,
      r.status,
      r.metric,
      r.metric_value,
      r.recommended_value,
      r.created_at,
      r.updated_at,
      r.implemented_at
    FROM recommendations r
    INNER JOIN access_points ap
      ON ap.id = r.access_point_id
    INNER JOIN buildings b
      ON b.id = ap.building_id
    INNER JOIN campuses c
      ON c.id = b.campus_id
  `;

  if (startDate) {
    values.push(startDate);
    conditions.push(`r.created_at >= $${values.length}`);
  }

  if (endDate) {
    values.push(endDate);
    conditions.push(`r.created_at <= $${values.length}`);
  }

  if (accessPointId) {
    values.push(accessPointId);
    conditions.push(`r.access_point_id = $${values.length}`);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  query += `
    ORDER BY r.created_at DESC
  `;

  const result = await pool.query(query, values);

  return result.rows;
}

export async function getAccessPointReport() {
  const result = await pool.query(`
    SELECT
      ap.id,
      ap.name,
      ap.mac_address,
      ap.ip_address,
      ap.ssid,
      ap.channel,
      ap.frequency,
      ap.status,
      ap.latitude,
      ap.longitude,
      ap.installed_at,
      b.name AS building_name,
      c.name AS campus_name,
      ap.created_at
    FROM access_points ap
    INNER JOIN buildings b
      ON b.id = ap.building_id
    INNER JOIN campuses c
      ON c.id = b.campus_id
    ORDER BY c.name ASC, b.name ASC, ap.name ASC
  `);

  return result.rows;
}
