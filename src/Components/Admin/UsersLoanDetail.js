import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { updateStatusAdmin,createCustomerPayout ,fetchPlaidProcessToken,fetchIdentityDataByAccountId} from "../../API/apiServices";
import HighRisk from "../../assets/images/HighRisk.svg";
import LowRisk from "../../assets/images/LowRisk.svg";
import NormalRisk from "../../assets/images/NormalRisk.svg";
import { ToastContainer, toast } from "react-toastify";
const UsersLoanDetail = ({
  selectedLoan,
  user,
  profileData,
  onUpdateStatus,
}) => {
  const location = useLocation();
  const [transactionId, setTransactionId] = useState("");
  const [approvalDate] = useState(new Date().toLocaleDateString());
  const [showLoanDetails, setShowLoanDetails] = useState(false);

  const [repayments, setRepayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalAmountToPay, setTotalAmountToPay] = useState(0);
  const [totalAmountPaid, setTotalAmountPaid] = useState(0);
  const [amountPending, setAmountPending] = useState(0);


  const [processToken, setProcessToken] = useState(null);

  useEffect(() => {

    const getToken = async () => {
      try {
    const plaidToken = await fetchPlaidProcessToken(user?.id);
        setProcessToken(plaidToken);
      } catch (err) {
        setError(err.message);
      }
    };

     getToken();
  }, [user]);


  useEffect(() => {
    if (!selectedLoan?.id || !user?.id) return;
    setError("");
    const fetchRepayments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/stripe/repayment-transactions?user_id=${user.id}&loan_id=${selectedLoan.id}`
        );
      
        
        if (response.data.success) {
          setRepayments(response.data.data);
        } else {
          setRepayments([]);
          setError("Failed to fetch repayment data");
        }
      } catch (err) {
        console.log("err.response?.data?.message", err.response?.data?.message);
        setRepayments([]);
        setError(err.response?.data?.message || "Error fetching repayment transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchRepayments();
  }, [selectedLoan, user]);


  useEffect(() => {
    // Only run this if the loan data is available
    if (selectedLoan?.amount && selectedLoan?.interest) {
      const totalAmount = selectedLoan.amount * (1 + selectedLoan.interest / 100);
      setTotalAmountToPay(totalAmount);

      // Calculate total paid from repayments data
      const paidAmount = repayments?.length
        ? repayments?.filter((repayment) => repayment.status === "completed")
          .reduce((sum, repayment) => sum + parseFloat(repayment.amount), 0)
        : 0;

      setTotalAmountPaid(paidAmount);

      // Calculate pending amount
      const pendingAmount = (totalAmount).toFixed(2) - paidAmount;

    
      
      setAmountPending(pendingAmount);

      // If amountPending is 0, mark the loan as complete by updating the status
      if (pendingAmount === 0) {
        // Send the request to update the loan status
        axios.post(`http://localhost:3000/api/loans/loanstatus/${selectedLoan?.id}`, { isLoanComplete: true })
          .then(response => {
            console.log('Loan status updated:', response.data);
          })
          .catch(err => {
            setError('Failed to update loan status');
            console.error(err);
          });
      }
      else if (pendingAmount !== 0) {
        // Send the request to update the loan status
        axios.post(`http://localhost:3000/api/loans/loanstatus/${selectedLoan?.id}`, { isLoanComplete: false })
          .then(response => {
            console.log('Loan status updated:', response.data);
          })
          .catch(err => {
            setError('Failed to update loan status');
            console.error(err);
          });
      }
    }
  }, [selectedLoan, repayments]); // Re-run when repayments or selectedLoan changes

 const [identityData, setIdentityData] = useState(null);
  
  useEffect(() => {
   const Id = selectedLoan?.fromAccount?.accountId ;
  // const Id = "ywz7LNMWJVFZk7AWxr74fGoZwgnNPQi4X5ynj";
    const loadIdentityData = async () => {
      try {
        const data = await fetchIdentityDataByAccountId(Id);
        setIdentityData(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (selectedLoan) {
      loadIdentityData();
    }
  }, [selectedLoan]);

console.log("identityData",identityData);


  const handleStatusChange = async (loanId, status) => {
    if (status === "Approved") {
      const result = await Swal.fire({
        title: "Approval Form",
        
        html: `
          <div style="text-align: left; font-family: Arial, sans-serif;">
            <div style="margin-bottom: 15px;">
              <label for="userName" style="font-weight: bold; color: #4e4e4e;">User Name:</label>
              <input placeholder="Enter Transaction Id" type="text" id="userName" value="${user?.firstName + " " + user?.lastName
          }" readonly 
                style="width: 100%; padding: 10px; font-size: 14px; border: 1px solid #ccc; border-radius: 5px; background-color: #f7f7f7;"/>
            </div>
            <div style="margin-bottom: 15px;">
              <label for="transactionId" style="font-weight: bold; color: #4e4e4e;">Transaction ID:</label>
              <input type="text" id="transactionId" oninput="this.value = this.value.replace(/[^a-zA-Z0-9]/g, '')" 
                style="width: 100%; padding: 10px; font-size: 14px; border: 1px solid #ccc; border-radius: 5px;"/>
            </div>
            <div style="margin-bottom: 15px;">
              <label for="amount" style="font-weight: bold; color: #4e4e4e;">Amount:</label>
              <input type="text" id="amount" value="${selectedLoan?.amount
          }" readonly 
                style="width: 100%; padding: 10px; font-size: 14px; border: 1px solid #ccc; border-radius: 5px; background-color: #f7f7f7;"/>
            </div>
            <div style="margin-bottom: 15px;">
              <label for="approvalDate" style="font-weight: bold; color: #4e4e4e;">Approval Date:</label>
              <input type="date" id="approvalDate" style="width: 100%; padding: 10px; font-size: 14px; border: 1px solid #ccc; border-radius: 5px;"/>
            </div>
          </div>
        `,
        showCancelButton: true,
        
        confirmButtonText: `Approve`,
        cancelButtonText: "Cancel",
        focusConfirm: false,
        allowOutsideClick: false,
        didOpen: () => {
          // Pre-fill the approval date with today's date
          const approvalDateInput = document.getElementById("approvalDate");
          const currentDate = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
          approvalDateInput.value = currentDate; // Set the value to the input
        },
        preConfirm: async () => {
           const confirmBtn = Swal.getConfirmButton();
  confirmBtn.disabled = true;
  confirmBtn.innerHTML = `<i class="fa fa-spinner fa-spin"></i> Approving...`;
          const transactionIdInput =
            document.getElementById("transactionId").value;
          const approvalDate = document.getElementById("approvalDate").value;

          // Validation: Ensure both fields are filled
          if (!transactionIdInput) {
           confirmBtn.disabled = false;
            Swal.showValidationMessage("Please enter the Transaction ID");
            return false;
          }
          if (!approvalDate) {
               confirmBtn.innerHTML = `Approve`;
            Swal.showValidationMessage("Please enter the Approval Date.");
            return false;
          }

          const selectedDate = new Date(approvalDate);
          const currentDate = new Date();
          // Reset time for the currentDate to 00:00:00
          currentDate.setHours(0, 0, 0, 0);

          // Ensure the approval date is not in the past
          if (selectedDate < currentDate) {
            confirmBtn.disabled = false;
    confirmBtn.innerHTML = `Approve`;
            Swal.showValidationMessage("Approval Date cannot be in the past.");
            return false;
          }

            try {
        
        await createCustomerPayout({
          name: identityData?.name,
          email: identityData?.email,
          phone:`+${identityData?.phone_number}`,
          ip_address: user?.ipAddress || "127.0.0.1",
          plaid_token: processToken,
        
          amount: parseInt(selectedLoan?.amount, 10),
          description: "Loan disbursement",
          payment_date: approvalDate,
          external_id: `loan_${loanId}`,
        });

      } catch (payoutErr) {
         confirmBtn.disabled = false;
    confirmBtn.innerHTML = `Approve`;
        console.error("Payout Error:", payoutErr);
        Swal.close();
        toast.error(payoutErr?.message || "Failed to create payout.");
        return; // STOP further execution if payout fails
      }

          return { transactionIdInput, approvalDate }; // Return values to be used later
        },
        icon: "info",
        customClass: {
          popup: "swal-wide",
        },
      });

      if (result.isConfirmed) {
        const { transactionIdInput, approvalDate } = result.value;

        Swal.fire({
          title: "Processing...",
          text: "Please wait while we process your request.",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
          icon: "info",
        });

        try {
          await updateStatusAdmin({
            loanId,
            userId: user?.id,
            status,
            adminName: profileData?.firstName + " " + profileData?.lastName,
            adminEmail: profileData?.email,
            userEmail: user?.email,
            transactionId: transactionIdInput,
            userName: user?.firstName + " " + user?.lastName,
            loanAmount: selectedLoan?.amount,
            approvalDate,
            interestRate: selectedLoan?.interest,

            months: Math.ceil(selectedLoan?.repaymentTerm / 30),
          });
          onUpdateStatus(loanId, "Approved");
          Swal.fire({
            title: `${status}!`,
            text: `The loan has been ${status.toLowerCase()}ed successfully.`,
            icon: "success",
            confirmButtonText: "Ok",
          });
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: `Failed to ${status.toLowerCase()} the loan.`,
            icon: "error",
            confirmButtonText: "Retry",
          });
        }
      }
    } else {
      const result = await Swal.fire({
        title: `Are you sure you want to ${status.toLowerCase()} this loan?`,
        showCancelButton: true,
        confirmButtonText: `Yes, ${status.toLowerCase()} it!`,
        cancelButtonText: "No, cancel!",
        allowOutsideClick: false,
        icon: "warning",
      });

      if (result.isConfirmed) {
        Swal.fire({
          title: "Processing...",
          text: "Please wait while we process your request.",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
          icon: "info",
        });


   
   
        try {
          await updateStatusAdmin({
            loanId,
            userId: user?.id,
            status,
            adminName: profileData?.firstName + " " + profileData?.lastName,
            adminEmail: profileData?.email,
            userEmail: user?.email,
          });
          onUpdateStatus(loanId, "Rejected");
          Swal.fire({
            title: `${status}!`,
            text: `The loan has been ${status.toLowerCase()}ed.`,
            icon: "success",
            confirmButtonText: "Ok",
          });
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: `Failed to ${status.toLowerCase()} the loan.`,
            icon: "error",
            confirmButtonText: "Retry",
          });
        }
      }
    }
  };



  return (
    <div className="font-sans flex flex-col min-h-screen">
      <div className="font-sans flex flex-col md:flex-row min-h-screen bg-[#ffff]">
        {/* Main Content Area */}
        <div className="font-sans w-full md:w-[95%] md:p-2 p-2">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            {/* Loan ID */}
            <h1 className="text-[32px] text-left font-bold font-sans md:w-1/3">
              Loan ID: {selectedLoan?.id}
            </h1>

            {/* Right side: Buttons and Risk Image */}
            <div
              className={`flex flex-col md:flex-row md:items-center ${selectedLoan?.status === "Pending" ? "md:w-[47%]" : "md:w-[15%]"
                }`}
            >
              {/* Risk Image */}
              {selectedLoan?.riskLevel === "High" ? (
                <img
                  src={HighRisk} // Replace with your actual image path
                  alt="High Risk"
                  style={{ width: "7rem", height: "10rem", marginTop: "2rem" }} // Adjust size as needed
                />
              ) : selectedLoan?.riskLevel === "Low" ? (
                <img
                  src={LowRisk} // Replace with your actual image path
                  alt="Low Risk"
                  style={{ width: "7rem", height: "10rem", marginTop: "2rem" }} // Adjust size as needed
                />
              ) : selectedLoan?.riskLevel === "Medium" ? (
                <img
                  src={NormalRisk} // Replace with your actual image path
                  alt="Normal Risk"
                  style={{ width: "7rem", height: "10rem", marginTop: "2rem" }} // Adjust size as needed
                />
              ) : null}
              {selectedLoan?.status === "Pending" ? (
                <div className="flex space-x-4 mb-4 md:mb-0 ml-10">
                  <span
                    className="font-sans px-10 py-3 border border-[#c6131b] text-[#c6131b] rounded-lg cursor-pointer"
                    onClick={() =>
                      handleStatusChange(selectedLoan?.id, "Rejected")
                    }
                  >
                    Reject
                  </span>
                  <span
                    className="font-sans px-10 py-3 bg-[#5EB66E] text-white rounded-lg cursor-pointer"
                    onClick={() =>
                      handleStatusChange(selectedLoan?.id, "Approved")
                    }
                  >
                    Approve
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="font-sans grid grid-cols-1 lg:grid-cols-2 gap-6 ">
            {/* Bank Information */}
            <div className="font-sans bg-white p-6 rounded-lg shadow border text-left border-[#C4C4C4]">
              <h2 className="font-sans text-[24px] text-[#383838] font-extrabold mb-4">
                Bank Information
              </h2>

              <div className="bg-[#FCFCFC] w-full p-4 mb-4 rounded-lg">
                {/* From Account Section */}
                <h3 className="font-sans text-[18px] text-[#383838] font-bold mb-4">
                  Loan Disbursement Account Details:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Institution Name:", value: selectedLoan?.fromAccount?.institutionName || "N/A" },
                    { label: "Account Name:", value: selectedLoan?.fromAccount?.accountName || "N/A" },
                    { label: "Account Type:", value: selectedLoan?.fromAccount?.accountType || "N/A" },
                    { label: "Account Subtype:", value: selectedLoan?.fromAccount?.accountSubtype || "N/A" },
                    { label: "Institution ID:", value: selectedLoan?.fromAccount?.institutionId || "N/A" },
                    { label: "Account Number:", value: selectedLoan?.fromAccount?.accountNumber || "N/A" }
                  ].map((item, index) => (
                    <div key={index} className="flex flex-row sm:flex-col justify-between sm:justify-start">
                      <span className="font-sans font-normal text-[16px] text-[#646464]">
                        {item.label}
                      </span>
                      <span className="font-sans font-semibold text-[18px] text-[#383838] break-words ml-3 sm:ml-0">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>        

            {/* Amount detail */}
            <div className="bg-white p-6 rounded-lg shadow border border-[#C4C4C4]">
              <h2 className="text-[24px] font-sans text-[#383838] font-extrabold mb-4 text-left">
                Amount Details
              </h2>
              <div className="space-y-4 w-full">
                <div className="flex justify-between">
                 <span className="font-sans font-normal text-[16px] text-[#646464]">
  {selectedLoan?.fee != null
    ? `Loan Amount including Fee $${Number(selectedLoan.fee)}`
    : `Loan Amount`}
</span>
                  <span className="px-5 py-1 font-sans border-2 font-bold rounded-lg text-[#242424] border-[#242424]">
                    ${selectedLoan?.amount || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-sans font-normal text-[16px] text-[#646464]">
                    Interest Rate
                  </span>
                  <span className="font-sans px-5 py-1 border-2 font-bold rounded-lg text-[#242424] border-[#242424]">
                    {selectedLoan?.interest
                      ? `${selectedLoan?.interest}%`
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-sans font-normal text-[16px] text-[#646464]">
                    Total Amount To Pay
                  </span>
                  <span className="font-sans px-5 py-1 border-2 font-bold rounded-lg text-[#242424] border-[#242424]">
                    ${totalAmountToPay.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-sans font-normal text-[16px] text-[#646464]">
                    Amount Paid
                  </span>
                  <span className="font-sans px-5 py-1 border-2 font-bold rounded-lg text-[#242424] border-[#242424]">
                    ${totalAmountPaid.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-sans font-normal text-[16px] text-[#646464]">
                    Amount Pending
                  </span>
                  <span className="font-sans px-5 py-1 border-2 font-bold rounded-lg text-[#242424] border-[#242424]">
                    ${amountPending.toFixed(2)}
                  </span>
                </div>
            
                <div className="flex justify-between">
                  <span className="font-sans font-normal text-[16px] text-[#646464]">
                    Due Date
                  </span>
                  <span className="font-sans px-5 py-1 border-2 font-bold rounded-lg text-[#242424] border-[#242424]">
                    {new Date(selectedLoan?.dueDate).toLocaleDateString() ||
                      "N/A"}
                  </span>
                </div>
                {/* <div className="flex justify-between">
                  <span className="font-sans font-normal text-[16px] text-[#646464]">
                    Payment Deduction Date
                  </span>
                  <span className="font-sans px-5 py-1 border-2 font-bold rounded-lg text-[#242424] border-[#242424]">
                    {selectedLoan?.deductionDate
                      ? new Date(
                        selectedLoan?.deductionDate
                      ).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div> */}
              </div>
            </div>
          </div>
          <div className="mt-6 bg-white p-6 rounded-lg w-full lg:w-[55%] shadow border border-[#C4C4C4] ">
            <h2 className="font-sans text-[24px] text-[#383838] font-extrabold mb-4 text-left">
              Repayment History
            </h2>

            <table className="w-full text-left">

              {error ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20vh' }}>
                <h1 style={{ color: 'red', textAlign: 'center' }}>
                  {error}
                </h1>
              </div> : <><thead>
                <tr className="text-[#E2E5E9]">
                  <th className="font-sans py-2 text-[#646464] font-normal text-[16px] w-[25%]">
                    Date
                  </th>
                  <th className="font-sans py-2 text-[#646464] font-normal text-[16px]">
                    Amount
                  </th>
                  <th className="font-sans py-2 text-[#646464] font-normal text-[16px] text-right">
                    Status
                  </th>
                </tr>
              </thead>
                <tbody>
                { repayments?.map((repayment) => (
  <tr key={repayment.id} className="border-t">
    <td className="font-sans py-2 text-[#373D46] font-semibold text-[18px]">
      {new Date(repayment?.payment_date).toLocaleDateString()}
    </td>
    <td className="font-sans py-2 text-[#373D46] font-semibold text-[18px]">
      ${parseFloat(repayment?.amount).toFixed(2)}
    </td>
    <td className="font-sans py-2 text-[#373D46] font-semibold text-[18px] text-right">
      <span
        className={`font-sans border-2 font-bold text-[16px] py-1 px-4 rounded-lg ${repayment?.status === "completed"
            ? "text-green-600 border-green-600"
            : "text-red-600 border-red-600"
          }`}
      >
        {repayment?.status === "completed" ? "Paid" : "Unpaid"}
      </span>
    </td>
  </tr>
))}

                </tbody></>}

            </table>
          </div>
        </div>
        <ToastContainer position="top-center" autoClose={2000} />
      </div>
    </div>
  );
};

export default UsersLoanDetail;
