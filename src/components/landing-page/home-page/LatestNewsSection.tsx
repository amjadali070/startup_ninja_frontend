import { Link } from "react-router-dom";
import { newsArticlesByDate } from "../../../data/newsArticles";

const newsItems = newsArticlesByDate.slice(0, 6);

export default function LatestNewsSection() {
  return (
    <section className="relative w-full flex flex-col items-center justify-center py-8 md:py-16 px-4 md:px-6 mt-4 md:mt-10 overflow-hidden text-white">
      {/* Header */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-6 md:mb-10">
        <h2 className="text-3xl md:text-4xl font-semibold">Latest news</h2>
        <Link
          to="/latest-news"
          className="text-sm text-gray-300 hover:text-red-500 transition-colors"
        >
          View all
        </Link>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
        {newsItems.map((item) => (
          <Link
            key={item.slug}
            to={`/latest-news/${item.slug}`}
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
          </Link>
        ))}
      </div>
    </section>
  );
}
