import { Request, Response } from "express";
import { generateAlerts, getAlerts } from "../services/alert.service";

export async function generateNetworkAlerts(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const accessPointId = req.params.accessPointId;

    if (typeof accessPointId !== "string" || !accessPointId) {
      res.status(400).json({
        success: false,
        message: "Access point ID is required.",
      });
      return;
    }

    const alerts = await generateAlerts(accessPointId);

    if (alerts.length === 0) {
      res.status(200).json({
        success: true,
        message: "No network problems detected.",
        data: [],
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: "Network alerts generated successfully.",
      data: alerts,
    });
  } catch (error) {
    console.error("Generate alerts error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export async function getNetworkAlerts(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const accessPointId =
      typeof req.query.accessPointId === "string"
        ? req.query.accessPointId
        : undefined;

    const alerts = await getAlerts(accessPointId);

    res.status(200).json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    console.error("Get alerts error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}
