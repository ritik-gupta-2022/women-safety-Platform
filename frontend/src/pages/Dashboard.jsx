import Header from '../components/shared/Header';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { HiOutlineUser, HiOutlineShieldCheck, HiOutlineMap, HiOutlineDocumentText, HiOutlineBell } from "react-icons/hi";

const Dashboard = () => {
  const navigate = useNavigate();

  const features = [
    { title: "Safe Places", icon: <HiOutlineShieldCheck />, bgColor: "bg-gradient-to-r from-blue-500 to-blue-400",url: "/safeplaces" },
    // { title: "SOS", icon: <HiOutlineMap />, bgColor: "bg-gradient-to-r from-red-500 to-red-400" },
    { title: "Add Guardian", icon: <HiOutlineUser />, bgColor: "bg-gradient-to-r from-green-500 to-green-400", url: "/addcontact" },
    { title: "View Guardian", icon: <HiOutlineUser />, bgColor: "bg-gradient-to-r from-green-500 to-green-400", url: "/getcontact" },
    { title: "Create Complaint", icon: <HiOutlineDocumentText />, bgColor: "bg-gradient-to-r from-purple-500 to-purple-400", url: "/register-complaint" },
    { title: "Anonymous Complaint", icon: <HiOutlineDocumentText />, bgColor: "bg-gradient-to-r from-red-500 to-red-400", url: "/anonymous-complaint" },
    { title: "My Complaint", icon: <HiOutlineShieldCheck />, bgColor: "bg-gradient-to-r from-purple-500 to-purple-400", url: "/show-complaints" },
    // { title: "My Profile", icon: <HiOutlineUser />, bgColor: "bg-gradient-to-r from-teal-500 to-teal-400", url: "/userdetails" },
    { title: "Crime Location Map", icon: <HiOutlineMap />, bgColor: "bg-gradient-to-r from-yellow-500 to-yellow-400", url: "/crimemap" },
    { title: "Safe Route", icon: <HiOutlineMap />, bgColor: "bg-gradient-to-r from-pink-500 to-pink-400", url: "/saferoute" },
    { title: "Self-Defense Tutorials", icon: <HiOutlineUser />, bgColor: "bg-gradient-to-r from-orange-500 to-orange-400", url: "/tutorials" },
    { title: "Recent News", icon: <HiOutlineBell />, bgColor: "bg-gradient-to-r from-indigo-500 to-indigo-400", url: "/getnews" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 ">
      <Header/>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6 px-4">
        {features.map((feature, index) => (
          <Card
            key={index}
            className={`${feature.bgColor} rounded-xl shadow-lg text-white p-6 transition-transform transform hover:scale-105 hover:shadow-2xl`}
          >
            <CardHeader className="flex items-center justify-center space-x-4">
              <div className="text-5xl">{feature.icon}</div>
            </CardHeader>
            <CardTitle className="text-lg font-bold text-center mt-4">{feature.title}</CardTitle>
            <CardContent className="mt-4 text-center">
              {feature.url && (
                <button
                  onClick={() => navigate(feature.url)}
                  className="text-sm bg-white bg-opacity-20 px-3 py-2 rounded-full transition-all duration-200 hover:bg-opacity-40"
                >
                  Go to {feature.title}
                </button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
