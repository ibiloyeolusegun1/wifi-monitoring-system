import { Request, Response } from "express";
import {
  generateRecommendations,
  getRecommendations,
} from "../services/recommendation.service";

export async function generateNetworkRecommendations(
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

    const recommendations = await generateRecommendations(accessPointId);

    res.status(200).json({
      success: true,
      message: recommendations.length
        ? "Recommendations generated successfully."
        : "No optimization recommendations required.",
      data: recommendations,
    });
  } catch (error) {
    console.error("Generate recommendations error:", error);

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

export async function getNetworkRecommendations(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const accessPointId =
      typeof req.query.accessPointId === "string"
        ? req.query.accessPointId
        : undefined;

    const recommendations =
      await getRecommendations(accessPointId);

    res.status(200).json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    console.error(
      "Get recommendations error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}
