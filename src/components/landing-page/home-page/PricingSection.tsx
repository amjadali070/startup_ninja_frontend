import { useEffect, useState } from 'react';
import { FaCheckCircle, FaMinus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { planService, Plan } from '../../../services/plan';
import { getFeatureRowsForPlan } from '../../../utils/planFeatureRows';

export default function PricingSection() {
    const [plansData, setPlansData] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly"); 
    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await planService.getAllPlans();
                if (response.success && response.data) {
                    setPlansData(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch plans", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    const paidPlans = plansData.filter(p => p.price > 0 && p.key !== 'free' && p.name.toLowerCase() !== 'free');
    const freePlan = plansData.find(p => p.price === 0 || p.key === 'free' || p.name.toLowerCase() === 'free');

    return (
        <section className="relative w-full flex flex-col items-center justify-center py-8 md:py-16 px-4 md:px-6 mt-4 md:mt-10 overflow-hidden text-white">
            <div className="text-center mb-6 md:mb-12">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                    Choose The Perfect <br /> Plan For Your Business
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto px-4">
                    Start with our free plan and upgrade as you grow.
                </p>

                {/* Optional Toggle */}
                <div className="inline-flex items-center rounded-lg p-1 mt-4 md:mt-6 bg-[#1a0f0f] border border-white/10">
                    <button
                        onClick={() => setBillingCycle("monthly")}
                        className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${billingCycle === "monthly" ? "bg-red-600 text-white" : "text-gray-400 hover:text-white"}`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBillingCycle("annual")}
                        className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${billingCycle === "annual" ? "bg-red-600 text-white" : "text-gray-400 hover:text-white"}`}
                    >
                        Annual (Save ~20%)
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
                </div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-6 w-full max-w-7xl">
                {paidPlans.map((plan, index) => {
                    const isEnterprise = plan.key === 'custom' || plan.name.toLowerCase() === 'custom';
                    const displayPrice = billingCycle === "monthly" ? plan.price : (plan.discountPrice || plan.price);
                    const isPopular = plan.isPopular;

                    return (
                    <div
                        key={plan._id || index}
                        className={`relative rounded-2xl p-6 border ${isPopular ? "border-2 xl:scale-105 xl:-translate-y-2 shadow-2xl" : "border-red-900/30 shadow-lg"} bg-[#1a0f0f] hover:-translate-y-1 transition-transform flex flex-col`}
                        style={
                            isPopular
                                ? {
                                    background:
                                        "linear-gradient(28deg, #f5222d17 7.34%, rgb(222 5 0 / 30%) 81.6%), linear-gradient(17.32deg, rgba(0, 0, 0, 0.8) 55.8%, rgb(222 5 0 / 33%) 141.07%)",
                                    borderColor: "rgba(222, 5, 0, 0.6)",
                                }
                                : {}
                        }
                    >
                        {isPopular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <span
                                    className="px-3 py-1 rounded-full text-xs font-bold tracking-wide whitespace-nowrap"
                                    style={{ background: "linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)" }}
                                >
                                    MOST POPULAR
                                </span>
                            </div>
                        )}

                        <h3 className="text-lg font-semibold mb-3">{plan.name}</h3>

                        {isEnterprise ? (
                            <div className="flex items-end mb-3">
                                <span className="text-3xl font-bold">Custom Pricing</span>
                            </div>
                        ) : (
                            <div className="flex items-end mb-3">
                                <span className="text-3xl font-bold">${displayPrice}</span>
                                <span className="text-gray-400 text-sm ml-1 mb-0.5">
                                    {billingCycle === "monthly" ? "/monthly" : "/mo, billed yearly"}
                                </span>
                            </div>
                        )}
                        <p className="text-gray-300 text-sm mb-5 h-10">{plan.description || "Explore what's included."}</p>

                        {isEnterprise ? (
                            <Link
                                to="/contact?plan=custom"
                                className="block w-full text-center bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-md font-semibold mb-5 shadow-md hover:shadow-red-600/40 transition text-sm"
                            >
                                Contact for pricing
                            </Link>
                        ) : (
                            <Link
                                to={`/buy-subscription?plan=${plan.name}&billing=${billingCycle}`}
                                state={{ from: 'pricing' }}
                                className="block w-full text-center bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-md font-semibold mb-5 shadow-md hover:shadow-red-600/40 transition text-sm"
                            >
                                GET STARTED
                            </Link>
                        )}

                        <div className="border-t border-red-900/50 pt-5 flex-grow">
                            <p className="text-gray-400 mb-3 text-xs font-semibold uppercase tracking-wide">
                                What's included
                            </p>
                            <div className="flex flex-col gap-2.5">
                                {getFeatureRowsForPlan(plan, isEnterprise).map((row, i) => (
                                    <div key={i} className="flex items-start">
                                        {row.included ? (
                                            <FaCheckCircle className="text-red-500 w-3.5 h-3.5 mr-2 flex-shrink-0 mt-0.5" />
                                        ) : (
                                            <FaMinus className="text-gray-600 w-3 h-3 mr-2 flex-shrink-0 mt-1" />
                                        )}
                                        <span className={`text-sm leading-snug ${row.included ? "text-gray-300" : "text-gray-600"}`}>
                                            <span className="font-medium">{row.product}</span>
                                            {row.included && <span className="text-gray-400">: {row.detail}</span>}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )})}
            </div>
            )}
            
            <div className="mt-16 text-center max-w-2xl mx-auto px-6 py-8 rounded-2xl bg-gradient-to-b from-[#1a0f0f] to-transparent border border-red-900/20">
                <h3 className="text-xl font-bold mb-2 text-white">Just getting started?</h3>
                <p className="text-gray-400 mb-6">Explore the basics with our <span className="text-red-500 font-semibold">{freePlan ? freePlan.name : "Free"}</span> plan.</p>
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-400 mb-6">
                    {freePlan && freePlan.features.slice(0, 4).map((f, i) => (
                         <span key={i} className="flex items-center"><FaCheckCircle className="text-red-500/70 mr-2" /> {f}</span>
                    ))}
                </div>
                <Link to="/login" className="text-white underline decoration-red-600 underline-offset-4 hover:text-red-500 transition-colors">
                    Start for free
                </Link>
            </div>
        </section>
    );
}
