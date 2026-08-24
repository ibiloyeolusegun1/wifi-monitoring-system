import { Request, Response } from "express";
import {
  getDashboardStatistics,
  getRecentPerformance,
} from "../services/dashboard.service";

export async function dashboardSummary(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    const summary = await getDashboardStatistics();

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export async function recentPerformance(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    const performance = await getRecentPerformance();

    res.status(200).json({
      success: true,
      data: performance,
    });
  } catch (error) {
    console.error("Recent performance error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load network performance.",
    });
  }
}
