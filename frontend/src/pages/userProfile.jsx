import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PencilIcon, SaveIcon, XIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCurrentUser } from '../redux/user/userSlice';
import { FaUserCircle, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'; // Added icons for consistency
import Header from '../components/shared/Header';
import { toast } from 'react-toastify';

const UserProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(currentUser);
  const dispatch = useDispatch();

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(currentUser);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(currentUser);
  };

  const handleSave = async () => {
    try{
      setIsEditing(false);
      updateDetails();
    } 
    catch(err){
      toast.error(err.message);
      console.error('Error updating profile:', err);
    }
  };

  const updateDetails = async()=>{
    try{
      const res = await fetch('/api/auth/update-user',{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(editedData),
      })

      const data = await res.json();

      if(res.status===200){
        dispatch(updateCurrentUser(editedData));
        toast.success("User details Updated");
      }
      else{
        // console.log(data);
        toast.error(data.message);
      }
    }
    catch(err){
      console.log(data);
      toast.error(err.message);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <Header/>
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
        {/* User Profile Header */}
        <div className="flex justify-center py-10">
          <Card className="w-full max-w-xl p-6 shadow-lg rounded-lg bg-white">
            <CardHeader className="text-center mb-4">
              <CardTitle className="text-3xl font-bold text-blue-600">User Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Username */}
                <div>
                  <Label htmlFor="username" className="flex items-center text-sm font-semibold text-gray-700">
                    <FaUserCircle className="w-5 h-5 text-blue-500 mr-1" />
                    Username
                  </Label>
                  {isEditing ? (
                    <Input
                      id="username"
                      name="username"
                      value={editedData.username}
                      onChange={handleChange}
                      className="w-full bg-blue-50"
                    />
                  ) : (
                    <p className="mt-1 p-2 bg-gray-50 rounded-md">{currentUser.username}</p>
                  )}
                </div>

                {/* Full Name */}
                <div>
                  <Label htmlFor="name" className="flex items-center text-sm font-semibold text-gray-700">
                    <FaUserCircle className="w-5 h-5 text-blue-500 mr-1" />
                    Full Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      name="name"
                      value={editedData.name}
                      onChange={handleChange}
                      className="w-full bg-blue-50"
                    />
                  ) : (
                    <p className="mt-1 p-2 bg-gray-50 rounded-md">{currentUser.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="flex items-center text-sm font-semibold text-gray-700">
                    <FaEnvelope className="w-5 h-5 text-blue-500 mr-1" />
                    Email
                  </Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={editedData.email}
                      onChange={handleChange}
                      className="w-full bg-blue-50"
                    />
                  ) : (
                    <p className="mt-1 p-2 bg-gray-50 rounded-md">{currentUser.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phoneNo" className="flex items-center text-sm font-semibold text-gray-700">
                    <FaPhone className="w-5 h-5 text-blue-500 mr-1" />
                    Phone Number
                  </Label>
                  {isEditing ? (
                    <Input
                      id="phoneNo"
                      name="phoneNo"
                      value={editedData.phoneNo}
                      onChange={handleChange}
                      className="w-full bg-blue-50"
                      maxLength={10}
                      pattern="\d{10}"
                    />
                  ) : (
                    <p className="mt-1 p-2 bg-gray-50 rounded-md">{currentUser.phoneNo}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <Label htmlFor="address" className="flex items-center text-sm font-semibold text-gray-700">
                    <FaMapMarkerAlt className="w-5 h-5 text-blue-500 mr-1" />
                    Address
                  </Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      name="address"
                      value={editedData.address}
                      onChange={handleChange}
                      className="w-full bg-blue-50"
                    />
                  ) : (
                    <p className="mt-1 p-2 bg-gray-50 rounded-md">{currentUser.address}</p>
                  )}
                </div>

                {/* Edit/Save/Cancel Buttons */}
                <div className="flex justify-center space-x-4">
                  {!isEditing ? (
                    <Button onClick={handleEdit} variant="outline" className="flex items-center gap-2">
                      <PencilIcon className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button onClick={handleSave} variant="default" className="flex items-center gap-2">
                        <SaveIcon className="h-4 w-4" />
                        Save
                      </Button>
                      <Button onClick={handleCancel} variant="outline" className="flex items-center gap-2">
                        <XIcon className="h-4 w-4" />
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
