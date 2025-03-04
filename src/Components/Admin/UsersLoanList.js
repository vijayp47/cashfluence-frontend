import React, { useState,useRef, useEffect } from "react";
import Header from "../Layout/Header";
import { useLocation,useNavigate } from "react-router-dom";
import UsersLoanDetail from "./UsersLoanDetail";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import Overdue from "../../assets/images/overdue.png";
import ComplianceChecklist from "./ComplianceChecklist";
import InterestRateData from "./InterestRateData";
import Loader from "../Loader";
const UsersLoanList = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;  
  const location = useLocation();
  const { user, profileData } = location.state || {};
  const [userData, setUserData] = useState(user);
  const loanData = userData?.loans || [];
  const [loanMinAmount, setLoanMinAmount] = useState(500);
  const [loanMaxAmount, setLoanMaxAmount] = useState(2000);
  const [loanStatus, setLoanStatus] = useState("All");
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showLoanDetails,setShowLoanDetails]=useState(false);
  
  const [plaidUser,setPlaidUserData]= useState(null);
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();
  // const loanData = user?.loans || []

  const userId = userData.id


  // for changing instantly we have to call these api
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/admin/user/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setUserData(data.user);
        console.log("new Api" , data.user)
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchPlaidUserData();
  }, [userId]);

  const fetchPlaidUserData = async () => {
    console.log("Fetching Plaid user data...");
  
    try {
      const token = localStorage.getItem('adminToken');
      console.log("Token:", token);
  setLoader(true);
      const response = await fetch(`${BASE_URL}/plaid/get-plaid-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: String(userId),  
        }),
      });
  
      const data = await response.json();

      console.log("data-------",data);
      
      if (data?.message == "Plaid User data retrieved successfully") {
        setPlaidUserData(data);
        setLoader(false);
        console.log("Fetched User Data:", data.user);
      } else {
        console.error("Failed to fetch Plaid user data:", data.message || "Unknown error");
      }
    } catch (error) {
      setLoader(false);
      console.error("Error fetching user data:", error);
    }
    finally{
      setLoader(false);
    }
  };
  

  const handleLoanStatusUpdate = (loanId, newStatus) => {
    const updatedLoans = filteredLoans.map((loan) =>
      loan.id === loanId ? { ...loan, status: newStatus } : loan
    );

    setUserData({ ...userData, loans: updatedLoans }); // Update userData state

    const updatedLoan = updatedLoans.find((loan) => loan.id === loanId);
  if (updatedLoan) {
    setSelectedLoan(updatedLoan);
  }
  };
  

  const filteredLoans = loanData.filter((loan) => {
    console.log("loan999999999",loan);
    
    const withinRange =
      loan.amount >= loanMinAmount && loan.amount <= loanMaxAmount;
    const matchesStatus = loanStatus === "All" || loan.status === loanStatus;
    // console.log("Transaction data in loan:", loan.transactions); 
    // const hasFineEmailSent = loan.transactions?.some(tran => tran.fine_email_sent === true)
    

    const loansWithFineEmailSent = loanData.filter(loan => 
      loan.transactions.some(transaction => transaction.fine_email_sent === true)
  );
    
    return withinRange && matchesStatus ;
  });

  const loanDetailRef = useRef(null);
 

  // Handle changes in the min range
  const handleMinChange = (e) => {
    const newMin = Math.min(e.target.value, loanMaxAmount); // Ensure min is not greater than max
    setLoanMinAmount(newMin);
  };

  // Handle changes in the max range
  const handleMaxChange = (e) => {
    const newMax = Math.max(e.target.value, loanMinAmount); // Ensure max is not less than min
    setLoanMaxAmount(newMax);
  };


  const handleBackToList = () => {
    setShowLoanDetails(false);
  
  };
  const handleLoanDetails = (loan,id) => {

    console.log("loan.....", loan)
    setShowLoanDetails(true);
    setSelectedLoan(loan);
    if (loanDetailRef.current) {
      loanDetailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  console.log("selectedLoan-------------------",selectedLoan);
  
console.log("filteredLoans888888888888888888",filteredLoans);

const hasFineEmailSent = (loan) => {
  return loan.transactions.some(transaction => transaction.fine_email_sent === true);
};



  return (
    <div className="font-sans flex flex-col min-h-screen">
      {/* Header */}
      <div ref={loanDetailRef}>
      <Header profileData={profileData}/>
      </div> 
      <div className="relative group ml-6 mt-6">
         <button onClick={()=>navigate("/admin/dashboard")} text="Back">
            <IoArrowBackCircleSharp size={40}/>
          </button>
       
         </div>
      <div className="font-sans flex flex-col md:flex-row min-h-screen bg-[#ffff]">
        {/* Sidebar for Loan Management */}
      
        <div className="font-sans border border-[#C4C4C4] md:p-5 p-3 rounded-lg md:m-6 m-5 md:w-[28%]">
        
         <div className="flex items-start justify-between">
          
         <h2 className="font-sans text-[24px] font-bold mb-4 text-left">
            Loan Management
          </h2>

         </div>
          {/* Conditional Rendering for Loan Filters or No Loans Message */}



          {loanData?.length > 3 ? <> <div className="mb-4">
                <label className="font-sans text-[16px] text-[#646464] font-bold mb-2 block">
                  Loan Amount Range: ${loanMinAmount} - ${loanMaxAmount}
                </label>
                <input
                  type="range"
                  min="500"
                  max="2000"
                  value={loanMinAmount}
                  onChange={handleMinChange}
                  className="w-full mt-2 accent-[#5EB66E]"
                />
                <input
                  type="range"
                  min="500"
                  max="2000"
                  value={loanMaxAmount}
                  onChange={handleMaxChange}
                  className="w-full mt-2 accent-[#5EB66E]"
                />
              </div>

              {/* Loan Status Filter */}
              <div className="mb-4">
                <label className="font-sans text-[16px] text-[#646464] font-bold mb-2 block">
                  Loan Status
                </label>
                <select
                  value={loanStatus}
                  onChange={(e) => setLoanStatus(e.target.value)}
                  className="font-sans w-full p-3 border rounded-md border-[#C4C4C4] focus:outline-none focus:ring-2 focus:ring-[#5EB66E]"
                >
                  <option value="All">All</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div></>: null}
          {loanData.length > 0 ? (
            <>
              {/* Loan Amount Range Filter */}
             

              {/* Loan List */}
              <div className="space-y-4">
                {filteredLoans.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((loan, index) => (
                  <div
                    key={loan.id}
                    onClick={() => handleLoanDetails(loan,loan.id)}
                    className={`${
                      selectedLoan?.id === loan?.id ? "bg-[#EFEFEF]" : "bg-white"
                    } border border-[#C4C4C4] p-5 rounded-lg shadow-md flex justify-between items-center cursor-pointer
                    md:flex-col md:items-start lg:flex-row lg:items-center`} // Column on md, Row on lg & sm
                  >
                    <div className="font-sans text-left w-[90%]">
                 

                      <h3 className="text-2xl md:text-md font-bold text-black">
                        Loan ID: {loan.id}
                      </h3>
                     
                      <p className="font-sans text-[#646464] mt-1">
                        Amount: ${loan.amount}
                      </p>
                      <p className="font-sans text-[#646464] mt-1">
                        Created At:{" "}
                        {new Date(loan.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  
                    <div className="flex flex-col items-center">
                    <>
                      {loan?.overdueStatus === "Overdue" && (
                        <img src={Overdue} alt="Past Date Due" className="w-26 h-10 mt-2"/>
                      )}
                    </>
                      <div className="w-auto md:w-full flex md:justify-start lg:justify-end mt-2 md:mt-1 lg:mt-3">
                      <span className="font-sans border-2 border-black font-bold text-black py-1 px-4 rounded-lg">
                        {loan.status}
                      </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-[#646464] font-sans text-[16px] text-center items-center">
              No loans available
            </p>
          )}
        </div>

        {/* Main Content Area */}
        <div className="font-sans w-full md:w-3/4 md:p-5 p-5">

        {/* {showLoanDetails ? (
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
         
            <h1 className="text-[32px] text-left font-bold mb-4 font-sans">
              Loan ID: {selectedLoan?.id} - {user?.firstName} {user?.lastName}
            </h1>

            <div className="flex space-x-4">
              <span className="font-sans px-10 py-3 border border-[#5EB66E] text-[#5EB66E] rounded-lg">
                Reject
              </span>
              <span className="font-sans px-10 py-3 bg-[#5EB66E] text-white rounded-lg">
                Approve
              </span>
            </div>
          </div>):null} */}

          {!showLoanDetails ? (
            <>
          
          <div className="font-sans grid grid-cols-1 lg:grid-cols-2 gap-6 mt-3">
            {/* Borrower's Profile */}
            <div className="font-sans bg-white p-5 rounded-lg shadow border text-left border-[#C4C4C4]">
            <h2 className="font-sans text-[24px] text-[#383838] font-extrabold mb-4">
              Borrower's Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 bg-[#FCFCFC] w-full p-4">
              <div className="flex flex-col">
                <span className="font-sans font-normal text-[16px] text-[#646464]">
                  Name:
                </span>
                <span className="font-sans font-semibold text-[18px] text-[#383838] break-words"
                style={{ wordBreak: "break-word", overflowWrap: "break-word" }}>
                  {user.firstName} {user.lastName}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-normal text-[16px] text-[#646464]">
                  Email:
                </span>
                <span
                  className="font-sans font-semibold text-[18px] text-[#383838] break-words"
                  style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                >
                  {user.email}
                </span>
              </div>
              <div className="flex flex-col mt-5">
              <span className="font-sans font-normal text-[16px] text-[#646464]">
                  Verified:
                </span>
                <span className="font-sans font-semibold text-[18px] text-[#383838]">
                  {plaidUser?.data?.plaid_idv_status}
                </span>
              
              </div>

              

           
            </div>
          </div>
        
            {/* Compliance Checklist */}
            <div className="bg-white p-5 rounded-lg shadow border border-[#C4C4C4]">
              <h2 className="text-[24px] font-sans text-[#383838] font-extrabold mb-4 text-left">
                Compliance Checklist 
              </h2>
              {!loader ?  <ComplianceChecklist data={plaidUser}/> : null}
             
            </div>   
          </div>
          
          
          
          </>
          ):null}

          {/* Repayment History */}
          {!showLoanDetails ? (
          <div className="font-sans grid grid-cols-1 lg:grid-cols-2 gap-6 mt-3">
              <div className=" bg-white p-5 rounded-lg  shadow border border-[#C4C4C4]">
          <h2 className="font-sans text-[24px] text-[#383838] font-extrabold mb-4 text-left">
            Loan Records 
          </h2>
        
          {loanData.length > 0 ? (
            <>
              {/* Desktop View (Hidden on Mobile) */}
              <table className="w-full text-left hidden sm:table">
                {/* Table Header */}
                <thead>
                  <tr className="text-[#E2E5E9]">
                    <th className="font-sans py-2 text-[#646464] font-normal text-[16px] w-[20%]">
                      Loan ID
                    </th>
                    <th className="font-sans py-2 text-[#646464] font-normal text-[16px] w-[25%]">
                      Loan Amount
                    </th>
                    <th className="font-sans py-2 text-[#646464] font-normal text-[16px]">
                      Loan Term
                    </th>
                    <th className="font-sans py-2 text-[#646464] font-normal text-[16px] text-right">
                      Status
                    </th>
                  </tr>
                </thead>
        
                {/* Table Body */}
                <tbody>
                  {loanData.map((loan) => (
                    <tr key={loan.id} className="border-t">
                      <td className="font-sans py-2 text-[#373D46] font-semibold text-[18px]">
                        Loan: {loan.id}
                      </td>
                      <td className="font-sans py-2 text-[#373D46] font-semibold text-[18px]">
                        ${loan.amount}
                      </td>
                      <td className="font-sans py-2 text-[#373D46] font-semibold text-[18px]">
                        {loan.repaymentTerm === 30
                          ? "1 month"
                          : loan.repaymentTerm === 60
                          ? "2 months"
                          : loan.repaymentTerm / 30 + " months"}
                      </td>
                      <td className="font-sans py-2 text-[#373D46] font-semibold text-[18px] text-right">
  <span
    className={`font-sans border-2 font-bold text-[16px] py-1 px-4 rounded-lg ${
      loan.isLoanComplete ? "bg-green-500 text-white border-green-500" : "bg-orange-400 text-white border-orange-400"
    }`}
  >
    {loan.isLoanComplete ? "Completed" : "Ongoing"}
  </span>
</td>

                    </tr>
                  ))}
                </tbody>
              </table>
        
              {/* Mobile View (Smaller Screens) */}
              <div className="block sm:hidden">
                {loanData.map((loan) => (
                  <div
                    key={loan.id}
                    className="bg-white shadow-md rounded-lg mb-4 p-4 border border-[#C4C4C4]"
                  >
                    <div className="mb-2 flex justify-between items-start">
                      <div className="font-sans text-[#373D46] text-[18px] font-semibold">
                        Loan: {loan.id}
                      </div>
                    </div>
        
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-sans text-[#646464] text-[16px]">Amount</div>
                      <div className="font-sans text-[#373D46] text-[18px] font-semibold">
                        ${loan.amount}
                      </div>
                    </div>
        
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-sans text-[#646464] text-[16px]">Term</div>
                      <div className="font-sans text-[#373D46] text-[18px] font-semibold">
                        {loan.repaymentTerm === 30
                          ? "1 month"
                          : loan.repaymentTerm === 60
                          ? "2 months"
                          : loan.repaymentTerm / 30 + " months"}
                      </div>
                    </div>
        
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-sans text-[#646464] text-[16px]">Status</div>
                      <div className="font-sans text-[#373D46] text-[18px] font-semibold">
                        <span className="font-sans border-2 border-[#242424] font-bold text-[16px] text-[#242424] py-1 px-4 rounded-lg">
                          {loan.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center text-[#646464] text-[18px] py-4">
              No loans available
            </div>
          )}
              </div>
              <div className="bg-white p-5 rounded-lg shadow border border-[#C4C4C4]">
              <h2 className="text-[24px] font-sans text-[#383838] font-extrabold mb-4 text-left">
                Influencer Data 
              </h2>
              {!loader ?  <InterestRateData userId={userId}/> : null}
             
            </div>
        </div>
        
          
          ) : (
             
            <UsersLoanDetail selectedLoan={selectedLoan} user={user} onUpdateStatus={handleLoanStatusUpdate} profileData={profileData}/>
        
  
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersLoanList;
