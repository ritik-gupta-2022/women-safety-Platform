import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaNewspaper } from 'react-icons/fa';
import Header from '../components/shared/Header';
import { Audio } from 'react-loader-spinner';

const NewsArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/feature/get-news'); 
        const data = await res.json();
        setArticles(data.items); 
        setLoading(false);
      } catch (err) {
        toast.error(err.message || 'Failed to load articles');
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-gray-700">
        <Audio height="100" width="100" color="#1ccee6" ariaLabel="audio-loading"  wrapperStyle={{}} wrapperClass="wrapper-class"  visible={true}/>
      </div>
    );

  return (
    <>
      <Header/>
      <div className="p-6 bg-gradient-to-r  from-blue-50 to-blue-200 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">Latest News Articles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article, index) => (
          <a
            href={article.newsUrl}
            target="_blank"
            rel="noopener noreferrer"
            key={index}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105"
          >
            <img
              src={article.images.thumbnailProxied}
              alt={article.title}
              className="w-full h-48 object-cover rounded-t-xl"
            />
            <div className="p-5">
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">{article.title}</h2>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.snippet}</p>
              <div className="text-gray-500 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <FaNewspaper className="text-blue-500" />
                  <span>{article.publisher}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FaCalendarAlt className="text-pink-500" />
                  <span>{new Date(parseInt(article.timestamp)).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
     </div>
    </>
  );
};

export default NewsArticles;
