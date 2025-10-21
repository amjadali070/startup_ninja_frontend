import type { FC } from 'react';

const SettingsHeader: FC = () => {
  return (
    <header className="flex flex-col gap-3 xs:gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-2xl font-semibold text-white">Account & workspace settings</h2>
      </div>
    </header>
  );
};

export default SettingsHeader;
