import React, { useState, useEffect } from "react";
import { getFinancialData } from "../../API/apiServices";

const financialData = {
    credit: [
      {
        is_overdue: true,
        next_payment_due_date: "2025-02-15",
        aprs: [
          { balance_subject_to_apr: 5000, apr_percentage: 15 },
          { balance_subject_to_apr: 2000, apr_percentage: 20 },
        ],
      },
    ],
    student: [
      {
        is_overdue: false,
        outstanding_interest_amount: 1500,
        pslf_status: { payments_remaining: 120 },
      },
    ],
    mortgage: [
      {
        past_due_amount: 2500,
        current_late_fee: 50,
        has_pmi: true,
      },
    ],
    accounts: [
      {
        balances: { available: 300 },
      },
    ],
  };

const FinancialDataDisplay = ({ userId }) => {
  // const [financialData, setFinancialData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(null);

//   useEffect(() => {
//     fetchFinancialData(userId);
//   }, []);

//   const fetchFinancialData = async (userId) => {
//     setIsLoading(true);
//     try {
//       const response = await getFinancialData({ userId });
//       const data = response?.accountData;
//       setFinancialData(data);

//       if (data) {
//         if (data.credit) {
//           setActiveTab("Credit");
//         } else if (data.student) {
//           setActiveTab("Student");
//         } else if (data.mortgage) {
//           setActiveTab("Mortgage");
//         } else if (data.accounts) {
//           setActiveTab("Deposit");
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching financial data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

  

  if (isLoading) return <div className="text-center py-4">Loading...</div>;
  if (!financialData) return <div className="text-center py-4">No data available</div>;

  const tabs = [
    financialData?.credit && "Credit",
    financialData?.student && "Student",
    financialData?.mortgage && "Mortgage",
    financialData?.accounts && "Deposit",
  ].filter(Boolean);

  const renderTabContent = (tab) => {
    const data = financialData[tab.toLowerCase()];
    if (!data || data.length === 0) return <p className="text-center mt-3">No data available for {tab}</p>;

    return (
        <div className="font-sans bg-white p-5 rounded-lg shadow border text-left border-[#C4C4C4] mt-4">
        <h2 className="font-sans text-[24px] text-[#383838] font-extrabold mb-4">{tab} Data</h2>
        {data.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 bg-[#FCFCFC] w-full p-4 gap-y-4">
              {tab === "Credit" && (
                <>
                <div className="flex flex-col">
                    <span className="font-sans font-normal text-[16px] text-[#646464]">
                    Avg. Likes:
                    </span>
                    <span
                    className="font-sans font-semibold text-[18px] text-[#383838] break-words"
                    style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                    >
                    {item.is_overdue ? "Yes" : "No"}
                    </span>
                </div>
                <div className="flex flex-col">
                    <span className="font-sans font-normal text-[16px] text-[#646464]">
                    Next Payment Due:
                    </span>
                    <span
                    className="font-sans font-semibold text-[18px] text-[#383838] break-words"
                    style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                    >
                    {item.next_payment_due_date || "N/A"}
                    </span>
                </div>
                <div className="flex flex-col">
                    <span className="font-sans font-normal text-[16px] text-[#646464]">
                    APR Balances:
                    </span>
                    <span
                    className="font-sans font-semibold text-[18px] text-[#383838] break-words"
                    style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                    >
                    No
                    </span>
                </div>
                </>
              )}
              {tab === "Student" && (
                <>
                <div className="flex flex-col">
                    <span className="font-sans font-normal text-[16px] text-[#646464]">
                    Overdue:
                    </span>
                    <span
                    className="font-sans font-semibold text-[18px] text-[#383838] break-words"
                    style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                    >
                    {item.is_overdue ? "Yes" : "No"}
                    </span>
                </div>
                <div className="flex flex-col">
                    <span className="font-sans font-normal text-[16px] text-[#646464]">
                    Outstanding Interest:
                    </span>
                    <span
                    className="font-sans font-semibold text-[18px] text-[#383838] break-words"
                    style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                    >
                    ${item.outstanding_interest_amount || "N/A"}
                    </span>
                </div>
                <div className="flex flex-col">
                    <span className="font-sans font-normal text-[16px] text-[#646464]">
                    PSLF Payments Remaining:
                    </span>
                    <span
                    className="font-sans font-semibold text-[18px] text-[#383838] break-words"
                    style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                    >
                    {item.pslf_status?.payments_remaining ?? "N/A"}
                    </span>
                </div>
                </>
              )}
              {tab === "Mortgage" && (
                <>
                <div className="flex flex-col">
                    <span className="font-sans font-normal text-[16px] text-[#646464]">
                    Past Due Amount:
                    </span>
                    <span
                    className="font-sans font-semibold text-[18px] text-[#383838] break-words"
                    style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                    >
                    ${item.past_due_amount || "N/A"}
                    </span>
                </div>
                <div className="flex flex-col">
                    <span className="font-sans font-normal text-[16px] text-[#646464]">
                    Current Late Fee:
                    </span>
                    <span
                    className="font-sans font-semibold text-[18px] text-[#383838] break-words"
                    style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                    >
                    ${item.current_late_fee || "N/A"}
                    </span>
                </div>
                <div className="flex flex-col">
                    <span className="font-sans font-normal text-[16px] text-[#646464]">
                    Has PMI:
                    </span>
                    <span
                    className="font-sans font-semibold text-[18px] text-[#383838] break-words"
                    style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                    >
                    {item.has_pmi ? "Yes" : "No"}
                    </span>
                </div>
                </>
              )}
              {tab === "Deposit" && (
                <>
                <div className="flex flex-col">
                    <span className="font-sans font-normal text-[16px] text-[#646464]">
                    Available Balance:
                    </span>
                    <span
                    className="font-sans font-semibold text-[18px] text-[#383838] break-words"
                    style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                    >
                    ${item?.balances?.available || "N/A"}
                    </span>
                </div>
                </>
              )}
            </div>
          ))}
      </div>
    );
  };

  return (
    <>
      <div className="flex gap-2 border-b pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg ${
              activeTab === tab ? "bg-green-500 text-white" : "bg-gray-200 text-gray-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {activeTab && renderTabContent(activeTab)}
    </>
  );
};

export default FinancialDataDisplay;

// import React, { useState } from "react";
// const banksData = [
//     {
//         "institution_name": "Bank of America",
//         "institution_id": "ins_127989",
//         "accessToken": "access-sandbox-95495356-9cc3-42e8-b1f9-8376136754e1",
//         "accounts": [
//             {
//                 "accountId": "o4Ez74Po7oCZPyyLRvkyiV6MbRN41afoKLxqj",
//                 "name": "Plaid Checking",
//                 "officialName": "Plaid Gold Standard 0% Interest Checking",
//                 "mask": "0000",
//                 "type": "depository",
//                 "subtype": "checking",
//                 "balances": {
//                     "available": 100,
//                     "current": 110,
//                     "isoCurrencyCode": "USD",
//                     "limit": null,
//                     "unofficialCurrencyCode": null
//                 },
//                 "mortgage": null,
//                 "studentLoan": null
//             },
//             {
//                 "accountId": "gK9g3Kz636t8MzzGRLNzHQn9Vaml6DFEM3a86",
//                 "name": "Plaid Student Loan",
//                 "officialName": null,
//                 "mask": "7777",
//                 "type": "loan",
//                 "subtype": "student",
//                 "balances": {
//                     "available": null,
//                     "current": 65262,
//                     "isoCurrencyCode": "USD",
//                     "limit": null,
//                     "unofficialCurrencyCode": null
//                 },
//                 "mortgage": null,
//                 "studentLoan": {
//                     "loanName": "Consolidation",
//                     "minimumPaymentAmount": 25,
//                     "nextPaymentDueDate": "2019-05-28T00:00:00.000Z",
//                     "outstandingInterestAmount": 6227.36
//                 }
//             },
//             {
//                 "accountId": "8eKrQe5PQPFPkBBZW6rBfNnkd7vRWQfWrd431",
//                 "name": "Plaid Mortgage",
//                 "officialName": null,
//                 "mask": "8888",
//                 "type": "loan",
//                 "subtype": "mortgage",
//                 "balances": {
//                     "available": null,
//                     "current": 56302.06,
//                     "isoCurrencyCode": "USD",
//                     "limit": null,
//                     "unofficialCurrencyCode": null
//                 },
//                 "mortgage": {
//                     "accountNumber": "3120194154",
//                     "interestRatePercentage": 3.99,
//                     "nextPaymentDueDate": "2019-11-15T00:00:00.000Z",
//                     "loanTypeDescription": "conventional"
//                 },
//                 "studentLoan": null
//             }
//         ]
//     },
//     {
//         "institution_name": "PNC",
//         "institution_id": "ins_13",
//         "accessToken": "access-sandbox-b35996c5-6d0d-4ae6-b276-46e71db30fc5",
//         "accounts": [
//             {
//                 "accountId": "W7RJEXJLwbS5gzJ3loKLFemAlXp77GU61mNvw",
//                 "name": "Plaid Checking",
//                 "officialName": "Plaid Gold Standard 0% Interest Checking",
//                 "mask": "0000",
//                 "type": "depository",
//                 "subtype": "checking",
//                 "balances": {
//                     "available": 100,
//                     "current": 110,
//                     "isoCurrencyCode": "USD",
//                     "limit": null,
//                     "unofficialCurrencyCode": null
//                 },
//                 "mortgage": null,
//                 "studentLoan": null
//             },
//             {
//                 "accountId": "AZn1rw1x5dcZVwE8LNQdFd9wVg1eeWf9AXVyo",
//                 "name": "Plaid Saving",
//                 "officialName": "Plaid Silver Standard 0.1% Interest Saving",
//                 "mask": "1111",
//                 "type": "depository",
//                 "subtype": "savings",
//                 "balances": {
//                     "available": 200,
//                     "current": 210,
//                     "isoCurrencyCode": "USD",
//                     "limit": null,
//                     "unofficialCurrencyCode": null
//                 },
//                 "mortgage": null,
//                 "studentLoan": null
//             },
//             {
//                 "accountId": "GgQwanwyb7t5m6ajyLR7FkRavXNooAT6PeN88",
//                 "name": "Plaid Student Loan",
//                 "officialName": null,
//                 "mask": "7777",
//                 "type": "loan",
//                 "subtype": "student",
//                 "balances": {
//                     "available": null,
//                     "current": 65262,
//                     "isoCurrencyCode": "USD",
//                     "limit": null,
//                     "unofficialCurrencyCode": null
//                 },
//                 "mortgage": null,
//                 "studentLoan": {
//                     "loanName": "Consolidation",
//                     "minimumPaymentAmount": 25,
//                     "nextPaymentDueDate": "2019-05-28T00:00:00.000Z",
//                     "outstandingInterestAmount": 6227.36
//                 }
//             },
//             {
//                 "accountId": "nG54oR4MmNiKo1WVNlrkcQkjg9all6iAWy7EZ",
//                 "name": "Plaid Mortgage",
//                 "officialName": null,
//                 "mask": "8888",
//                 "type": "loan",
//                 "subtype": "mortgage",
//                 "balances": {
//                     "available": null,
//                     "current": 56302.06,
//                     "isoCurrencyCode": "USD",
//                     "limit": null,
//                     "unofficialCurrencyCode": null
//                 },
//                 "mortgage": {
//                     "accountNumber": "3120194154",
//                     "interestRatePercentage": 3.99,
//                     "nextPaymentDueDate": "2019-11-15T00:00:00.000Z",
//                     "loanTypeDescription": "conventional"
//                 },
//                 "studentLoan": null
//             }
//         ]
//     }
// ]

