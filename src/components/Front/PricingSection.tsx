import React from "react";
import { FaCheckCircle } from "react-icons/fa";
const plans = [
    {
        title: "Basic",
        price: "$20",
        subtitle: "/monthly",
        description: "Advanced tools for growing team.",
        features: [
            "Collaborate with up to 10 teammates",
            "Collaborate with up to 10 teammates",
            "Collaborate with up to 10 teammates",
            "Collaborate with up to 10 teammates",
            "Collaborate with up to 10 teammates",
        ],
        highlighted: false,
    },
    {
        title: "Pro",
        price: "$20",
        subtitle: "/monthly",
        description: "Advanced tools for growing team.",
        features: [
            "Collaborate with up to 10 teammates",
            "Collaborate with up to 10 teammates",
            "Collaborate with up to 10 teammates",
            "Collaborate with up to 10 teammates",
            "Collaborate with up to 10 teammates",
        ],
        highlighted: true,
    },
    {
        title: "Enterprise",
        price: "Let’s Talk",
        description: "Advanced tools for growing team.",
        features: [
            "Collaborate with up to 10 teammates",
            "Collaborate with up to 10 teammates",
            "Collaborate with up to 10 teammates",
            "Collaborate with up to 10 teammates",
            "Collaborate with up to 10 teammates",
        ],
        highlighted: false,
    },
];

export default function PricingSection() {
    return (
        <section className="relative w-full flex flex-col items-center justify-center py-16 px-6 mt-10 overflow-hidden text-white">
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                    Choose The Perfect <br /> Plan For Your Business
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
                    magna aliqua. Ut enim ad minim veniam, natus error sit voluptatem
                    accusantium doloremque laudantium.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
                {plans.map((plan, index) => (
                    <div
                        key={index}
                        className={`rounded-3xl p-8 border border-red-900/30 bg-[#1a0f0f] shadow-lg hover:scale-105 transition-transform`}
                        style={
                            plan.highlighted
                                ? {
                                    background:
                                        "linear-gradient(28deg, #f5222d17 7.34%, rgb(222 5 0 / 30%) 81.6%), linear-gradient(17.32deg, rgba(0, 0, 0, 0.8) 55.8%, rgb(222 5 0 / 33%) 141.07%)",
                                    borderColor: "rgba(222, 5, 0, 0.4)",
                                }
                                : {}
                        }
                    >
                        <h3 className="text-xl font-semibold mb-4">{plan.title}</h3>
                        <div className="flex items-end mb-4">
                            <span className="text-4xl font-bold">{plan.price}</span>
                            {plan.subtitle && (
                                <span className="text-gray-400 text-lg ml-1">
                                    {plan.subtitle}
                                </span>
                            )}
                        </div>
                        <p className="text-gray-300 mb-6">{plan.description}</p>

                        <button className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 rounded-md font-semibold mb-6 shadow-md hover:shadow-red-600/40 transition">
                            OUR PROCESS
                        </button>

                        <div className="border-t border-red-900/50 pt-6">
                            <p className="text-gray-300 mb-4 font-medium">
                                All Free plan features plus
                            </p>
                            <div className="flex flex-wrap gap-x-4 gap-y-3">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-center whitespace-nowrap">
                                        <FaCheckCircle className="text-red-500 w-5 h-5 mr-1" />
                                        <span className="text-gray-300 text-sm ml-2">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
