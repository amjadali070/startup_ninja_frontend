const newsItems = [
  {
    title: "Ninja Assistant Gets Smarter with AI-Powered Workflows",
    category: "Product Update",
    date: "Oct 1, 2025",
    image: "/images/news-1.png",
  },
  {
    title: 'AI Image Generator Adds “Blood Moon Mode”',
    category: "Feature Drop",
    date: "Sep 21, 2025",
    image: "/images/news-2.png",
  },
  {
    title: "Startup Ninja x OpenAI: Elevating Creative Intelligence",
    category: "Company",
    date: "Sep 25, 2025",
    image: "/images/news-3.png",
  },
  {
    title: "Community Startup Ninja Goes Live",
    category: "Community",
    date: "Sep 18, 2025",
    image: "/images/news-4.png",
  },
  {
    title: "Web Builder 2.0 Launches with Real-Time Collaboration",
    category: "Company",
    date: "Sep 25, 2025",
    image: "/images/news-5.png",
  },
  {
    title: "Startup Ninja Crosses 1 Million Generated Projects",
    category: "Milestone",
    date: "Sep 10, 2025",
    image: "/images/news-6.png",
  },
];

export default function LatestNewsSection() {
  return (
    <section className="relative w-full flex flex-col items-center justify-center py-16 px-6 mt-10 overflow-hidden text-white">
      {/* Header */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-10">
        <h2 className="text-3xl md:text-4xl font-semibold">Latest news</h2>
        <a
          href="#"
          className="text-sm text-gray-300 hover:text-red-500 transition-colors"
        >
          View all
        </a>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
        {newsItems.map((item, index) => (
          <div
            key={index}
            className="flex bg-[#9292920A] rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 shadow-md hover:shadow-red-800/30"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-40 h-40 object-cover rounded-l-2xl aspect-[1/1]"
            />
            <div className="p-5 flex flex-col justify-center">
              <h3 className="text-lg font-semibold mb-2 leading-snug">
                {item.title}
              </h3>
              <p className="text-gray-400 text-sm">
                {item.category} <span className="ml-2">{item.date}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
