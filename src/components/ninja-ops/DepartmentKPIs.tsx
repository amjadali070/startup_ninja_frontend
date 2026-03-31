import { type FC } from "react";

const DepartmentKPIs: FC = () => {
  const depts = [
    { name: "Engineering", score: 94, detail: "12 Active Sprints" },
    { name: "Marketing", score: 82, detail: "4 Global Campaigns" },
    { name: "Design", score: 91, detail: "8 Prototypes Live" },
    { name: "Sales", score: 76, detail: "Enterprise Pipeline" },
    { name: "Customer Support", score: 95, detail: "120 Avg. Daily Resolves" },
    { name: "Quality Assurance", score: 88, detail: "6 Sprints Verified" },
    { name: "Marketing", score: 82, detail: "4 Global Campaigns" },
  ];

  return (
    <div className="bg-[#121212] rounded-[40px] p-10 lg:p-12 h-full font-plus-jakarta flex flex-col gap-10 group relative overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-black text-white tracking-tight leading-none">Department KPIs</h2>
      </div>

      <div className="flex flex-col gap-10">
        {depts.map((dept, index) => (
          <div key={index} className="flex items-start justify-between group/row hover:opacity-100 transition-opacity">
            <div className="flex-1">
              <h4 className="text-[18px] font-black text-white leading-none mb-1 group-hover/row:text-white transition-colors uppercase tracking-[0.05em]">{dept.name}</h4>
              <p className="text-[12px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
                {dept.detail}
              </p>
            </div>

            <div className="flex flex-col items-end gap-3 w-[45%]">
              <span className="text-[18px] font-black text-white leading-none">{dept.score}%</span>
              <div className="relative h-2 w-full bg-[#1A1A1A] rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-[#EF4444] transition-all duration-1000 shadow-[0_0_12px_rgba(239,68,68,0.3)]"
                  style={{ width: `${dept.score}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentKPIs;
