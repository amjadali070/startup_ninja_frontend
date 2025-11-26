import React from 'react';

const LatestNewsMain: React.FC = () => {
  const featuredPost = {
    title: 'Introducing Startup Ninja: Your AI Co-Founder',
    excerpt: 'Today we\'re launching Startup Ninja, the all-in-one platform that consolidates your entire startup stack into one intelligent ecosystem.',
    date: 'November 26, 2024',
    category: 'Product Launch',
    image: '/images/placeholder-news.jpg'
  };

  const recentPosts = [
    {
      title: '10 Ways AI Can Accelerate Your Startup',
      excerpt: 'Discover how artificial intelligence is transforming the way founders build and scale their businesses.',
      date: 'November 20, 2024',
      category: 'Tutorials',
      readTime: '5 min read'
    },
    {
      title: 'From Idea to Launch in 7 Days',
      excerpt: 'How one founder used Startup Ninja to go from concept to live website in just one week.',
      date: 'November 15, 2024',
      category: 'Success Stories',
      readTime: '8 min read'
    },
    {
      title: 'The Future of No-Code Development',
      excerpt: 'Why no-code tools are democratizing entrepreneurship and what it means for the future.',
      date: 'November 10, 2024',
      category: 'Industry Insights',
      readTime: '6 min read'
    },
    {
      title: 'Social Media Automation Best Practices',
      excerpt: 'Learn how to automate your social media without losing authenticity and engagement.',
      date: 'November 5, 2024',
      category: 'Tutorials',
      readTime: '7 min read'
    },
    {
      title: 'SEO Tips for New Websites',
      excerpt: 'Essential SEO strategies to help your new website get discovered on Google faster.',
      date: 'November 1, 2024',
      category: 'Tutorials',
      readTime: '10 min read'
    },
    {
      title: 'Building a Brand Identity with AI',
      excerpt: 'How to use AI image generation to create a cohesive and professional brand identity.',
      date: 'October 28, 2024',
      category: 'Tutorials',
      readTime: '9 min read'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-black"></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Latest from the <span style={{color: '#D23621'}}>Dojo</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            News, tutorials, and insights to help you build faster and smarter.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden hover:border-red-500/50 transition-all duration-300 cursor-pointer">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-800 h-64 md:h-auto flex items-center justify-center">
                <span className="text-gray-600 text-4xl">📰</span>
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="text-red-500 text-sm font-semibold mb-2">{featuredPost.category}</div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{featuredPost.title}</h2>
                <p className="text-gray-400 mb-6 leading-relaxed">{featuredPost.excerpt}</p>
                <div className="text-sm text-gray-500">{featuredPost.date}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-20 px-4 bg-gradient-to-b from-black via-red-900/10 to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Recent Posts</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post, index) => (
              <div key={index} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-red-500/50 transition-all duration-300 cursor-pointer group">
                <div className="text-red-500 text-sm font-semibold mb-2">{post.category}</div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-red-500 transition-colors">{post.title}</h3>
                <p className="text-gray-400 mb-4 leading-relaxed">{post.excerpt}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-12">
          <h2 className="text-4xl font-bold mb-6">Stay Updated</h2>
          <p className="text-xl mb-8 opacity-90">
            Get the latest news, tutorials, and tips delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-white focus:outline-none"
            />
            <button className="px-8 py-3 bg-black rounded-lg font-bold hover:bg-gray-900 transition-colors">
              SUBSCRIBE
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LatestNewsMain;
