import { useEffect, useState } from "react";
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from '../components/ui/alert-dialog';
import { toast } from "react-toastify";
import { FaMapMarkerAlt, FaRegCommentDots, FaUserShield } from 'react-icons/fa';
import Header from "../components/shared/Header";
import { Comment } from "react-loader-spinner";

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [complaintToDelete, setComplaintToDelete] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/complaint/get-complaints", {
          method: 'GET',
        });

        const data = await res.json();
        if (res.status === 200) {
          setComplaints(data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const confirmDelete = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/complaint/delete-complaint/${complaintToDelete}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (res.status === 200) {
        setComplaints(complaints.filter((complaint) => complaint._id !== complaintToDelete));
        setError(null);
        toast.success('Complaint deleted Successfully');
      } else {
        setError(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Failed to delete complaint", error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setComplaintToDelete(null);
      setLoading(false);
    }
  };
  
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-gray-700">
        <Comment
          visible={true}
          height="80"
          width="80"
          ariaLabel="comment-loading"
          wrapperStyle={{}}
          wrapperClass="comment-wrapper"
          color="#fff"
          backgroundColor="rgb(58 93 205)"
        />
      </div>
    );
  
  return (
  <>
  
    <Header/>
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-200 p-8">
      
      <h2 className="text-3xl font-semibold text-blue-800 mb-8">My Complaints</h2>

      {complaints.length === 0 ? (
        <div className="text-xl text-gray-500">No complaints found.</div>
      ): (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {complaints.map((complaint) => (
            <Card key={complaint._id} className="p-6 shadow-2xl bg-white rounded-xl transform transition-all hover:scale-105 hover:bg-blue-50">
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-blue-600">Complaint ID: {complaint._id}</h3>
                  <span className={`text-xs font-semibold py-1 px-3 rounded-full ${complaint.status === 'Resolved' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    {complaint.status}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-gray-600">
                  <FaMapMarkerAlt className="text-lg" />
                  <p className="text-sm">{complaint.location}</p>
                </div>

                <div className="flex items-center space-x-2 text-gray-600">
                  <FaRegCommentDots className="text-lg" />
                  <p className="text-sm">{complaint.description}</p>
                </div>

                <div className="flex items-center space-x-2 text-gray-600">
                  <FaUserShield className="text-lg" />
                  <p className="text-sm">{complaint.isAnonymous ? "Anonymous" : "Identified"}</p>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      onClick={() => setComplaintToDelete(complaint._id)}
                      className="mt-6 w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none transition-all"
                    >
                      Delete Complaint
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-lg font-semibold text-gray-800">Are you sure you want to delete this complaint?</AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-600">
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setComplaintToDelete(null)} className="text-gray-600">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={confirmDelete} className="bg-red-500 text-white hover:bg-red-600">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  </>
  );
};

export default Complaints;
