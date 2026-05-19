// import { Link } from "react-router-dom";

export default function BusinessSection() {
  const cards = [
    {
      title: "Reimagining creativity with AI–powered image generation",
      feature: "AI Image Generator",
      image: "/images/business-1.jpg",
    },
    {
      title: "Empowering teams with intelligent conversation",
      feature: "AI Chat Assistant",
      image: "/images/business-2.jpg",
    },
    {
      title: "Building smarter websites — powered by AI",
      feature: "AI Web Builder",
      image: "/images/business-3.jpg",
    },
  ];

  return (
    <section className="relative w-full flex flex-col items-center justify-center py-8 md:py-16 px-4 md:px-6 mt-6 md:mt-10 text-white overflow-hidden">
      {/* Header */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-10 gap-2">
        <h2 className="text-2xl md:text-4xl font-semibold">
          Startup Ninja for business
        </h2>
        {/* <Link to="/business" className="text-xs md:text-sm text-gray-300 hover:text-red-500 transition-colors">
          View all
        </Link> */}
      </div>
      {/* Card Row */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-[#141010] rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
            <img src={card.image} alt={card.title} className="w-full object-cover aspect-[4/3] md:aspect-[1/1]" />
            <div className="p-4 md:p-5">
              <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">{card.title}</h3>
              <p className="text-xs md:text-sm text-gray-400">{card.feature}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}