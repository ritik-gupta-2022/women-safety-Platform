import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Header from '../components/shared/Header';
import { Audio } from 'react-loader-spinner';

const DefenseTutorials = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch('/api/feature/defense-tutorials');
        const data = await res.json();

        if (res.ok) {
          console.log(data);
          setVideos(data.videos);
        } else {
          toast.error(data.message || 'Failed to fetch videos');
        }
      } catch (err) {
        toast.error(err.message || 'Failed to fetch videos');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-gray-700">
        <Audio
          height="100"
          width="100"
          color="#1ccee6"
          ariaLabel="audio-loading"
          wrapperStyle={{}}
          wrapperClass="wrapper-class"
          visible={true}
        />
      </div>
    );

  return (
    <>
      <Header/>
      <div className="p-6 bg-gradient-to-r from-indigo-100 via-blue-50 to-blue-200 min-h-screen">
        <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-800">Self-Defense Tutorials</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos?.map((video) => (
            <div
              key={video.id.videoId}
              className="bg-white rounded-lg shadow-lg overflow-hidden transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/30"
            >
              <iframe
                className="w-full aspect-video rounded-t-lg"
                src={`https://www.youtube.com/embed/${video.id.videoId}`}
                title={video.snippet.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800 line-clamp-2">{video.snippet.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">{video.snippet.description}</p>
                <p className="text-xs text-gray-500">
                  <span className="font-medium">{video.snippet.channelTitle}</span> •{' '}
                  {new Date(video.snippet.publishedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DefenseTutorials;
