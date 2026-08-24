import { Request, Response } from "express";
import pool from "../config/database";

export async function createAccessPoint(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const {
      buildingId,
      name,
      macAddress,
      ipAddress,
      ssid,
      channel,
      frequency,
      status,
      latitude,
      longitude,
      installedAt,
    } = req.body;

    if (!buildingId || !name || !macAddress || !ssid) {
      res.status(400).json({
        success: false,
        message:
          "Building ID, name, MAC address and SSID are required.",
      });
      return;
    }

    const building = await pool.query(
      `SELECT id FROM buildings WHERE id = $1`,
      [buildingId]
    );

    if (building.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Building not found.",
      });
      return;
    }

    const existing = await pool.query(
      `
      SELECT id
      FROM access_points
      WHERE mac_address = $1
      `,
      [macAddress]
    );

    if (existing.rows.length > 0) {
      res.status(409).json({
        success: false,
        message: "An access point with this MAC address already exists.",
      });
      return;
    }

    const result = await pool.query(
      `
      INSERT INTO access_points (
        building_id,
        name,
        mac_address,
        ip_address,
        ssid,
        channel,
        frequency,
        status,
        latitude,
        longitude,
        installed_at
      )
      VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10, $11
      )
      RETURNING *
      `,
      [
        buildingId,
        name,
        macAddress,
        ipAddress || null,
        ssid,
        channel ?? null,
        frequency || null,
        status || "OFFLINE",
        latitude ?? null,
        longitude ?? null,
        installedAt || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Access point created successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Create access point error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export async function getAccessPoints(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { buildingId, status } = req.query;

    const values: string[] = [];
    const conditions: string[] = [];

    let query = `
      SELECT
        ap.id,
        ap.building_id,
        b.name AS building_name,
        c.id AS campus_id,
        c.name AS campus_name,
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
        ap.created_at,
        ap.updated_at
      FROM access_points ap
      INNER JOIN buildings b
        ON b.id = ap.building_id
      INNER JOIN campuses c
        ON c.id = b.campus_id
    `;

    if (buildingId) {
      values.push(String(buildingId));
      conditions.push(`ap.building_id = $${values.length}`);
    }

    if (status) {
      values.push(String(status));
      conditions.push(`ap.status = $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += ` ORDER BY ap.name ASC`;

    const result = await pool.query(query, values);

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Get access points error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export async function getAccessPointById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        ap.id,
        ap.building_id,
        b.name AS building_name,
        c.id AS campus_id,
        c.name AS campus_name,
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
        ap.created_at,
        ap.updated_at
      FROM access_points ap
      INNER JOIN buildings b
        ON b.id = ap.building_id
      INNER JOIN campuses c
        ON c.id = b.campus_id
      WHERE ap.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Access point not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Get access point error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export async function updateAccessPoint(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;

    const {
      name,
      ipAddress,
      ssid,
      channel,
      frequency,
      status,
      latitude,
      longitude,
      installedAt,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE access_points
      SET
        name = COALESCE($1, name),
        ip_address = COALESCE($2, ip_address),
        ssid = COALESCE($3, ssid),
        channel = COALESCE($4, channel),
        frequency = COALESCE($5, frequency),
        status = COALESCE($6, status),
        latitude = COALESCE($7, latitude),
        longitude = COALESCE($8, longitude),
        installed_at = COALESCE($9, installed_at)
      WHERE id = $10
      RETURNING *
      `,
      [
        name ?? null,
        ipAddress ?? null,
        ssid ?? null,
        channel ?? null,
        frequency ?? null,
        status ?? null,
        latitude ?? null,
        longitude ?? null,
        installedAt ?? null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Access point not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Access point updated successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Update access point error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export async function deleteAccessPoint(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM access_points
      WHERE id = $1
      RETURNING id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Access point not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Access point deleted successfully.",
    });
  } catch (error) {
    console.error("Delete access point error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}