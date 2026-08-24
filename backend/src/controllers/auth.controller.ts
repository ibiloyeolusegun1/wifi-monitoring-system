import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import pool from "../config/database";
import { generateToken } from "../utils/jwt";

export async function register(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const {
      username,
      email,
      password,
      fullName,
    } = req.body;

    if (!username || !email || !password || !fullName) {
      res.status(400).json({
        success: false,
        message: "Username, email, password and full name are required.",
      });
      return;
    }

    const existingUser = await pool.query(
      `
      SELECT id
      FROM users
      WHERE username = $1 OR email = $2
      `,
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      res.status(409).json({
        success: false,
        message: "Username or email already exists.",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users (
        username,
        email,
        password,
        full_name,
        role
      )
      VALUES ($1, $2, $3, $4, 'ADMIN')
      RETURNING
        id,
        username,
        email,
        full_name,
        role,
        is_active,
        created_at
      `,
      [
        username,
        email,
        hashedPassword,
        fullName,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Administrator registered successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}


export async function login(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({
        success: false,
        message: "Username and password are required.",
      });
      return;
    }

    const result = await pool.query(
      `
      SELECT
        id,
        username,
        email,
        password,
        full_name,
        role,
        is_active
      FROM users
      WHERE username = $1
      `,
      [username]
    );

    if (result.rows.length === 0) {
      res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
      return;
    }

    const user = result.rows[0];

    if (!user.is_active) {
      res.status(403).json({
        success: false,
        message: "This account has been deactivated.",
      });
      return;
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
      return;
    }

    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.full_name,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}



export async function getCurrentUser(
  req: import("express").Request,
  res: Response
): Promise<void> {
  try {
    const authReq = req as import("../middleware/auth.middleware")
      .AuthenticatedRequest;

    if (!authReq.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
      return;
    }

    const result = await pool.query(
      `
      SELECT
        id,
        username,
        email,
        full_name,
        role,
        is_active,
        created_at
      FROM users
      WHERE id = $1
      `,
      [authReq.user.id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Get current user error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}