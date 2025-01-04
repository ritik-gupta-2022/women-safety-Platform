import React from "react";
import { FiSearch } from "react-icons/fi";
import { FaPhoneAlt, FaShieldAlt, FaMapMarkedAlt, FaExclamationCircle, FaRoute } from "react-icons/fa";
import { BsFillMicFill, BsFillShieldLockFill } from "react-icons/bs";
import NavBar from "../components/shared/Navbar";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/dashboard');
  };
  return (
    <>
    <NavBar/>
    <div className="min-h-screen bg-gradient-to-r from-pink-200 to-purple-50 pt-20">
      <section className="relative flex flex-col items-center justify-center min-h-screen py-20 text-center">
        <div className="absolute inset-0 z-0 opacity-50">
          <FaPhoneAlt className="absolute md:w-32 md:h-32 w-20 h-16 text-pink-400 animate-float" style={{ top: '10%', left: '10%' }} />
          <FaShieldAlt className="absolute md:w-32 md:h-32 w-20 h-16 text-pink-400 animate-float" style={{ top: '20%', right: '20%' }} />
          <FaMapMarkedAlt className="absolute md:w-32 md:h-32 w-20 h-16 text-pink-400 animate-float" style={{ bottom: '20%', left: '20%' }} />
          <BsFillMicFill className="absolute md:w-32 md:h-32 w-20 h-16 text-pink-400 animate-float" style={{ bottom: '10%', right: '10%' }} />
        </div>

        <div className="relative z-10 space-y-4 max-w-md">
          <h1 className="md:text-5xl text-3xl font-extrabold leading-snug">
            {/* Stay Safe, Stay Protected */}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Stay Safe, Stay Protected</span>
            <br /> with <span className="tracking-wide font-normal text-pink-500 md:text-6xl text-4xl">SafeHer</span>
          </h1>
          <p className="text-lg font-light tracking-wide italic">
            Empowering women with tools to ensure their safety in every situation.
          </p>
        </div>

        <div className="relative z-10 w-full max-w-lg mt-8">
          <div className="relative flex items-center w-full p-3">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 text-lg bg-transparent border-0 border-b-2 border-gray-300 focus:border-pink-600 focus:outline-none text-gray-700"
              placeholder="Search safe routes or locations..."
            />
          </div>
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            <button onClick={handleClick} className="text-white bg-pink-500 px-3 py-1 rounded-full font-normal hover:bg-pink-700 transition-all duration-300 transform">
              Safe Routes
            </button>
            <button onClick={handleClick} className="text-white bg-pink-500 px-3 py-1 rounded-full font-normal hover:bg-pink-700 transition-all duration-300 transform">
              Safe Locations
            </button>
          </div>
        </div>

        <div className="mt-8">
      <button
        onClick={handleClick}
        className="bg-pink-500 text-white px-6 py-3 rounded-full font-semibold text-xl hover:bg-pink-700 transition duration-300"
      >
        Get Started
      </button>
    </div>
      </section>

      <hr className="border-t-2 border-gray-500 mx-auto my-10 w-1/2" />
      <section className="py-16 ">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Features You Can Trust</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20">
            <div className="flex flex-col items-center p-6 bg-white shadow-lg rounded-lg text-center">
              <FaPhoneAlt className="text-pink-500 text-4xl mb-4" />
              <h3 className="text-xl font-semibold">Fake Call Generator</h3>
              <p className="text-lg text-gray-600">Generate a fake call to escape unwanted situations.</p>
            </div>

            <div className="flex flex-col items-center p-6 bg-white shadow-lg rounded-lg text-center">
              <BsFillShieldLockFill className="text-pink-500 text-4xl mb-4" />
              <h3 className="text-xl font-semibold">SMS Alerts</h3>
              <p className="text-lg text-gray-600">Send instant alerts to emergency contacts.</p>
            </div>

            <div className="flex flex-col items-center p-6 bg-white shadow-lg rounded-lg text-center">
              <BsFillMicFill className="text-pink-500 text-4xl mb-4" />
              <h3 className="text-xl font-semibold">Speech Recognition</h3>
              <p className="text-lg text-gray-600">Activate safety features using your voice commands.</p>
            </div>

            {/* New features section */}
            <div className="flex flex-col items-center p-6 bg-white shadow-lg rounded-lg text-center">
              <FaExclamationCircle className="text-pink-500 text-4xl mb-4" />
              <h3 className="text-xl font-semibold">Complaint Reporting</h3>
              <p className="text-lg text-gray-600">Easily report incidents to the authorities for swift action.</p>
            </div>

            <div className="flex flex-col items-center p-6 bg-white shadow-lg rounded-lg text-center">
              <FaRoute className="text-pink-500 text-4xl mb-4" />
              <h3 className="text-xl font-semibold">Real-Time Location Tracking</h3>
              <p className="text-lg text-gray-600">Track your real-time location for added security during travel.</p>
            </div>

            <div className="flex flex-col items-center p-6 bg-white shadow-lg rounded-lg text-center">
              <FaShieldAlt className="text-pink-500 text-4xl mb-4" />
              <h3 className="text-xl font-semibold">Defense Tutorials</h3>
              <p className="text-lg text-gray-600">Access tutorials on self-defense techniques for personal protection.</p>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-t-2 border-gray-500 mx-auto my-10 w-1/2" />
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">What Women Are Saying</h2>
          <div className="flex flex-wrap justify-center gap-12">
            <div className="flex flex-col items-center space-y-4">
              <img
                src="https://randomuser.me/api/portraits/women/45.jpg"
                alt="Aditi Singh"
                className="w-24 h-24 rounded-full border-4 border-pink-500"
              />
              <p className="text-lg italic text-gray-600 max-w-sm">
                "SafeHer made me feel secure while traveling alone. The fake call generator was a life-saver!"
              </p>
              <h4 className="font-semibold text-gray-800">Aditi Singh, Delhi</h4>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Rohit Sharma"
                className="w-24 h-24 rounded-full border-4 border-pink-500"
              />
              <p className="text-lg italic text-gray-600 max-w-sm">
                "As a concerned brother, I feel better knowing my sister has this app to help her stay safe."
              </p>
              <h4 className="font-semibold text-gray-800">Rohit Sharma, Bangalore</h4>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-t-2 border-gray-500 mx-auto my-10 w-1/2" />
      <section className="py-16 bg-gradient-to-r from-pink-100 to-purple-50 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">Why Choose SafeHer?</h2>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="max-w-sm transition-transform transform hover:scale-105 animate-float">
              <div className="bg-white p-8 rounded-lg shadow-lg relative overflow-hidden">
                <h3 className="font-semibold text-xl text-gray-800 mb-2">Instant Alerts</h3>
                <p className="text-gray-600">
                  Send immediate alerts to your emergency contacts with just a tap or voice command.
                </p>
                <div className="absolute inset-0 opacity-50 bg-[#FFEBEE] rounded-lg"></div>
              </div>
            </div>
            <div className="max-w-sm transition-transform transform hover:scale-105 animate-float">
              <div className="bg-white p-8 rounded-lg shadow-lg relative overflow-hidden">
                <h3 className="font-semibold text-xl text-gray-800 mb-2">Voice-Activated Safety</h3>
                <p className="text-gray-600">
                  Activate safety features hands-free with our advanced speech recognition system.
                </p>
                <div className="absolute inset-0 opacity-30 bg-[#F8BBD0] rounded-lg"></div>
              </div>
            </div>
            <div className="max-w-sm transition-transform transform hover:scale-105 animate-float">
              <div className="bg-white p-8 rounded-lg shadow-lg relative overflow-hidden">
                <h3 className="font-semibold text-xl text-gray-800 mb-2">Easy-to-Use Interface</h3>
                <p className="text-gray-600">
                  Our app is designed for easy navigation, allowing quick access to emergency features.
                </p>
                <div className="absolute inset-0 opacity-30 bg-[#F48FB1] rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-[#FFEBEE] opacity-25 transform rotate-12"></div>
        <div className="absolute inset-0 bg-[#F8BBD0] opacity-25 transform -rotate-12"></div>
      </section>
    </div>
    </>
  );
}

export default Landing;
