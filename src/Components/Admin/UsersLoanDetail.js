import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { updateStatusAdmin } from "../../API/apiServices";
import HighRisk from "../../assets/images/HighRisk.svg";
import LowRisk from "../../assets/images/LowRisk.svg";
import NormalRisk from "../../assets/images/NormalRisk.svg";
const UsersLoanDetail = ({ selectedLoan,user,profileData,onUpdateStatus }) => {
  const location = useLocation();
  const [transactionId, setTransactionId] = useState("");
  const [approvalDate] = useState(new Date().toLocaleDateString())
  const [showLoanDetails, setShowLoanDetails] = useState(false);


  const loanData = {
    id: 12345,
    amount: 1200,
    status: "Pending",
    interestRate: 5.5,
    loanDate: "2024-01-15",
    approvedDate: "2024-01-20",
    dueDate: "2025-01-15",
    amountPending: 400,
    repaymentHistory: [
      {
        date: "2024-02-15",
        amountPaid: 200,
        emiDate: "2024-02-15",
        status: "Paid",
      },
      {
        date: "2024-03-15",
        amountPaid: 200,
        emiDate: "2024-03-15",
        status: "Paid",
      },
      {
        date: "2024-04-15",
        amountPaid: 200,
        emiDate: "2024-04-15",
        status: "Paid",
      },
      {
        date: "2024-05-15",
        amountPaid: 200,
        emiDate: "2024-05-15",
        status: "Pending",
      },
      {
        date: "2024-06-15",
        amountPaid: 200,
        emiDate: "2024-06-15",
        status: "Pending",
      },
    ],
  };

  console.log("selectedLoan",selectedLoan);
  
  const handleStatusChange = async (loanId, status) => {
    if (status === "Approved") {
      const result = await Swal.fire({
        title: "Approval Form",
        html: `
          <div style="text-align: left; font-family: Arial, sans-serif;">
            <div style="margin-bottom: 15px;">
              <label for="userName" style="font-weight: bold; color: #4e4e4e;">User Name:</label>
              <input placeholder="Enter Transaction Id" type="text" id="userName" value="${user?.firstName + " " + user?.lastName}" readonly 
                style="width: 100%; padding: 10px; font-size: 14px; border: 1px solid #ccc; border-radius: 5px; background-color: #f7f7f7;"/>
            </div>
            <div style="margin-bottom: 15px;">
              <label for="transactionId" style="font-weight: bold; color: #4e4e4e;">Transaction ID:</label>
              <input type="text" id="transactionId" oninput="this.value = this.value.replace(/[^a-zA-Z0-9]/g, '')" 
                style="width: 100%; padding: 10px; font-size: 14px; border: 1px solid #ccc; border-radius: 5px;"/>
            </div>
            <div style="margin-bottom: 15px;">
              <label for="amount" style="font-weight: bold; color: #4e4e4e;">Amount:</label>
              <input type="text" id="amount" value="${selectedLoan?.amount}" readonly 
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
          const currentDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
          approvalDateInput.value = currentDate; // Set the value to the input
        },
        preConfirm: () => {
          const transactionIdInput = document.getElementById("transactionId").value;
          const approvalDate = document.getElementById("approvalDate").value;
  
          // Validation: Ensure both fields are filled
          if (!transactionIdInput) {
            Swal.showValidationMessage("Please enter the Transaction ID");
            return false;
          }
          if (!approvalDate) {
            Swal.showValidationMessage("Please enter the Approval Date.");
            return false;
          }
  
          const selectedDate = new Date(approvalDate);
          const currentDate = new Date();
          // Reset time for the currentDate to 00:00:00
          currentDate.setHours(0, 0, 0, 0);
  
          // Ensure the approval date is not in the past
          if (selectedDate < currentDate) {
            Swal.showValidationMessage("Approval Date cannot be in the past.");
            return false;
          }
  
          return { transactionIdInput, approvalDate }; // Return values to be used later
        },
        icon: 'info',
        customClass: {
          popup: 'swal-wide',
        },
      });
  
      if (result.isConfirmed) {
        const { transactionIdInput, approvalDate } = result.value;
  
        Swal.fire({
          title: "Processing...",
          text: "Please wait while we process your request.",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
          icon: 'info',
        });
  
        try {
          await updateStatusAdmin({
            loanId,
            status,
            adminName: profileData.firstName + " " + profileData.lastName,
            userEmail: user?.email,
            transactionId: transactionIdInput,
            userName: user?.firstName + " " + user?.lastName,
            loanAmount: selectedLoan?.amount,
            approvalDate,
          });
          onUpdateStatus(loanId, 'Approved')
          Swal.fire({
            title: `${status}!`,
            text: `The loan has been ${status.toLowerCase()}ed successfully.`,
            icon: 'success',
            confirmButtonText: 'Ok',
          });
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: `Failed to ${status.toLowerCase()} the loan.`,
            icon: 'error',
            confirmButtonText: 'Retry',
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
        icon: 'warning',
      });
  
      if (result.isConfirmed) {
        Swal.fire({
          title: "Processing...",
          text: "Please wait while we process your request.",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
          icon: 'info',
        });
  
        try {
          await updateStatusAdmin({
            loanId,
            status,
            adminName: profileData.firstName + " " + profileData.lastName,
            userEmail: user?.email,
          });
           onUpdateStatus(loanId, 'Rejected')
          Swal.fire({
            title: `${status}!`,
            text: `The loan has been ${status.toLowerCase()}ed.`,
            icon: 'success',
            confirmButtonText: 'Ok',
          });
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: `Failed to ${status.toLowerCase()} the loan.`,
            icon: 'error',
            confirmButtonText: 'Retry',
          });
        }
      }
    }
  };
  
  
  
  return (
    <div className="font-sans flex flex-col min-h-screen">
      <div className="font-sans flex flex-col md:flex-row min-h-screen bg-[#ffff]">
        {/* Main Content Area */}
        <div className="font-sans w-full md:w-[95%] md:p-6 p-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        {/* Loan ID */}
        <h1 className="text-[32px] text-left font-bold mb-4 font-sans md:w-1/3">
          Loan ID: {selectedLoan?.id}
        </h1>

        {/* Right side: Buttons and Risk Image */}
        <div className={`flex flex-col md:flex-row md:items-center ${selectedLoan?.status === "Pending" ? 'md:w-[47%]' : 'md:w-[15%]'}`}>

        {/* Risk Image */}
        {selectedLoan?.riskLevel === "High" ? (
        <img
        src={HighRisk} // Replace with your actual image path
        alt="High Risk"
        style={{ width: "7rem", height: "10rem" ,marginTop:"2rem"}} // Adjust size as needed
      />
    ) : selectedLoan?.riskLevel === "Low" ? (
      <img
        src={LowRisk} // Replace with your actual image path
        alt="Low Risk"
         style={{ width: "7rem", height: "10rem" ,marginTop:"2rem"}}  // Adjust size as needed
      />
    ) : selectedLoan?.riskLevel === "Medium" ? (
      <img
        src={NormalRisk} // Replace with your actual image path
        alt="Normal Risk"
         style={{ width: "7rem", height: "10rem" ,marginTop:"2rem"}}  // Adjust size as needed
      />
    ) : (
      null
    )}
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


          <div className="font-sans grid grid-cols-1 lg:grid-cols-2 gap-6 mt-3">
            {/* Bank Information */}
            <div className="font-sans bg-white p-6 rounded-lg shadow border text-left border-[#C4C4C4]">
    <h2 className="font-sans text-[24px] text-[#383838] font-extrabold mb-4">
      Bank Information
    </h2>

    <div className="bg-[#FCFCFC] w-full p-4 mb-4 rounded-lg">
      {/* From Account Section */}
      <h3 className="font-sans text-[18px] text-[#383838] font-bold mb-4">
      Loan Disbursement Account Details :
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span className="font-sans font-normal text-[16px] text-[#646464]">
            Institution Name:
          </span>
          <span className="font-sans font-semibold text-[18px] text-[#383838]">
            {selectedLoan?.fromAccount?.institutionName || "N/A"}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-sans font-normal text-[16px] text-[#646464]">
            Account Name:
          </span>
          <span className="font-sans font-semibold text-[18px] text-[#383838]">
            {selectedLoan?.fromAccount?.accountName || "N/A"}
          </span>
        </div>
        <div className="flex flex-col">
        <span className="font-sans font-normal text-[16px] text-[#646464]">
          Account Type:
        </span>
        <span className="font-sans font-semibold text-[18px] text-[#383838]">
          {selectedLoan?.fromAccount?.accountType || "N/A"}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="font-sans font-normal text-[16px] text-[#646464]">
          Account Subtype:
        </span>
        <span className="font-sans font-semibold text-[18px] text-[#383838]">
          {selectedLoan?.fromAccount?.accountSubtype || "N/A"}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="font-sans font-normal text-[16px] text-[#646464]">
          Institution ID:
        </span>
        <span className="font-sans font-semibold text-[18px] text-[#383838]">
          {selectedLoan?.fromAccount?.institutionId || "N/A"}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="font-sans font-normal text-[16px] text-[#646464]">
          Account Number:
        </span>
        <span className="font-sans font-semibold text-[18px] text-[#383838]">
          {selectedLoan?.fromAccount?.accountNumber || "N/A"}
        </span>
      </div>
    </div>
  </div>

  <div className="bg-[#FCFCFC] w-full p-4 mb-4 rounded-lg">
    {/* To Account Section */}
    <h3 className="font-sans text-[18px] text-[#383838] font-bold mb-4">
    Repayment Account :
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col">
        <span className="font-sans font-normal text-[16px] text-[#646464]">
          Institution Name:
        </span>
        <span className="font-sans font-semibold text-[18px] text-[#383838]">
          {selectedLoan?.toAccount?.institutionName || "N/A"}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="font-sans font-normal text-[16px] text-[#646464]">
          Account Name:
        </span>
        <span className="font-sans font-semibold text-[18px] text-[#383838]">
          {selectedLoan?.toAccount?.accountName || "N/A"}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="font-sans font-normal text-[16px] text-[#646464]">
          Account Type:
        </span>
        <span className="font-sans font-semibold text-[18px] text-[#383838]">
          {selectedLoan?.toAccount?.accountType || "N/A"}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="font-sans font-normal text-[16px] text-[#646464]">
          Account Subtype:
        </span>
        <span className="font-sans font-semibold text-[18px] text-[#383838]">
          {selectedLoan?.toAccount?.accountSubtype || "N/A"}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="font-sans font-normal text-[16px] text-[#646464]">
          Institution ID:
        </span>
        <span className="font-sans font-semibold text-[18px] text-[#383838]">
          {selectedLoan?.toAccount?.institutionId || "N/A"}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="font-sans font-normal text-[16px] text-[#646464]">
          Account Number:
        </span>
        <span className="font-sans font-semibold text-[18px] text-[#383838]">
          {selectedLoan?.toAccount?.accountNumber || "N/A"}
        </span>
      </div>
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
                    Loan Amount
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
                    Amount Paid
                  </span>
                  <span className="font-sans px-5 py-1 border-2 font-bold rounded-lg text-[#242424] border-[#242424]">
                  {selectedLoan?.amount && selectedLoan?.interest
                    ? `$${(
                        selectedLoan?.amount *
                        (1 + selectedLoan?.interest / 100)
                      ).toFixed(2)}`
                    : "N/A"}
                  </span>
                </div>
                <h2>(These values currently pending will be done after plaid)</h2>
                <div className="flex justify-between">
                  <span className="font-sans font-normal text-[16px] text-[#646464]">
                    Amount Pending
                  </span>
                  <span className="font-sans px-5 py-1 border-2 font-bold rounded-lg text-[#242424] border-[#242424]">
                    {selectedLoan?.amountPending
                      ? `$${selectedLoan.amountPending}`
                      : "N/A"}
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
                <div className="flex justify-between">
                  <span className="font-sans font-normal text-[16px] text-[#646464]">
                    Payment Deduction Date
                  </span>
                  <span className="font-sans px-5 py-1 border-2 font-bold rounded-lg text-[#242424] border-[#242424]">
                    {selectedLoan?.deductionDate
                      ? new Date(
                          selectedLoan.deductionDate
                        ).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 bg-white p-6 rounded-lg w-full md:w-[65%] shadow border border-[#C4C4C4] ">
            <h2 className="font-sans text-[24px] text-[#383838] font-extrabold mb-4 text-left">
              Repayment History (Static table)
            </h2>

            <table className="w-full text-left">
              <thead>
                <tr className="text-[#E2E5E9]">
                  {/* <th className="font-sans py-2 text-[#646464] font-normal text-[16px] w-[20%]">
                      Loan ID
                    </th> */}
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
                {loanData?.repaymentHistory?.map((loan) => (
                  <tr key={loan.id} className="border-t">
                    <td className="font-sans py-2 text-[#373D46] font-semibold text-[18px]">
                      {new Date(loan.date).toLocaleDateString()}{" "}
                      {/* Ensuring it's the correct date */}
                    </td>
                    <td className="font-sans py-2 text-[#373D46] font-semibold text-[18px]">
                      ${loan.amountPaid.toFixed(2)}{" "}
                      {/* Ensure amount is formatted correctly */}
                    </td>
                    <td className="font-sans py-2 text-[#373D46] font-semibold text-[18px] text-right">
                      <span
                        className={`font-sans border-2 font-bold text-[16px] py-1 px-4 rounded-lg ${
                          loan.status === "Paid"
                            ? "text-green-600 border-green-600"
                            : loan.status === "Pending"
                            ? "text-yellow-600 border-yellow-600"
                            : "text-red-600 border-red-600"
                        }`}
                      >
                        {loan.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersLoanDetail;