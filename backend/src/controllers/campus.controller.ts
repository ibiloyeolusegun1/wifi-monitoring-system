import { Request, Response } from "express";
import pool from "../config/database";

export async function createCampus(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { name, location, description } = req.body;

    if (!name) {
      res.status(400).json({
        success: false,
        message: "Campus name is required.",
      });
      return;
    }

    const existing = await pool.query(
      `SELECT id FROM campuses WHERE name = $1`,
      [name]
    );

    if (existing.rows.length > 0) {
      res.status(409).json({
        success: false,
        message: "Campus already exists.",
      });
      return;
    }

    const result = await pool.query(
      `
      INSERT INTO campuses (
        name,
        location,
        description
      )
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [name, location || null, description || null]
    );

    res.status(201).json({
      success: true,
      message: "Campus created successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Create campus error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export async function getCampuses(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const result = await pool.query(
      `
      SELECT
        id,
        name,
        location,
        description,
        is_active,
        created_at,
        updated_at
      FROM campuses
      ORDER BY name ASC
      `
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Get campuses error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export async function getCampusById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        id,
        name,
        location,
        description,
        is_active,
        created_at,
        updated_at
      FROM campuses
      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Campus not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Get campus error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export async function updateCampus(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const { name, location, description, isActive } = req.body;

    const result = await pool.query(
      `
      UPDATE campuses
      SET
        name = COALESCE($1, name),
        location = COALESCE($2, location),
        description = COALESCE($3, description),
        is_active = COALESCE($4, is_active)
      WHERE id = $5
      RETURNING *
      `,
      [
        name ?? null,
        location ?? null,
        description ?? null,
        isActive ?? null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Campus not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Campus updated successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Update campus error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export async function deleteCampus(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM campuses
      WHERE id = $1
      RETURNING id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Campus not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Campus deleted successfully.",
    });
  } catch (error) {
    console.error("Delete campus error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}