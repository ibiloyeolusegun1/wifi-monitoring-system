"use client";

interface ReportHeaderProps {
  title: string;
  subtitle: string;
  startDate?: string;
  endDate?: string;
}

export default function ReportHeader({
  title,
  subtitle,
  startDate,
  endDate,
}: ReportHeaderProps) {
  return (
    <div className="report-header mb-6 border-b border-slate-200 pb-5">
      <div className="text-center">
        <h1 className="text-xl font-bold uppercase text-slate-900">
          Wi-Fi Network Performance Monitoring and Recommendation System
        </h1>

        <h2 className="mt-2 text-lg font-semibold text-slate-800">{title}</h2>

        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <div>
          <span className="font-medium text-slate-600">Generated:</span>{" "}
          <span className="text-slate-500">{new Date().toLocaleString()}</span>
        </div>

        {startDate && (
          <div>
            <span className="font-medium text-slate-600">Start Date:</span>{" "}
            <span className="text-slate-500">{startDate}</span>
          </div>
        )}

        {endDate && (
          <div>
            <span className="font-medium text-slate-600">End Date:</span>{" "}
            <span className="text-slate-500">{endDate}</span>
          </div>
        )}
      </div>
    </div>
  );
}
