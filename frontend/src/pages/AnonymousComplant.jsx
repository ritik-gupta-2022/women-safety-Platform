import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { FaRegFileAlt, FaMapMarkerAlt } from 'react-icons/fa'; // Font Awesome Icons
import { toast } from 'react-toastify';
import Header from '../components/shared/Header';

const AnonyMousComplaint = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
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

      const res = await fetch('/api/complaint/anonymous-complaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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

      {/* Complaint Form */}
      <div className="flex justify-center py-10">
        <Card className="w-full max-w-xl p-6 shadow-lg rounded-lg bg-white">
          <CardHeader className="text-center mb-4">
            <CardTitle className="text-3xl font-bold text-blue-600">Register Complaint Anonymously</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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

export default AnonyMousComplaint;
