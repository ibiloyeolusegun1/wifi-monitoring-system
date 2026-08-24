import pool from "../config/database";

interface RecommendationInput {
  accessPointId: string;
  title: string;
  description: string;
  reason: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  metric: string;
  metricValue: number;
  recommendedValue?: number;
}

async function createRecommendation(data: RecommendationInput) {
  const result = await pool.query(
    `
    INSERT INTO recommendations (
      access_point_id,
      title,
      description,
      reason,
      priority,
      metric,
      metric_value,
      recommended_value
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8
    )
    RETURNING *
    `,
    [
      data.accessPointId,
      data.title,
      data.description,
      data.reason,
      data.priority,
      data.metric,
      data.metricValue,
      data.recommendedValue ?? null,
    ],
  );

  return result.rows[0];
}

export async function generateRecommendations(accessPointId: string) {
  const result = await pool.query(
    `
    SELECT
      signal_strength,
      throughput,
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
    throw new Error("No network metrics found for this access point.");
  }

  const metric = result.rows[0];

  const recommendations = [];

  // Signal strength
  if (metric.signal_strength !== null && Number(metric.signal_strength) < -70) {
    recommendations.push(
      await createRecommendation({
        accessPointId,
        title: "Improve Wi-Fi Signal Coverage",
        description:
          "Consider repositioning the access point or deploying an additional access point in the affected area.",
        reason:
          "The measured signal strength is below the acceptable threshold.",
        priority: "HIGH",
        metric: "signal_strength",
        metricValue: Number(metric.signal_strength),
        recommendedValue: -70,
      }),
    );
  }

  // Latency
  if (metric.latency !== null && Number(metric.latency) > 50) {
    recommendations.push(
      await createRecommendation({
        accessPointId,
        title: "Reduce Network Latency",
        description:
          "Investigate network congestion, upstream connectivity, and overloaded network resources.",
        reason: "The measured latency is above the acceptable threshold.",
        priority: "HIGH",
        metric: "latency",
        metricValue: Number(metric.latency),
        recommendedValue: 50,
      }),
    );
  }

  // Packet loss
  if (metric.packet_loss !== null && Number(metric.packet_loss) > 2) {
    recommendations.push(
      await createRecommendation({
        accessPointId,
        title: "Investigate Packet Loss",
        description:
          "Check wireless interference, connectivity problems, and network equipment for possible faults.",
        reason: "Packet loss is above the acceptable network threshold.",
        priority: "HIGH",
        metric: "packet_loss",
        metricValue: Number(metric.packet_loss),
        recommendedValue: 2,
      }),
    );
  }

  // Bandwidth utilization
  if (
    metric.bandwidth_utilization !== null &&
    Number(metric.bandwidth_utilization) > 80
  ) {
    recommendations.push(
      await createRecommendation({
        accessPointId,
        title: "Reduce Bandwidth Utilization",
        description:
          "Investigate high traffic consumption and consider traffic management or additional network capacity.",
        reason: "Bandwidth utilization has exceeded the recommended level.",
        priority: "MEDIUM",
        metric: "bandwidth_utilization",
        metricValue: Number(metric.bandwidth_utilization),
        recommendedValue: 80,
      }),
    );
  }

  // Access point utilization
  if (
    metric.access_point_utilization !== null &&
    Number(metric.access_point_utilization) > 80
  ) {
    recommendations.push(
      await createRecommendation({
        accessPointId,
        title: "Balance Access Point Utilization",
        description:
          "Consider distributing users across additional access points to reduce the load on the current access point.",
        reason: "Access point utilization is above the recommended level.",
        priority: "HIGH",
        metric: "access_point_utilization",
        metricValue: Number(metric.access_point_utilization),
        recommendedValue: 80,
      }),
    );
  }

  // Availability
  if (
    metric.network_availability !== null &&
    Number(metric.network_availability) < 99
  ) {
    recommendations.push(
      await createRecommendation({
        accessPointId,
        title: "Improve Network Availability",
        description:
          "Investigate access point downtime, connectivity failures, and network infrastructure reliability.",
        reason: "Network availability is below the required level.",
        priority: "CRITICAL",
        metric: "network_availability",
        metricValue: Number(metric.network_availability),
        recommendedValue: 99,
      }),
    );
  }

  // Channel utilization
  if (
    metric.channel_utilization !== null &&
    Number(metric.channel_utilization) > 80
  ) {
    recommendations.push(
      await createRecommendation({
        accessPointId,
        title: "Optimize Wireless Channel",
        description:
          "Consider changing the wireless channel to reduce interference and improve network performance.",
        reason: "Channel utilization is above the recommended level.",
        priority: "MEDIUM",
        metric: "channel_utilization",
        metricValue: Number(metric.channel_utilization),
        recommendedValue: 80,
      }),
    );
  }

  return recommendations;
}

export async function getRecommendations(accessPointId?: string) {
  const values: string[] = [];

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

    LEFT JOIN access_points ap
      ON ap.id = r.access_point_id

    LEFT JOIN buildings b
      ON b.id = ap.building_id

    LEFT JOIN campuses c
      ON c.id = b.campus_id
  `;

  if (accessPointId) {
    values.push(accessPointId);
    query += ` WHERE r.access_point_id = $1`;
  }

  query += `
    ORDER BY r.created_at DESC
  `;

  const result = await pool.query(query, values);

  return result.rows;
}
