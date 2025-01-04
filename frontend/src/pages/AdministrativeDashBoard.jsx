import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle2, Clock, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import Header from '../components/shared/Header';

const AdministrativeDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch complaints
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/complaint/all-complaints');
      const data = await response.json();
      setComplaints(data);
    } catch (error) {
      toast.error("Failed to Fetch Complaints");
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Handle status update
  const handleStatusUpdate = async (complaintId, newStatus) => {
    try {
      const response = await fetch(`/api/complaint/update-status/${complaintId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const updatedComplaint = await response.json();

      setComplaints(complaints.map(complaint =>
        complaint._id === complaintId ? updatedComplaint : complaint
      ));

      toast.success(`Complaint status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update complaint status");
      console.error('Error updating status:', error);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      Pending: { component: Clock, className: 'bg-yellow-200 text-yellow-700' },
      Reviewed: { component: AlertCircle, className: 'bg-blue-200 text-blue-700' },
      Resolved: { component: CheckCircle2, className: 'bg-green-200 text-green-700' }
    };

    const StatusIcon = styles[status].component;

    return (
      <Badge className={`${styles[status].className} gap-1 px-2 py-1 rounded-full`}>
        <StatusIcon size={14} />
        {status}
      </Badge>
    );
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesSearch = 
      complaint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (!complaint.isAnonymous && complaint.userId?.username?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className=" space-y-6">
      <Header/>
      <div className="p-1 flex gap-4 mb-6">
        <div className="flex items-center space-x-2 flex-1">
          <Search className="w-4 h-4 text-gray-500" />
          <Input 
            placeholder="Search complaints..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Reviewed">Reviewed</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredComplaints.map((complaint) => (
          <Card key={complaint._id} className="border shadow-lg rounded-lg overflow-hidden">
            <CardHeader className="flex justify-between items-center p-4 border-b bg-gray-50">
              <CardTitle className="text-lg font-medium">{formatDate(complaint.createdAt)}</CardTitle>
              {getStatusBadge(complaint.status)}
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <div className="text-sm text-gray-600">
                <strong>Location:</strong> {complaint.location}
              </div>
              <div className="text-sm text-gray-600">
                <strong>Description:</strong> {complaint.description}
              </div>
              <div className="text-sm text-gray-600">
                <strong>Complainant:</strong> 
                {complaint.isAnonymous ? (
                  <span className="text-gray-500">Anonymous</span>
                ) : (
                  <div>
                    <div>{complaint.userId?.username}</div>
                    <div className="text-xs text-gray-500">{complaint.userId?.email}</div>
                    <div className="text-xs text-gray-500">Ph: {complaint.userId?.phoneNo}</div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="p-4 border-t flex justify-end bg-gray-50">
              <Select 
                value={complaint.status} 
                onValueChange={(value) => handleStatusUpdate(complaint._id, value)}
              >
                <SelectTrigger className="w-[130px] text-sm">
                  <SelectValue placeholder="Update status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Reviewed">Reviewed</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdministrativeDashboard;
