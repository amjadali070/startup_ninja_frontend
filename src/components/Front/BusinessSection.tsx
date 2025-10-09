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
    <section className="relative w-full flex flex-col items-center justify-center py-16 px-6 mt-10 text-white overflow-hidden">
      {/* Header */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-10">
        <h2 className="text-3xl md:text-4xl font-semibold">
          Startup Ninja for business
        </h2>
        <a
          href="#"
          className="text-sm text-gray-300 hover:text-red-500 transition-colors"
        >
          View all
        </a>
      </div>

      {/* Card Row */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-[#141010] rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300"
          >
            <img
              src={card.image}
              alt={card.title}
              className="w-full object-cover aspect-[1/1]"
            />
            <div className="p-5">
              <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
              <p className="text-sm text-gray-400">{card.feature}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
