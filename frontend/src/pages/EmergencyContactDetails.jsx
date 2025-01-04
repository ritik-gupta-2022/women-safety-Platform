import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { updateCurrentUser } from '../redux/user/userSlice';
import { FaPhoneAlt, FaEnvelope, FaLink, FaTrashAlt } from 'react-icons/fa';
import Header from '../components/shared/Header';

const EmergencyContactDetails = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const res = await fetch('api/contact/get-contacts');
        const data = await res.json();
        if (res.status === 200) {
          setContacts(data);
        } else {
          toast.error(data.message || 'Failed to fetch emergency contacts');
        }
      } catch (err) {
        toast.error(err.message || 'Failed to fetch emergency contacts');
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`api/contact/delete-contact/${id}/${currentUser._id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.status === 200) {
        toast.success('Contact deleted successfully');
        setContacts((prevContacts) => prevContacts.filter((contact) => contact.id !== id));
        dispatch(updateCurrentUser(data));
      } else {
        toast.error(data.message || 'Failed to delete emergency contact');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete emergency contact');
    }
  };

  if (loading) return <p className="text-center text-xl">Loading contacts...</p>;

  return (
    <>
      <Header/>
      <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-200 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Emergency Contacts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="bg-white p-6 rounded-lg shadow-xl transition-transform transform hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">{contact.name}</h2>
              <button
                onClick={() => handleDelete(contact.id)}
                className="text-red-500 hover:text-red-600 transition-colors"
              >
                <FaTrashAlt size={20} />
              </button>
            </div>
            <div className="flex items-center text-gray-600 mb-3">
              <FaPhoneAlt className="mr-2 text-blue-500" />
              <span>{contact.phoneNo}</span>
            </div>
            <div className="flex items-center text-gray-600 mb-3">
              <FaLink className="mr-2 text-green-500" />
              <span>{contact.relationship}</span>
            </div>
            <div className="flex items-center text-gray-600 mb-4">
              <FaEnvelope className="mr-2 text-yellow-500" />
              <span>{contact.email}</span>
            </div>
          </div>
        ))}
      </div>
     </div>
    </>
  );
};

export default EmergencyContactDetails;
