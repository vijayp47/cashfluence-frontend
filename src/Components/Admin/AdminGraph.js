import React, { useEffect, useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import {fetchUserRegistrations,getDataForLoanGraphs ,getDataForTransactionGraph} from "../../API/apiServices";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import Headers from "../Layout/Header";
import {
  updateAdminProfile,
  getAdminProfile,
  updatePassword,
} from "../../API/apiServices";
const AdminGraph = () => {
  const [profileData, setProfileData] = useState([]);
  const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState(null); // Image upload
 
    const [userRegistrationData, setUserRegistrationData] = useState([]);
    const [loanStats, setLoanStats] = useState({
      loanApplicationStatus: [],
      loanAmountData: [],
      loanCompletionData: [],
    });
    const [transactionDataj, setTransactionData] = useState({ monthlyTransactions: [], yearlyTransactions: [] });
    const transactionData = {
      monthlyTransactions: [
        { date: "2024-01-01", totalAmount: 12000 },
        { date: "2024-02-01", totalAmount: 15000 },
        { date: "2024-03-01", totalAmount: 11000 },
        { date: "2024-04-01", totalAmount: 17000 },
        { date: "2024-05-01", totalAmount: 14000 },
        { date: "2024-06-01", totalAmount: 18000 },
      ],
      yearlyTransactions: [
        { date: "2022-01-01", totalAmount: 90000 },
        { date: "2023-01-01", totalAmount: 120000 },
        { date: "2024-01-01", totalAmount: 150000 },
      ],
    };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchUserRegistrations();
        setUserRegistrationData(data);
      } catch (error) {
        console.error("Error loading user registration data:", error);
      }
    };

    loadData();
  }, []);

  const maxUsers = userRegistrationData.length > 0 
  ? Math.max(...userRegistrationData.map((item) => Number(item.users))) 
  : 100;
  console.log("userRegistrationData",userRegistrationData);




  console.log("transactionData",transactionData)

  useEffect(() => {
    const fetchTransactionStats = async () => {
      try {
        const response = await getDataForTransactionGraph();
        console.log("transaction..",response.data)
        setTransactionData(response.data);
      } catch (error) {
        console.error("Error fetching transaction stats:", error);
      }
    };

    fetchTransactionStats();
  }, []);


// loan api
  useEffect(() => {
    const fetchLoanStats = async () => {
      try {
        const response = await getDataForLoanGraphs();
        console.log("response..",response?.data)
        setLoanStats(response?.data);
      } catch (error) {
        console.error("Error fetching loan stats:", error);
      }
    };

    fetchLoanStats();
  }, []);


 
    const fetchProfileData = async () => {
      try {
        const response = await getAdminProfile();
        setProfileData(response.data);
        setFirstName(response.data.firstName);
        setLastName(response.data.lastName);
        setEmail(response.data.email);
        setImage(response.data.image); // Update image URL or handle it based on your UI design
      } catch (error) {
        toast.error("Failed to fetch profile data");
      }
    };
  
    useEffect(() => {
      fetchProfileData();
    }, []);
  // Dummy data for graphs (replace with real API data)
//   const userRegistrationData = [
//     { month: "Jan 2024", users: 50 },
//     { month: "Feb 2024", users: 80 },
//     { month: "Mar 2024", users: 120 },
//     { month: "Apr 2024", users: 150 },
//     { month: "May 2024", users: 180 },
//     { month: "Jun 2024", users: 200 },
//   ];
  

  const loanApplicationStatus = [
    { name: "Approved", value: 40 },
    { name: "Pending", value: 30 },
    { name: "Rejected", value: 20 },
  ];

  const loanAmountData = [
    { name: "Total Loan", amount: 50000 },
    { name: "Repaid Amount", amount: 20000 },
  ];

  const socialMediaUsage = [
    { platform: "YouTube", users: 50 },
    { platform: "Instagram", users: 30 },
    { platform: "TikTok", users: 20 },
  ];





  const COLORS = ["#0088FE", "#FFBB28", "#FF8042"];


  const COMPLETION_COLORS = ["#00C49F", "#FF4444"];
  


  
  return (
    <>   <Headers profileData={profileData} refreshProfile={fetchProfileData} />  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
    {/* User Registration Trend */}
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">User Registrations Over Time</h2>
      <div style={{ width: "100%", height: 400 }}>
    <h3 style={{ textAlign: "center" }}>User Registrations Over Time</h3>
    <ResponsiveContainer width="95%" height="80%">
      <LineChart data={userRegistrationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="month" />
        <YAxis tickCount={10} interval={0} domain={[0, maxUsers + 20]}  tick={{ fontSize: 12 }} />

        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
    </div>

    {/* {/ Loan Application Status /} */}
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Loan Application Status</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={loanStats?.loanApplicationStatus}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {loanStats?.loanApplicationStatus.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>

    {/* {/ Loan Completion Status /} */}
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Loan Completion Status</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={loanStats.loanCompletionData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {loanStats?.loanCompletionData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COMPLETION_COLORS[index % COMPLETION_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>

    {/* {/ Total Loan Amount vs. Repaid Amount /} */}
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Loan Amount vs. Repaid Amount</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={loanStats.loanAmountData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>

 
    {/* <div className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Social Media Accounts Linked</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={socialMediaUsage}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="platform" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="users" fill="#0088FE" />
        </BarChart>
      </ResponsiveContainer>
    </div> */}


{/* Transactions overtime */}
    <div className="p-6 bg-white shadow-lg rounded-lg">
    <h2 className="text-xl font-bold mb-4">Transactions Over Time</h2>
    <ResponsiveContainer width="100%" height={350}>
      <LineChart>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(date) => moment(date).format("MMM YYYY")}
        />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line data={transactionData.monthlyTransactions} type="monotone" dataKey="totalAmount" stroke="#0088FE" name="Monthly Transactions" />
        <Line data={transactionData.yearlyTransactions} type="monotone" dataKey="totalAmount" stroke="#FF8042" name="Yearly Transactions" />
      </LineChart>
    </ResponsiveContainer>
    </div>
     <ToastContainer position="top-center" autoClose={2000} />
  </div></>
  
  );
};

export default AdminGraph;
