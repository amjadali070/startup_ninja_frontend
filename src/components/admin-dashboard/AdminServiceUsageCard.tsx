import React from "react";
import { FaLayerGroup } from "react-icons/fa";

interface AdminServiceUsageCardProps {
  name: string;
  metrics: Array<{
    label: string;
    value: number;
  }>;
  icon?: React.ElementType;
}

const AdminServiceUsageCard: React.FC<AdminServiceUsageCardProps> = ({
  name,
  metrics,
  icon: Icon = FaLayerGroup,
}) => {
  return (
    <div className="w-full bg-[#151515] border-[1.96px] border-[#242424] rounded-[9.76px] p-4 min-h-[170px] flex flex-col justify-between">
      <div className="flex items-start justify-between gap-2 mb-3">
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
        <p className="text-sm font-semibold text-gray-300 uppercase tracking-wider mt-1">
          {name}
        </p>
      </div>
      <div className="space-y-2 mt-auto">
        {metrics.map((metric) => (
          <div
            key={`${name}-${metric.label}`}
            className="flex items-center justify-between bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2"
          >
            <span className="text-sm text-gray-400">{metric.label}</span>
            <span className="text-sm font-semibold text-white">
              {metric.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminServiceUsageCard;
