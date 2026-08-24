import pool from "../config/database";

export interface NetworkMetricInput {
  accessPointId: string;
  signalStrength?: number;
  throughput?: number;
  latency?: number;
  packetLoss?: number;
  bandwidthUtilization?: number;
  connectedUsers?: number;
  accessPointUtilization?: number;
  networkAvailability?: number;
  channelUtilization?: number;
}

export async function recordNetworkMetrics(
  data: NetworkMetricInput
) {
  const result = await pool.query(
    `
    INSERT INTO network_metrics (
      access_point_id,
      signal_strength,
      throughput,
      latency,
      packet_loss,
      bandwidth_utilization,
      connected_users,
      access_point_utilization,
      network_availability,
      channel_utilization
    )
    VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10
    )
    RETURNING *
    `,
    [
      data.accessPointId,
      data.signalStrength ?? null,
      data.throughput ?? null,
      data.latency ?? null,
      data.packetLoss ?? null,
      data.bandwidthUtilization ?? null,
      data.connectedUsers ?? null,
      data.accessPointUtilization ?? null,
      data.networkAvailability ?? null,
      data.channelUtilization ?? null,
    ]
  );

  return result.rows[0];
}


export async function getNetworkMetrics(
  accessPointId?: string
) {
  const values: string[] = [];

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

  if (accessPointId) {
    values.push(accessPointId);
    query += ` WHERE nm.access_point_id = $1`;
  }

  query += `
    ORDER BY nm.recorded_at DESC
  `;

  const result = await pool.query(query, values);

  return result.rows;
}