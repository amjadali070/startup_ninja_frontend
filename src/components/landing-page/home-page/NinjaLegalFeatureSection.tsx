import React from 'react';
import { FaUserTie, FaChartPie, FaFileContract, FaShieldAlt } from 'react-icons/fa';

const NinjaLegalFeatureSection: React.FC = () => (
    <section className="w-full flex flex-col md:flex-row gap-8 items-center justify-center py-10 px-4 md:px-6 feature-bg">
        <div className="rounded-3xl shadow-xl p-6 md:p-8 max-w-xl w-full text-left">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">Ninja Legal Co-Founder</h2>
            <h3 className="text-xl md:text-3xl font-bold text-[#ED351C] mb-6">The Strategist</h3>
            <p className="text-base md:text-lg text-white/80 mb-6 text-justify">
                Navigate the complex legal landscape of building a startup with confidence. From structuring your founding team to generating compliant contracts, your AI legal strategist has you covered.
            </p>

            <ul className="space-y-4">
                <li className="flex items-center text-white/90">
                    <div className="w-10 h-10 rounded-full bg-[#ED351C]/20 flex items-center justify-center mr-4">
                        <FaUserTie className="text-[#ED351C]" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg text-[#ED351C]">Founder Structuring</h4>
                        <p className="text-sm text-white/70">Determine the right corporate structure.</p>
                    </div>
                </li>
                <li className="flex items-center text-white/90">
                    <div className="w-10 h-10 rounded-full bg-[#ED351C]/20 flex items-center justify-center mr-4">
                        <FaChartPie className="text-[#ED351C]" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg text-[#ED351C]">Equity Modelling</h4>
                        <p className="text-sm text-white/70">Plan equity distribution smartly.</p>
                    </div>
                </li>
                <li className="flex items-center text-white/90">
                    <div className="w-10 h-10 rounded-full bg-[#ED351C]/20 flex items-center justify-center mr-4">
                        <FaFileContract className="text-[#ED351C]" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg text-[#ED351C]">Contract Generation</h4>
                        <p className="text-sm text-white/70">Generate legally sound contracts instantly.</p>
                    </div>
                </li>
                <li className="flex items-center text-white/90">
                    <div className="w-10 h-10 rounded-full bg-[#ED351C]/20 flex items-center justify-center mr-4">
                        <FaShieldAlt className="text-[#ED351C]" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg text-[#ED351C]">Compliance Roadmap</h4>
                        <p className="text-sm text-white/70">Stay on top of regulatory compliance.</p>
                    </div>
                </li>
            </ul>
        </div>

        <div className="relative flex-1 flex flex-col items-center justify-center min-w-[300px] md:min-w-[340px] max-w-lg w-full mt-12 md:mt-0 md:ml-10 group/chat">
            <div className="relative drop-shadow-[0_20px_50px_rgba(237,53,28,0.3)]">
                <img src="/images/ninja-legal-banner.png" alt="Ninja Legal Feature" className="w-full h-auto rounded-3xl border border-white/10" />
                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(237,53,28,0.25)_0%,transparent_80%)] blur-2xl rounded-full -z-10"></div>
            </div>

            <img src="/images/builder-mascot.png" alt="Ninja Mascot" className="absolute right-0 bottom-0 w-24 h-36 md:w-40 md:h-56 object-contain drop-shadow-2xl scale-x-[-1]"
                style={{ pointerEvents: 'none', transform: 'scaleX(-1)', zIndex: 1111 }} />
        </div>
    </section>
);
export default NinjaLegalFeatureSection;
