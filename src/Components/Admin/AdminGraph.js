import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  fetchUserRegistrations,
  getDataForLoanGraphs,
  getDataForTransactionGraph,
} from "../../API/apiServices";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import Headers from "../Layout/Header";
import { getAdminProfile } from "../../API/apiServices";

const AdminGraph = () => {
  const [profileData, setProfileData] = useState([]);
  const [userRegistrationData, setUserRegistrationData] = useState([]);
  const [loanStats, setLoanStats] = useState({
    loanApplicationStatus: [],
    loanAmountData: [],
    loanCompletionData: [],
  });
  const [transactionData, setTransactionData] = useState({
    monthlyTransactions: [],
    yearlyTransactions: [],
  });

  useEffect(() => {
    const loadUserRegistrations = async () => {
      try {
        const data = await fetchUserRegistrations();
        setUserRegistrationData(data);
      } catch (error) {
        console.error("Error loading user registration data:", error);
      }
    };

    const fetchTransactionStats = async () => {
      try {
        const response = await getDataForTransactionGraph();
        setTransactionData(response.data);
      } catch (error) {
        console.error("Error fetching transaction stats:", error);
      }
    };

    const fetchLoanStats = async () => {
      try {
        const response = await getDataForLoanGraphs();
        setLoanStats(response?.data);
      } catch (error) {
        console.error("Error fetching loan stats:", error);
      }
    };

    loadUserRegistrations();
    fetchTransactionStats();
    fetchLoanStats();
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await getAdminProfile();
        setProfileData(response.data);
      } catch (error) {
        toast.error("Failed to fetch profile data");
      }
    };
    fetchProfileData();
  }, []);

  const COLORS = ["#0088FE", "#FFBB28", "#FF8042"];
  const COMPLETION_COLORS = ["#00C49F", "#FF4444"];

  return (
    <>
      <Headers profileData={profileData} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">

        {/* User Registration Trend */}
        <div className="p-4 bg-white shadow-lg rounded-lg">
          <h2 className="text-xl font-bold mb-4">User Registrations Over Time</h2>
          {userRegistrationData?.length === 0 ? (
            <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 text-lg font-medium">No Data Found</p>
          </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userRegistrationData}>
                <XAxis dataKey="month" />
                <YAxis domain={[
        userRegistrationData?.length > 0 
          ? Math.min(...userRegistrationData?.map(d => d.users)) - 5 
          : 0, 
        userRegistrationData?.length > 0 
          ? Math.max(...userRegistrationData?.map(d => d.users)) + 5 
          : 10
      ]}/>
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Loan Application Status */}
        <div className="p-4 bg-white shadow-lg rounded-lg">
          <h2 className="text-xl font-bold mb-4">Loan Application Status</h2>
          {loanStats?.loanApplicationStatus?.length === 0 ? (
            <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 text-lg font-medium">No Data Found</p>
          </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={loanStats.loanApplicationStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {loanStats?.loanApplicationStatus?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS?.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Loan Completion Status */}
        <div className="p-4 bg-white shadow-lg rounded-lg">
          <h2 className="text-xl font-bold mb-4">Loan Completion Status</h2>
          {loanStats?.loanCompletionData?.length === 0 ? (
           <div className="flex items-center justify-center h-64">
           <p className="text-gray-500 text-lg font-medium">Loan Completion Data Found</p>
         </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={loanStats.loanCompletionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {loanStats?.loanCompletionData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COMPLETION_COLORS[index % COMPLETION_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Total Loan Amount vs. Repaid Amount */}
        <div className="p-4 bg-white shadow-lg rounded-lg">
          <h2 className="text-xl font-bold mb-4">Loan Amount vs. Repaid Amount</h2>
          {loanStats?.loanAmountData?.length === 0 ? (
           <div className="flex items-center justify-center h-64">
           <p className="text-gray-500 text-lg font-medium">No Data Found</p>
         </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={loanStats.loanAmountData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Transactions Over Time */}
        <div className="p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-xl font-bold mb-4">Transactions Over Time</h2>
          {transactionData?.monthlyTransactions?.length === 0 && transactionData?.yearlyTransactions?.length === 0 ? (
           <div className="flex items-center justify-center h-64">
           <p className="text-gray-500 text-lg font-medium">Transaction Data Found</p>
         </div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(date) => moment(date).format("MMM YYYY")} />
                <YAxis />
                <Tooltip />
                <Legend />
                {transactionData?.monthlyTransactions?.length > 0 && (
                  <Line data={transactionData?.monthlyTransactions} type="monotone" dataKey="totalAmount" stroke="#0088FE" name="Monthly Transactions" />
                )}
                {transactionData?.yearlyTransactions?.length > 0 && (
                  <Line data={transactionData?.yearlyTransactions} type="monotone" dataKey="totalAmount" stroke="#FF8042" name="Yearly Transactions" />
                )}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <ToastContainer position="top-center" autoClose={2000} />
      </div>
    </>
  );
};

export default AdminGraph;
