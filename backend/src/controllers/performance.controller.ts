import { Request, Response } from "express";
import { analyzePerformance } from "../services/performance.service";

export async function analyzeNetworkPerformance(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { accessPointId } = req.params;

    if (!accessPointId) {
      res.status(400).json({
        success: false,
        message: "Access point ID is required.",
      });
      return;
    }

    const result = await analyzePerformance(accessPointId);

    res.status(200).json({
      success: true,
      message: "Network performance analyzed successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Performance analysis error:", error);

    if (
      error instanceof Error &&
      error.message.includes("No network metrics")
    ) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}
