import { useState } from 'react';
import { HiUser, HiLockClosed, HiMail, HiPhone, HiHome } from 'react-icons/hi';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { signUpFailure, signUpStart, signUpSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';

const SignUp = () => {
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    phoneNo: '',
    address: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userDetails.username || !userDetails.password || !userDetails.email || !userDetails.phoneNo || !userDetails.address || !userDetails.name) {
      toast.error("All fields are required");
      return dispatch(signUpFailure("All fields are required"));
    }

    try {
      dispatch(signUpStart());

      const res = await fetch('/api/auth/user-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userDetails),
      });

      const data = await res.json();

      if (data.success === false) {
        toast.error(data.message);
        return dispatch(signUpFailure(data.message));
      }

      if (res.status === 201) {
        dispatch(signUpSuccess(data));
        navigate('/signin');
        toast.success(`Account Created Successfully`);
      }
    } catch (err) {
      dispatch(signUpFailure(err.message));
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-50 to-pink-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-6 shadow-lg rounded-lg bg-white">
        <CardHeader className="text-center mb-4">
          <CardTitle className="text-3xl font-bold text-purple-600">Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Username */}
              <div>
                <Label htmlFor="username" className="block text-sm font-semibold text-gray-700 flex items-center">
                  <HiUser className="text-purple-500 mr-2 text-xl" />
                  Username
                </Label>
                <Input
                  name="username"
                  value={userDetails.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  required
                  className="w-full bg-purple-50 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>

              {/* Name */}
              <div>
                <Label htmlFor="name" className="block text-sm font-semibold text-gray-700 flex items-center">
                  <HiUser className="text-purple-500 mr-2 text-xl" />
                  Name
                </Label>
                <Input
                  name="name"
                  value={userDetails.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full bg-purple-50 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="block text-sm font-semibold text-gray-700 flex items-center">
                  <HiMail className="text-purple-500 mr-2 text-xl" />
                  Email
                </Label>
                <Input
                  type="email"
                  name="email"
                  value={userDetails.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-purple-50 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>

              {/* Phone Number */}
              <div>
                <Label htmlFor="phoneNo" className="block text-sm font-semibold text-gray-700 flex items-center">
                  <HiPhone className="text-purple-500 mr-2 text-xl" />
                  Phone Number
                </Label>
                <Input
                  type="tel"
                  name="phoneNo"
                  value={userDetails.phoneNo}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                  className="w-full bg-purple-50 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="block text-sm font-semibold text-gray-700 flex items-center">
                <HiLockClosed className="text-purple-500 mr-2 text-xl" />
                Password
              </Label>
              <Input
                type="password"
                name="password"
                value={userDetails.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full bg-purple-50 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>

            {/* Address */}
            <div>
              <Label htmlFor="address" className="block text-sm font-semibold text-gray-700 flex items-center">
                <HiHome className="text-purple-500 mr-2 text-xl" />
                Address
              </Label>
              <Input
                name="address"
                value={userDetails.address}
                onChange={handleChange}
                placeholder="Enter your address"
                required
                className="w-full bg-purple-50 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-transform duration-200 transform hover:scale-105"
            >
              Sign Up
            </Button>

            <p className="mt-4 text-center text-gray-600">
              Already have an account? <a href="/signin" className="text-purple-600 hover:underline">Sign In</a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
