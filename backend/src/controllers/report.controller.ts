import { Request, Response } from "express";

import {
  getPerformanceReport,
  getAlertReport,
  getRecommendationReport,
  getAccessPointReport,
} from "../services/report.service";

export async function performanceReport(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { startDate, endDate, accessPointId } = req.query;

    const data = await getPerformanceReport(
      typeof startDate === "string" ? startDate : undefined,
      typeof endDate === "string" ? endDate : undefined,
      typeof accessPointId === "string" ? accessPointId : undefined,
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Performance report error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to generate performance report.",
    });
  }
}

export async function alertReport(req: Request, res: Response): Promise<void> {
  try {
    const { startDate, endDate, accessPointId } = req.query;

    const data = await getAlertReport(
      typeof startDate === "string" ? startDate : undefined,
      typeof endDate === "string" ? endDate : undefined,
      typeof accessPointId === "string" ? accessPointId : undefined,
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Alert report error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to generate alert report.",
    });
  }
}

export async function recommendationReport(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { startDate, endDate, accessPointId } = req.query;

    const data = await getRecommendationReport(
      typeof startDate === "string" ? startDate : undefined,
      typeof endDate === "string" ? endDate : undefined,
      typeof accessPointId === "string" ? accessPointId : undefined,
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Recommendation report error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to generate recommendation report.",
    });
  }
}

export async function accessPointReport(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    const data = await getAccessPointReport();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Access point report error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to generate access point report.",
    });
  }
}
