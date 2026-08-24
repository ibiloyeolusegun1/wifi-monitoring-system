import { Request, Response } from "express";
import {
  recordNetworkMetrics,
  getNetworkMetrics,
} from "../services/monitoring.service";

export async function recordMetrics(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const {
      accessPointId,
      signalStrength,
      throughput,
      latency,
      packetLoss,
      bandwidthUtilization,
      connectedUsers,
      accessPointUtilization,
      networkAvailability,
      channelUtilization,
    } = req.body;

    if (!accessPointId) {
      res.status(400).json({
        success: false,
        message: "Access point ID is required.",
      });
      return;
    }

    const metric = await recordNetworkMetrics({
      accessPointId,
      signalStrength,
      throughput,
      latency,
      packetLoss,
      bandwidthUtilization,
      connectedUsers,
      accessPointUtilization,
      networkAvailability,
      channelUtilization,
    });

    res.status(201).json({
      success: true,
      message: "Network metrics recorded successfully.",
      data: metric,
    });
  } catch (error) {
    console.error("Record network metrics error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export async function getMetrics(req: Request, res: Response): Promise<void> {
  try {
    const accessPointId =
      typeof req.query.accessPointId === "string"
        ? req.query.accessPointId
        : undefined;

    const metrics = await getNetworkMetrics(accessPointId);

    res.status(200).json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error("Get network metrics error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}
