import React from 'react';

const chatBubbles = [
    'A sleek red sports bike parked in a narrow urban alley, realistic 3D render style. The bike should shine with',
    'A sleek red sports bike parked in a narrow urban alley, realistic 3D render style. The bike should',
    'A sleek red sports bike parked in a narrow urban alley, realistic 3D render style. The bike should shine with',
];

const ChatFeatureSection: React.FC = () => (
    <section className="w-full flex flex-col md:flex-row items-center justify-center py-20 px-4 feature-bg">
        <div className="rounded-3xl shadow-xl p-8 md:p-8 max-w-xl w-full text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">AI Chat,</h2>
            <h3 className="text-2xl md:text-3xl font-bold text-[#ED351C] mb-6">Your Strategic Partner</h3>
            <p className="text-base md:text-lg text-white/80 mb-2 text-justify">
                Go beyond simple questions and answers. Our AI Chat is your dedicated co-founder for brainstorming business
                names, drafting marketing plans, analyzing competitors, and refining your value proposition. Whenever you’re
                stuck, your strategy partner is ready to help you find the way forward.
            </p>
        </div>

        {/* Chat Bubbles Section */}
        <div className="relative flex-1 flex flex-col items-center justify-center min-w-[340px] max-w-lg w-full mt-12 md:mt-0 md:ml-10 group/chat">
            <div className="flex flex-col gap-6 items-end w-full">
                {chatBubbles.map((text, idx) => (
                    <div key={idx} className={`relative bg-[#23272f] text-white text-sm px-6 py-4 rounded-2xl shadow-[0_4px_24px_0_rgba(59,130,246,0.25)] border border-white/10 overflow-hidden w-full ${idx === 1 ? 'ml-16 md:ml-32' : ''}`}
                        style={{
                            boxShadow: '0 4px 32px 0 rgba(59,130,246,0.25)',
                            transitionDelay: `${idx * 150}ms`,
                            ...(idx === 0 ? { marginRight: '3rem' } : {}),
                            ...(idx === chatBubbles.length - 1 ? { marginRight: '3rem' } : {}),
                        }}>
                        <div className="relative z-10 transition-all duration-700 ease-in-out filter blur-sm group-hover/chat:filter-none"
                            style={{ transitionDelay: `${idx * 150}ms` }} >
                            {text}
                        </div>

                        {/* Sliding overlay for visual wipe effect */}
                        <div className="absolute inset-0 bg-[#f0f8ff17] translate-x-0 transition-transform duration-700 ease-in-out group-hover/chat:translate-x-full"
                            style={{ transitionDelay: `${idx * 150}ms` }}></div>
                    </div>
                ))}
            </div>
            <img src="/images/chat-feature.png" alt="Ninja Chat Feature" className="absolute right-0 bottom-0 md:w-40 md:h-56 object-contain drop-shadow-2xl scale-x-[-1]"
                style={{ pointerEvents: 'none', transform: 'scaleX(-1)', zIndex: 1111 }} />
        </div>
    </section>
);

export default ChatFeatureSection;
