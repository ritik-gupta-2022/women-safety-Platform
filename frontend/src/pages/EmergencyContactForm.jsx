import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { updateCurrentUser } from '../redux/user/userSlice';
import { FaPhoneAlt, FaUser, FaEnvelope, FaLink } from 'react-icons/fa';
import Header from '../components/shared/Header';

const EmergencyContactForm = () => {
  const [contact, setContact] = useState({
    name: '',
    phoneNo: '',
    relationship: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const res = await fetch('/api/contact/add-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
      });
      const data = await res.json();
      if (res.status === 201) {
        dispatch(updateCurrentUser(data));
        toast.success('Emergency contact added successfully.');
        setContact({ name: '', phoneNo: '', relationship: '', email: '' });
      } else {
        toast.error(data.message || 'Failed to add emergency contact.');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to add emergency contact.');
    } finally {
      setLoading(false);
    }
  };

  return (
  <>
    <Header/>
    <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-200 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-500">Add Emergency Contact</h1>
      <div className="flex justify-center">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2 flex items-center">
                <FaUser className="w-5 h-5 text-blue-500 mr-1" />
                Name
              </label>
              <input
                type="text"
                name="name"
                value={contact.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2 flex items-center">
                <FaPhoneAlt className="w-5 h-5 text-blue-500 mr-1" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNo"
                value={contact.phoneNo}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2 flex items-center">
                <FaLink className="w-5 h-5 text-blue-500 mr-1" />
                Relationship
              </label>
              <input
                type="text"
                name="relationship"
                value={contact.relationship}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2 flex items-center">
                <FaEnvelope className="w-5 h-5 text-blue-500 mr-1" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={contact.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all"
            >
              {loading ? 'Adding...' : 'Add Contact'}
            </button>
          </form>
        </div>
      </div>
    </div>
  </>
  );
};

export default EmergencyContactForm;
