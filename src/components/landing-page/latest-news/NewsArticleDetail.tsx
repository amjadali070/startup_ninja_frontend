import React from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { getArticleBySlug, newsArticlesByDate } from "../../../data/newsArticles";

const NewsArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : undefined;

  if (!article) {
    return <Navigate to="/latest-news" replace />;
  }

  const related = newsArticlesByDate
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative pt-32 pb-10 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-black"></div>

        <div className="relative max-w-4xl mx-auto">
          <Link
            to="/latest-news"
            className="inline-flex items-center gap-2 text-sm mb-8 transition-colors"
            style={{ color: "#CCCCCC" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#D23621")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#CCCCCC")}
          >
            ← Back to Latest News
          </Link>

          <div
            className="text-sm font-semibold mb-3"
            style={{ color: "#D23621" }}
          >
            {article.category}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            {article.title}
          </h1>
          <div
            className="flex items-center gap-4 text-sm"
            style={{ color: "#999" }}
          >
            <span>{article.date}</span>
            <span>•</span>
            <span>{article.readTime}</span>
          </div>
        </div>
      </section>

      <section className="px-4">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg mb-10">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
            {article.body.map((paragraph, idx) => (
              <p
                key={idx}
                className="text-lg leading-relaxed"
                style={{ color: "#CCCCCC" }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-16 px-4 bg-gradient-to-b from-black via-red-900/10 to-black">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">
              More from the Dojo
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  to={`/latest-news/${item.slug}`}
                  className="group rounded-xl overflow-hidden bg-[#141010] border border-white/10 shadow-lg hover:scale-105 transition-transform duration-300"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-5">
                    <div
                      className="text-xs font-semibold mb-2"
                      style={{ color: "#D23621" }}
                    >
                      {item.category}
                    </div>
                    <h3 className="text-base font-bold leading-snug">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default NewsArticleDetail;
