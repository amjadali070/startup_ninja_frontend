import React from "react";
import { Link } from "react-router-dom";
import { newsArticlesByDate } from "../../../data/newsArticles";

const LatestNewsMain: React.FC = () => {
  const [featuredPost, ...recentPosts] = newsArticlesByDate;

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative pt-24 md:pt-32 pb-8 md:pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-black"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Latest from the <span style={{ color: "#D23621" }}>Dojo</span>
          </h1>
          <p
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
            style={{ color: "#CCCCCC" }}
          >
            Product updates, feature drops, and how-it-works guides, straight from the team building Startup Ninja.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Link
            to={`/latest-news/${featuredPost.slug}`}
            className="block rounded-2xl overflow-hidden bg-[#141010] border border-white/10 shadow-lg hover:scale-[1.02] transition-transform duration-300"
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div className="h-64 md:h-auto">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div
                  className="text-sm font-semibold mb-2"
                  style={{ color: "#D23621" }}
                >
                  {featuredPost.category}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {featuredPost.title}
                </h2>
                <p
                  className="mb-6 leading-relaxed"
                  style={{ color: "#CCCCCC" }}
                >
                  {featuredPost.excerpt}
                </p>
                <div className="text-sm" style={{ color: "#999" }}>
                  {featuredPost.date} · {featuredPost.readTime}
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-16 px-4 bg-gradient-to-b from-black via-red-900/10 to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Recent Posts</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <Link
                key={post.slug}
                to={`/latest-news/${post.slug}`}
                className="group rounded-xl overflow-hidden bg-[#141010] border border-white/10 shadow-lg hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-44 object-cover"
                />
                <div className="p-6">
                  <div
                    className="text-sm font-semibold mb-2"
                    style={{ color: "#D23621" }}
                  >
                    {post.category}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{post.title}</h3>
                  <p
                    className="mb-4 leading-relaxed"
                    style={{ color: "#CCCCCC" }}
                  >
                    {post.excerpt}
                  </p>
                  <div
                    className="flex justify-between items-center text-sm"
                    style={{ color: "#999" }}
                  >
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LatestNewsMain;
