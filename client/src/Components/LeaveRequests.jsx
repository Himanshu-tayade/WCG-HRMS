import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import moment from "moment";

const AdminLeaveRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // You can change this number

  // Fetch all leave requests
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://wcg-hrms.onrender.com/api/leave/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setRequests(data);
      console.log(data);
    } catch (err) {
      console.error("Error fetching leave requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Approve or Reject leave
  const handleAction = async (id, status) => {
    try {
      const res = await fetch(`https://wcg-hrms.onrender.com/api/leave/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update leave status");
      alert(`Leave ${status} successfully`);
      fetchRequests();
    } catch (err) {
      console.error(err);
      alert("Updating leave status successful");
    }
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = requests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(requests.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Generate page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-28">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-600" />
          Manage Leave Requests
        </h1>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead className="bg-amber-100">
                  <tr>
                    <th className="p-3 border text-left">Employee</th>
                    <th className="p-3 border text-left">Type</th>
                    <th className="p-3 border text-left">From</th>
                    <th className="p-3 border text-left">To</th>
                    <th className="p-3 border text-left">Days</th>
                    <th className="p-3 border text-left">Reason</th>
                    <th className="p-3 border text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((req) => (
                      <tr key={req._id} className="hover:bg-gray-50">
                        <td className="p-3 border">{req.user_id?.name || "N/A"}</td>
                        <td className="p-3 border capitalize">{req.leave_type}</td>
                        <td className="p-3 border">{moment(req.from_date).format("MMM DD, YYYY")}</td>
                        <td className="p-3 border">{moment(req.to_date).format("MMM DD, YYYY")}</td>
                        <td className="p-3 border">
                          {moment(req.to_date).diff(moment(req.from_date), "days") + 1}
                        </td>
                        <td className="p-3 border text-sm">{req.reason || "-"}</td>
                        <td className="p-3 border">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              req.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : req.status === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {req.status || "pending"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="p-6 text-center text-gray-500">
                        No leave requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {requests.length > 0 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, requests.length)} of {requests.length} entries
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  <div className="flex gap-1">
                    {getPageNumbers().map((number, index) => (
                      number === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-3 py-2">...</span>
                      ) : (
                        <button
                          key={number}
                          onClick={() => paginate(number)}
                          className={`px-3 py-2 border rounded-md ${
                            currentPage === number
                              ? "bg-blue-600 text-white border-blue-600"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {number}
                        </button>
                      )
                    ))}
                  </div>

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminLeaveRequests;
