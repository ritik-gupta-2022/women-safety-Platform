import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { HiUser, HiLockClosed } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice';
import { toast } from 'react-toastify';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';

const SignIn = () => {
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.username || !credentials.password) {
      toast.error('Please fill out all fields');
      return dispatch(signInFailure('Please fill out all fields'));
    }

    try {
      dispatch(signInStart());

      const res = await fetch('/api/auth/user-signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Welcome back ${data.name}`);
        dispatch(signInSuccess(data));
        navigate('/dashboard');
      } else {
        toast.error(data.message);
        dispatch(signInFailure(data.message));
      }
    } catch (err) {
      toast.error(err.message);
      dispatch(signInFailure(err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-50 to-pink-100 flex items-center justify-center p-4">
  <Card className="w-full max-w-md p-6 shadow-lg rounded-lg bg-white">
    <CardHeader className="text-center mb-4">
      <CardTitle className="text-3xl font-bold text-purple-600">Welcome Back!</CardTitle>
    </CardHeader>
    <CardContent>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="username" className="block text-sm font-semibold text-gray-700 flex items-center">
            <HiUser className="text-purple-500 mr-2 text-xl" />
            Username
          </Label>
          <Input
            name="username"
            value={credentials.username}
            onChange={handleChange}
            placeholder="Enter your username"
            required
            className="w-full bg-purple-50 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>

        <div>
          <Label htmlFor="password" className="block text-sm font-semibold text-gray-700 flex items-center">
            <HiLockClosed className="text-purple-500 mr-2 text-xl" />
            Password
          </Label>
          <Input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            className="w-full bg-purple-50 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-transform duration-200 transform hover:scale-105"
        >
          Sign In
        </Button>

        <p className="mt-4 text-center text-gray-600">
          Don’t have an account? <a href="/signup" className="text-purple-600 hover:underline">Sign Up</a>
        </p>
      </form>

      {/* Admin credentials box */}
      <div className="mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-700">Admin Credentials</h3>
        <p className="mt-2 text-sm text-gray-600">
          Username: <span className="font-semibold text-purple-600">Ag</span>
        </p>
        <p className="mt-2 text-sm text-gray-600">
          Password: <span className="font-semibold text-purple-600">1056</span>
        </p>
      </div>
    </CardContent>
  </Card>
</div>

  );
};

export default SignIn;
