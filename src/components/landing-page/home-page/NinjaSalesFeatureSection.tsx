import React from 'react';
import { FaUsers, FaSearchDollar, FaFileInvoiceDollar, FaReplyAll } from 'react-icons/fa';

const NinjaSalesFeatureSection: React.FC = () => (
    <section className="w-full flex flex-col md:flex-row-reverse gap-8 items-center justify-center py-10 px-4 md:px-6 feature-bg">
        <div className="rounded-3xl shadow-xl p-6 md:p-8 max-w-xl w-full text-left">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">Ninja Sales</h2>
            <h3 className="text-xl md:text-3xl font-bold text-[#ED351C] mb-6">Your Collaborative Revenue Engine</h3>
            <p className="text-base md:text-lg text-white/80 mb-6 text-justify">
                Supercharge your sales pipeline with team-driven workflows. Track leads, craft proposals, automate follow-ups, and close deals faster all from one powerful dashboard.
            </p>

            <ul className="space-y-4">
                <li className="flex items-center text-white/90">
                    <div className="w-10 h-10 rounded-full bg-[#ED351C]/20 flex items-center justify-center mr-4">
                        <FaUsers className="text-[#ED351C]" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg text-[#ED351C]">Team Sales Pipeline</h4>
                        <p className="text-sm text-white/70">Collaborate with your team seamlessly.</p>
                    </div>
                </li>
                <li className="flex items-center text-white/90">
                    <div className="w-10 h-10 rounded-full bg-[#ED351C]/20 flex items-center justify-center mr-4">
                        <FaSearchDollar className="text-[#ED351C]" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg text-[#ED351C]">Lead Tracking</h4>
                        <p className="text-sm text-white/70">Score and prioritize leads effectively.</p>
                    </div>
                </li>
                <li className="flex items-center text-white/90">
                    <div className="w-10 h-10 rounded-full bg-[#ED351C]/20 flex items-center justify-center mr-4">
                        <FaFileInvoiceDollar className="text-[#ED351C]" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg text-[#ED351C]">Proposal Creation</h4>
                        <p className="text-sm text-white/70">Build and send stunning proposals.</p>
                    </div>
                </li>
                <li className="flex items-center text-white/90">
                    <div className="w-10 h-10 rounded-full bg-[#ED351C]/20 flex items-center justify-center mr-4">
                        <FaReplyAll className="text-[#ED351C]" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg text-[#ED351C]">Automated Follow-ups</h4>
                        <p className="text-sm text-white/70">Never miss a follow-up opportunity.</p>
                    </div>
                </li>
            </ul>
        </div>

        <div className="relative flex-1 flex flex-col items-center justify-center min-w-[300px] md:min-w-[340px] max-w-lg w-full mt-12 md:mt-0 md:mr-10 group/chat">
            <div className="relative drop-shadow-[0_20px_50px_rgba(237,53,28,0.3)]">
                <img src="/images/ninja-sales-banner.png" alt="Ninja Sales Feature" className="w-full h-auto rounded-3xl border border-white/10" />
                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(237,53,28,0.25)_0%,transparent_80%)] blur-2xl rounded-full -z-10"></div>
            </div>

            <img src="/images/chat-feature.png" alt="Ninja Mascot" className="absolute -left-4 md:-left-8 bottom-0 w-24 h-36 md:w-40 md:h-56 object-contain drop-shadow-2xl"
                style={{ pointerEvents: 'none', zIndex: 1111 }} />
        </div>
    </section>
);
export default NinjaSalesFeatureSection;
