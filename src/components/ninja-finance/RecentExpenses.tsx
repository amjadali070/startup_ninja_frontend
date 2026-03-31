import { type FC } from "react";
import { SiAmazon, SiLinkedin } from "react-icons/si";
import { FiDollarSign } from "react-icons/fi";
import { Link } from "react-router-dom";

const RecentExpenses: FC = () => {
  const expenses = [
    {
      company: "Amazon Web Services",
      type: "Infrastructure",
      date: "May 12",
      amount: "-$12,450",
      icon: <SiAmazon className="w-4 h-4" />,
    },
    {
      company: "Linkedin Ads",
      type: "Marketing",
      date: "May 10",
      amount: "-$4,200",
      icon: <SiLinkedin className="w-4 h-4" />,
    },
    {
      company: "Deel Payroll",
      type: "Human Resources",
      date: "May 01",
      amount: "-$58,000",
      icon: <FiDollarSign className="w-4 h-4" />,
    },
  ];

  return (
    <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 lg:p-8 font-plus-jakarta h-full flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-white uppercase tracking-widest">
          Recent Expenses
        </h3>
        <Link 
          to="#" 
          className="text-[9px] font-black text-[#EF4444] hover:text-[#DC2626] transition-colors uppercase tracking-[0.2em]"
        >
          View All
        </Link>
      </div>

      <div className="flex flex-col gap-2 flex-1 justify-center">
        {expenses.map((expense) => (
          <div 
            key={expense.company}
            className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl group hover:bg-white/10 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#1a1a1a] border border-white/5 rounded-xl flex items-center justify-center text-gray-500 group-hover:text-white group-hover:border-[#EF444420] transition-all">
                {expense.icon}
              </div>
              <div className="flex flex-col">
                <h4 className="text-[13px] font-black text-white tracking-tight leading-none mb-1 group-hover:text-[#EF4444] transition-colors">
                  {expense.company}
                </h4>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                  {expense.type} • {expense.date}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-white tabular-nums tracking-tighter">
                {expense.amount}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentExpenses;
