import { Request, Response } from "express";
import pool from "../config/database";

export async function createBuilding(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { campusId, name, location, description } = req.body;

    if (!campusId || !name) {
      res.status(400).json({
        success: false,
        message: "Campus ID and building name are required.",
      });
      return;
    }

    const campus = await pool.query(
      `SELECT id FROM campuses WHERE id = $1`,
      [campusId]
    );

    if (campus.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Campus not found.",
      });
      return;
    }

    const existing = await pool.query(
      `
      SELECT id
      FROM buildings
      WHERE campus_id = $1
      AND name = $2
      `,
      [campusId, name]
    );

    if (existing.rows.length > 0) {
      res.status(409).json({
        success: false,
        message: "Building already exists in this campus.",
      });
      return;
    }

    const result = await pool.query(
      `
      INSERT INTO buildings (
        campus_id,
        name,
        location,
        description
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [
        campusId,
        name,
        location || null,
        description || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Building created successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Create building error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export async function getBuildings(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { campusId } = req.query;

    const values: string[] = [];
    let query = `
      SELECT
        b.id,
        b.campus_id,
        c.name AS campus_name,
        b.name,
        b.location,
        b.description,
        b.created_at,
        b.updated_at
      FROM buildings b
      INNER JOIN campuses c
        ON c.id = b.campus_id
    `;

    if (campusId) {
      values.push(String(campusId));
      query += ` WHERE b.campus_id = $1`;
    }

    query += ` ORDER BY b.name ASC`;

    const result = await pool.query(query, values);

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Get buildings error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export async function getBuildingById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        b.id,
        b.campus_id,
        c.name AS campus_name,
        b.name,
        b.location,
        b.description,
        b.created_at,
        b.updated_at
      FROM buildings b
      INNER JOIN campuses c
        ON c.id = b.campus_id
      WHERE b.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Building not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Get building error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export async function updateBuilding(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const { name, location, description } = req.body;

    const result = await pool.query(
      `
      UPDATE buildings
      SET
        name = COALESCE($1, name),
        location = COALESCE($2, location),
        description = COALESCE($3, description)
      WHERE id = $4
      RETURNING *
      `,
      [
        name ?? null,
        location ?? null,
        description ?? null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Building not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Building updated successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Update building error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export async function deleteBuilding(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM buildings
      WHERE id = $1
      RETURNING id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Building not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Building deleted successfully.",
    });
  } catch (error) {
    console.error("Delete building error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}