// const BankAccountsAdmin = () => {
//   const [activeBank, setActiveBank] = useState(banksData[0]?.institution_id || null);
//   const [expandedAccount, setExpandedAccount] = useState(null);

//   return (
//     <div className="max-w-5xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
//       <h2 className="text-2xl font-bold text-center mb-4">Bank Accounts Overview</h2>

//       {/* Tabs for Institutions */}
//       <div className="flex gap-3 border-b pb-2">
//         {banksData.map((bank) => (
//           <button
//             key={bank.institution_id}
//             onClick={() => setActiveBank(bank.institution_id)}
//             className={`px-4 py-2 rounded-lg ${
//               activeBank === bank.institution_id ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
//             }`}
//           >
//             {bank.institution_name}
//           </button>
//         ))}
//       </div>

//       {/* Accounts List for Selected Bank */}
//       {banksData
//         .filter((bank) => bank.institution_id === activeBank)
//         .map((bank) => (
//           <div key={bank.institution_id} className="mt-4 bg-white p-4 rounded-lg shadow-md">
//             <h3 className="text-lg font-semibold text-gray-800">Accounts in {bank.institution_name}</h3>

//             {/* Grouped by account type */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
//               {bank.accounts.map((account) => (
//                 <div
//                   key={account.accountId}
//                   className="border p-3 rounded-lg cursor-pointer hover:bg-gray-50"
//                   onClick={() =>
//                     setExpandedAccount(expandedAccount === account.accountId ? null : account.accountId)
//                   }
//                 >
//                   <p className="font-semibold">{account.name}</p>
//                   <p className="text-sm text-gray-600">Account Type: {account.subtype}</p>
//                   <p className="text-sm text-gray-600">Balance: ${account.balances.current}</p>
//                   <p className="text-sm text-gray-600">Mask: **** {account.mask}</p>

//                   {/* Expand Account Details */}
//                   {expandedAccount === account.accountId && (
//                     <div className="mt-2 p-2 bg-gray-100 rounded-lg">
//                       {account.mortgage && (
//                         <>
//                           <p className="font-semibold">Mortgage Details:</p>
//                           <p>Loan Type: {account.mortgage.loanTypeDescription}</p>
//                           <p>Interest Rate: {account.mortgage.interestRatePercentage}%</p>
//                           <p>Next Payment Due: {account.mortgage.nextPaymentDueDate}</p>
//                         </>
//                       )}
//                       {account.studentLoan && (
//                         <>
//                           <p className="font-semibold">Student Loan Details:</p>
//                           <p>Loan Name: {account.studentLoan.loanName}</p>
//                           <p>Outstanding Interest: ${account.studentLoan.outstandingInterestAmount}</p>
//                           <p>Next Payment Due: {account.studentLoan.nextPaymentDueDate}</p>
//                         </>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//     </div>
//   );
// };

// export default BankAccountsAdmin;
