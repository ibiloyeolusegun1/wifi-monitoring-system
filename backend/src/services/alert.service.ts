import pool from "../config/database";

interface AlertInput {
  accessPointId: string;
  title: string;
  message: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  metric: string;
  metricValue: number;
  thresholdValue: number;
}

export async function createAlert(data: AlertInput) {
  const result = await pool.query(
    `
    INSERT INTO network_alerts (
      access_point_id,
      title,
      message,
      severity,
      metric,
      metric_value,
      threshold_value
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
    `,
    [
      data.accessPointId,
      data.title,
      data.message,
      data.severity,
      data.metric,
      data.metricValue,
      data.thresholdValue,
    ],
  );

  return result.rows[0];
}

export async function generateAlerts(accessPointId: string) {
  const result = await pool.query(
    `
    SELECT
      signal_strength,
      latency,
      packet_loss,
      bandwidth_utilization,
      access_point_utilization,
      network_availability,
      channel_utilization
    FROM network_metrics
    WHERE access_point_id = $1
    ORDER BY recorded_at DESC
    LIMIT 1
    `,
    [accessPointId],
  );

  if (result.rows.length === 0) {
    return [];
  }

  const metric = result.rows[0];

  const alerts = [];

  if (metric.signal_strength !== null && Number(metric.signal_strength) < -70) {
    alerts.push(
      await createAlert({
        accessPointId,
        title: "Poor Signal Strength",
        message: "The Wi-Fi signal strength is below the acceptable threshold.",
        severity: "HIGH",
        metric: "signal_strength",
        metricValue: Number(metric.signal_strength),
        thresholdValue: -70,
      }),
    );
  }

  if (metric.latency !== null && Number(metric.latency) > 50) {
    alerts.push(
      await createAlert({
        accessPointId,
        title: "High Network Latency",
        message: "Network latency has exceeded the acceptable threshold.",
        severity: "HIGH",
        metric: "latency",
        metricValue: Number(metric.latency),
        thresholdValue: 50,
      }),
    );
  }

  if (metric.packet_loss !== null && Number(metric.packet_loss) > 2) {
    alerts.push(
      await createAlert({
        accessPointId,
        title: "High Packet Loss",
        message: "Packet loss has exceeded the acceptable network threshold.",
        severity: "HIGH",
        metric: "packet_loss",
        metricValue: Number(metric.packet_loss),
        thresholdValue: 2,
      }),
    );
  }

  if (
    metric.bandwidth_utilization !== null &&
    Number(metric.bandwidth_utilization) > 80
  ) {
    alerts.push(
      await createAlert({
        accessPointId,
        title: "High Bandwidth Utilization",
        message: "Bandwidth utilization is above the recommended level.",
        severity: "MEDIUM",
        metric: "bandwidth_utilization",
        metricValue: Number(metric.bandwidth_utilization),
        thresholdValue: 80,
      }),
    );
  }

  if (
    metric.access_point_utilization !== null &&
    Number(metric.access_point_utilization) > 80
  ) {
    alerts.push(
      await createAlert({
        accessPointId,
        title: "High Access Point Utilization",
        message: "The access point is handling a high level of utilization.",
        severity: "HIGH",
        metric: "access_point_utilization",
        metricValue: Number(metric.access_point_utilization),
        thresholdValue: 80,
      }),
    );
  }

  if (
    metric.network_availability !== null &&
    Number(metric.network_availability) < 99
  ) {
    alerts.push(
      await createAlert({
        accessPointId,
        title: "Low Network Availability",
        message: "Network availability has fallen below the required level.",
        severity: "CRITICAL",
        metric: "network_availability",
        metricValue: Number(metric.network_availability),
        thresholdValue: 99,
      }),
    );
  }

  if (
    metric.channel_utilization !== null &&
    Number(metric.channel_utilization) > 80
  ) {
    alerts.push(
      await createAlert({
        accessPointId,
        title: "High Channel Utilization",
        message: "The wireless channel is experiencing high utilization.",
        severity: "MEDIUM",
        metric: "channel_utilization",
        metricValue: Number(metric.channel_utilization),
        thresholdValue: 80,
      }),
    );
  }

  return alerts;
}

export async function getAlerts(accessPointId?: string) {
  const values: string[] = [];

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

  if (accessPointId) {
    values.push(accessPointId);
    query += ` WHERE na.access_point_id = $1`;
  }

  query += `
    ORDER BY na.created_at DESC
  `;

  const result = await pool.query(query, values);

  return result.rows;
}
