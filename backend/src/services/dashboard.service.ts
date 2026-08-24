import pool from "../config/database";

export async function getDashboardStatistics() {
  const totalAccessPoints = await pool.query(
    `SELECT COUNT(*)::int AS total FROM access_points`,
  );

  const onlineAccessPoints = await pool.query(
    `SELECT COUNT(*)::int AS total
     FROM access_points
     WHERE status='ONLINE'`,
  );

  const offlineAccessPoints = await pool.query(
    `SELECT COUNT(*)::int AS total
     FROM access_points
     WHERE status='OFFLINE'`,
  );

  const totalAlerts = await pool.query(
    `SELECT COUNT(*)::int AS total FROM network_alerts`,
  );

  const criticalAlerts = await pool.query(
    `SELECT COUNT(*)::int AS total
     FROM network_alerts
     WHERE severity='CRITICAL'
       AND status='OPEN'`,
  );

  const pendingRecommendations = await pool.query(
    `SELECT COUNT(*)::int AS total
     FROM recommendations
     WHERE status='PENDING'`,
  );

  const averages = await pool.query(`
    SELECT
      ROUND(AVG(signal_strength),2) AS signal_strength,
      ROUND(AVG(throughput),2) AS throughput,
      ROUND(AVG(latency),2) AS latency,
      ROUND(AVG(packet_loss),2) AS packet_loss,
      ROUND(AVG(network_availability),2) AS availability
    FROM (
      SELECT DISTINCT ON (access_point_id)
        signal_strength,
        throughput,
        latency,
        packet_loss,
        network_availability
      FROM network_metrics
      ORDER BY access_point_id, recorded_at DESC
    ) latest_metrics
  `);

  return {
    totalAccessPoints: totalAccessPoints.rows[0].total,
    onlineAccessPoints: onlineAccessPoints.rows[0].total,
    offlineAccessPoints: offlineAccessPoints.rows[0].total,
    totalAlerts: totalAlerts.rows[0].total,
    criticalAlerts: criticalAlerts.rows[0].total,
    pendingRecommendations: pendingRecommendations.rows[0].total,
    averageSignalStrength: averages.rows[0].signal_strength,
    averageThroughput: averages.rows[0].throughput,
    averageLatency: averages.rows[0].latency,
    averagePacketLoss: averages.rows[0].packet_loss,
    networkAvailability: averages.rows[0].availability,
  };
}

export async function getRecentPerformance() {
  const result = await pool.query(`
    SELECT
      recorded_at,
      ROUND(AVG(signal_strength), 2) AS signal_strength,
      ROUND(AVG(throughput), 2) AS throughput,
      ROUND(AVG(latency), 2) AS latency,
      ROUND(AVG(packet_loss), 2) AS packet_loss
    FROM network_metrics
    WHERE recorded_at >= NOW() - INTERVAL '24 hours'
    GROUP BY recorded_at
    ORDER BY recorded_at ASC
  `);

  return result.rows;
}
