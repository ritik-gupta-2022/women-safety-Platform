import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaUserCircle, FaEnvelope, FaPhone, FaMapMarkerAlt, FaRegFileAlt, FaSignOutAlt } from 'react-icons/fa';
import Header from '../components/shared/Header';
import { API_URL } from '../utils/utils';

const ComplaintRegister = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    description: "",
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.location) {
      toast.error("All fields are required");
      return setError("All fields are required");
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/complaint/register-complaint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials:'include',
      });

      const data = await res.json();

      if (res.status === 201) {
        setLoading(false);
        setError(null);
        toast.success("Complaint registered Successfully");
      } else {
        setLoading(false);
        setError(data.message);
        toast.error(data.message);
      }
    } catch (err) {
      setLoading(false);
      setError(err.message);
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      <Header/>

      {/* Complaint Register Form */}
      <div className="flex justify-center py-10">
        <Card className="w-full max-w-xl p-6 shadow-lg rounded-lg bg-white">
          <CardHeader className="text-center mb-4">
            <CardTitle className="text-3xl font-bold text-blue-600">Register Complaint</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <Label htmlFor="name" className="block text-sm font-semibold text-gray-700 flex items-center">
                <FaUserCircle className="w-5 h-5 text-blue-500 mr-1" />
                Name
              </Label>
              <Input
                type="text"
                value={currentUser.name}
                className="w-full bg-blue-50"
                disabled
              />

              {/* Email */}
              <Label htmlFor="email" className="block text-sm font-semibold text-gray-700 flex items-center">
                <FaEnvelope className="w-5 h-5 text-blue-500 mr-1" />
                Email
              </Label>
              <Input
                type="email"
                value={currentUser.email}
                className="w-full bg-blue-50"
                disabled
              />

              {/* Phone */}
              <Label htmlFor="phone" className="block text-sm font-semibold text-gray-700 flex items-center">
                <FaPhone className="w-5 h-5 text-blue-500 mr-1" />
                Phone No.
              </Label>
              <Input
                type="number"
                value={currentUser.phoneNo}
                className="w-full bg-blue-50"
                disabled
              />

              {/* Description */}
              <Label htmlFor="description" className="block text-sm font-semibold text-gray-700 flex items-center">
                <FaRegFileAlt className="w-5 h-5 text-blue-500 mr-1" />
                Description
              </Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full h-20 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Describe your complaint"
                required
              />

              {/* Location */}
              <Label htmlFor="location" className="block text-sm font-semibold text-gray-700 flex items-center">
                <FaMapMarkerAlt className="w-5 h-5 text-blue-500 mr-1" />
                Location
              </Label>
              <Input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-blue-50 p-2 border border-gray-300 rounded-lg"
                placeholder="Enter location"
                required
              />

              {/* Submit Button */}
              <Button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
                Submit Complaint
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComplaintRegister;