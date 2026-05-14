import React from "react";
import { FaChartLine } from "react-icons/fa";

interface AdminKpiStatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  format?: "currency";
  icon?: React.ElementType;
}

const formatValue = (value: number | string, format?: "currency") => {
  if (format === "currency") {
    const num = Number(value || 0);
    return `$${num.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  }
  if (typeof value === "number") return value.toLocaleString();
  return value;
};

const AdminKpiStatCard: React.FC<AdminKpiStatCardProps> = ({
  title,
  value,
  subtitle,
  format,
  icon: Icon = FaChartLine,
}) => {
  return (
    <div className="w-full bg-[#151515] border-[1.96px] border-[#242424] rounded-[9.76px] p-4 min-h-[170px] flex flex-col justify-between">
      <div className="m-2">
        <Icon
          className="w-6 h-6"
          style={{
            color: "#DC2626",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        />
      </div>

      <div className="flex flex-col gap-2 mb-2 flex-grow justify-end">
        <p className="text-white text-2xl font-bold leading-tight">
          {formatValue(value, format)}
        </p>
        {subtitle ? (
          <div className="inline-flex items-center text-[11px] text-green-300 bg-[#102418] rounded-full px-2 py-1 w-fit">
            {subtitle}
          </div>
        ) : null}
      </div>

      <div>
        <p className="text-gray-400 text-sm font-medium leading-tight">{title}</p>
      </div>
    </div>
  );
};

export default AdminKpiStatCard;
