import pool from "../config/database";

interface PerformanceResult {
  status: "GOOD" | "WARNING" | "CRITICAL";
  issues: string[];
}

export async function analyzePerformance(
  accessPointId: string,
): Promise<PerformanceResult> {
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

  const issues: string[] = [];

  // Signal strength
  if (metric.signal_strength !== null && Number(metric.signal_strength) < -70) {
    issues.push("Poor Wi-Fi signal strength.");
  }

  // Latency
  if (metric.latency !== null && Number(metric.latency) > 50) {
    issues.push("High network latency.");
  }

  // Packet loss
  if (metric.packet_loss !== null && Number(metric.packet_loss) > 2) {
    issues.push("High packet loss.");
  }

  // Bandwidth utilization
  if (
    metric.bandwidth_utilization !== null &&
    Number(metric.bandwidth_utilization) > 80
  ) {
    issues.push("High bandwidth utilization.");
  }

  // Access point utilization
  if (
    metric.access_point_utilization !== null &&
    Number(metric.access_point_utilization) > 80
  ) {
    issues.push("High access point utilization.");
  }

  // Availability
  if (
    metric.network_availability !== null &&
    Number(metric.network_availability) < 99
  ) {
    issues.push("Low network availability.");
  }

  // Channel utilization
  if (
    metric.channel_utilization !== null &&
    Number(metric.channel_utilization) > 80
  ) {
    issues.push("High channel utilization.");
  }

  let status: PerformanceResult["status"];

  if (issues.length === 0) {
    status = "GOOD";
  } else if (issues.length <= 2) {
    status = "WARNING";
  } else {
    status = "CRITICAL";
  }

  return {
    status,
    issues,
  };
}
