import { useEffect, useState } from 'react';
import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { planService, Plan } from '../../../services/plan';

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
        <section className="relative w-full flex flex-col items-center justify-center py-16 px-4 md:px-6 mt-10 overflow-hidden text-white">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                    Choose The Perfect <br /> Plan For Your Business
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto px-4">
                    Start with our free plan and upgrade as you grow.
                </p>
                
                {/* Optional Toggle */}
                <div className="inline-flex items-center rounded-lg p-1 mt-6 bg-[#1a0f0f] border border-white/10">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
                {paidPlans.map((plan, index) => {
                    const isEnterprise = plan.name.toLowerCase() === 'enterprise' || plan.name.toLowerCase() === 'enterprise plan';
                    const displayPrice = billingCycle === "monthly" ? plan.price : (plan.discountPrice || plan.price);
                    const isPopular = plan.isPopular;

                    return (
                    <div
                        key={plan._id || index}
                        className={`rounded-3xl p-8 border border-red-900/30 bg-[#1a0f0f] shadow-lg hover:scale-105 transition-transform flex flex-col`}
                        style={
                            isPopular
                                ? {
                                    background:
                                        "linear-gradient(28deg, #f5222d17 7.34%, rgb(222 5 0 / 30%) 81.6%), linear-gradient(17.32deg, rgba(0, 0, 0, 0.8) 55.8%, rgb(222 5 0 / 33%) 141.07%)",
                                    borderColor: "rgba(222, 5, 0, 0.4)",
                                }
                                : {}
                        }
                    >
                        <h3 className="text-xl font-semibold mb-4">{plan.name}</h3>
                        
                        {isEnterprise ? (
                            <div className="flex items-end mb-4">
                                <span className="text-4xl font-bold">Custom Pricing</span>
                            </div>
                        ) : (
                            <div className="flex items-end mb-4">
                                <span className="text-4xl font-bold">${displayPrice}</span>
                                <span className="text-gray-400 text-lg ml-1">
                                    {billingCycle === "monthly" ? "/monthly" : "/month (billed yearly)"}
                                </span>
                            </div>
                        )}
                        <p className="text-gray-300 mb-6 h-12">{plan.description || "Unlock powerful features."}</p>

                        {isEnterprise ? (
                            <button 
                                className="block w-full text-center bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 rounded-md font-semibold mb-6 shadow-md cursor-default"
                                style={{ pointerEvents: 'none' }}
                            >
                                Contact for pricing
                            </button>
                        ) : (
                            <Link 
                                to={`/buy-subscription?plan=${plan.name}&billing=${billingCycle}`}
                                state={{ from: 'pricing' }}
                                className="block w-full text-center bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 rounded-md font-semibold mb-6 shadow-md hover:shadow-red-600/40 transition"
                            >
                                GET STARTED
                            </Link>
                        )}

                        <div className="border-t border-red-900/50 pt-6 flex-grow">
                            <p className="text-gray-300 mb-4 font-medium">
                                Plan features:
                            </p>
                            <div className="flex flex-col gap-3">
                                {isEnterprise ? (
                                    plan.features.map((feature, i) => {
                                        const featureName = feature.replace(/^[0-9,]+\s*/, '');
                                        return (
                                            <div key={i} className="flex items-start">
                                                <FaCheckCircle className="text-red-500 w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-300 text-sm leading-tight capitalize">Custom {featureName}</span>
                                            </div>
                                        );
                                    })
                                ) : (
                                    plan.features.map((feature, i) => (
                                        <div key={i} className="flex items-start">
                                            <FaCheckCircle className="text-red-500 w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-300 text-sm leading-tight">{feature}</span>
                                        </div>
                                    ))
                                )}
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
