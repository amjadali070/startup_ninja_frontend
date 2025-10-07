import type { FC } from 'react';

const AIChatFooterNotice: FC = () => {
  return (
    <footer className="mt-14 text-center text-xs text-white/35">
      Startup Ninja can make mistakes. Check important info.{' '}
      <button type="button" className="text-white/60 underline decoration-dotted underline-offset-2 transition-colors duration-200 hover:text-white">
        See Cookie Preferences
      </button>
    </footer>
  );
};

export default AIChatFooterNotice;
