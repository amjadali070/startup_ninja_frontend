import { type FC } from "react";

const NoContracts: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="p-6 rounded-2xl shadow-lg max-w-md">
        <h3 className="text-2xl font-semibold text-white mb-2">
          No Contracts Yet
        </h3>
        <p className="text-gray-400 mb-6">
          You haven't generated any legal contracts yet. Get started now and protect your startup with AI-powered legal documents!
        </p>
      </div>
    </div>
  );
};

export default NoContracts;
