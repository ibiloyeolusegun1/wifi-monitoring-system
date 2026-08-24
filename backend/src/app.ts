import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes";
import campusRoutes from "./routes/campus.routes";
import buildingRoutes from "./routes/building.routes";
import accessPointRoutes from "./routes/accessPoint.routes";
import monitoringRoutes from "./routes/monitoring.routes";
import performanceRoutes from "./routes/performance.routes";
import alertRoutes from "./routes/alert.routes";
import recommendationRoutes from "./routes/recommendation.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import reportRoutes from "./routes/report.routes";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: "*",
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Wi-Fi Monitoring API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/campuses", campusRoutes);
app.use("/api/buildings", buildingRoutes);
app.use("/api/access-points", accessPointRoutes);
app.use("/api/monitoring", monitoringRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);

export default app;
