import React, { useEffect, useState, useRef, useCallback } from "react";
import Loader from "../Loader";
import Header from "../Layout/Header";
import { useNavigate } from "react-router-dom";
import { getAdminProfile } from "../../API/apiServices";
import { debounce } from "lodash"; // Install lodash for debouncing
import { CiMenuKebab } from "react-icons/ci";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";
import "jspdf-autotable";
import Logo from "../../assets/images/logo.png";

const AdminDashboard = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [dropdownOptions, setDropdownOptions] = useState([]);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileData, setProfileData] = useState([]);
  const [loanMinAmount, setLoanMinAmount] = useState(500);
  const [loanMaxAmount, setLoanMaxAmount] = useState(2000);
  const [loanStatus, setLoanStatus] = useState("All");
  const [repaymentFilter, setRepaymentFilter] = useState("All");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [institutionName, setInstitutionName] = useState("");

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [applyFilter, setApplyFilter] = useState(true);
  const sectionRef = useRef(null);

  const fetchProfileData = async () => {
    try {
      const response = await getAdminProfile();
      setProfileData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  console.log("users..", users);
  // const fetchUsers = async (page) => {
  //   setLoading(true);
  //   try {
  //     const token = localStorage.getItem("adminToken");

  //     // Construct query parameters with all active filters
  //     const queryParams = new URLSearchParams({
  //       page,
  //       limit: 10,
  //       searchQuery: searchQuery.trim() || "", // Includes Loan ID or user search query
  //       loanStatus: loanStatus !== "All" ? loanStatus : "",
  //       loanMinAmount,
  //       loanMaxAmount,
  //       accountNumber: accountNumber.trim(),
  //       institutionName: institutionName.trim(),
  //       accountName: accountName.trim(),
  //     });

  //     const response = await fetch(
  //       `${BASE_URL}/admin/users?${queryParams.toString()}`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     const data = await response.json();
  //     if (data.success) {
  //       setUsers(data.users);
  //       setTotalPages(data.totalPages);
  //     } else {
  //       console.error("Failed to fetch users:", data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching users:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchUsers = async (page) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");

      // Construct query parameters with all active filters
      const queryParams = new URLSearchParams({
        page,
        limit: 10,
        searchQuery: searchQuery.trim() || "",
        loanStatus: loanStatus !== "All" ? loanStatus : "",
        loanMinAmount,
        loanMaxAmount,
        accountNumber: accountNumber.trim(),
        institutionName: institutionName.trim(),
        accountName: accountName.trim(),
      });

      const response = await fetch(
        `${BASE_URL}/admin/users?${queryParams.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log("data...", data);
      if (data.success) {
        setUsers(data.users);
        setTotalPages(data.totalPages);
        setPage(page); // Track the current page
      } else {
        console.error("Failed to fetch users:", data.message);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reset to first page when any filter changes
  const handleFilterChange = (filter, value) => {
    switch (filter) {
      case "loanStatus":
        setLoanStatus(value);
        break;
      case "accountNumber":
        setAccountNumber(value);
        break;
      case "institutionName":
        setInstitutionName(value);
        break;
      case "accountName":
        setAccountName(value);
        break;
    }
    setPage(1); // Reset to the first page
  };

  useEffect(() => {
    if (applyFilter) {
      fetchUsers(page);
    } else {
      fetchAllUsers(page, searchQuery);
    }
  }, [
    applyFilter,
    page,
    searchQuery,
    loanStatus,
    loanMinAmount,
    loanMaxAmount,
    accountNumber,
    institutionName,
    accountName,
  ]);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchFilterData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${BASE_URL}/admin/filter-data`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        // Save accountsData for dropdown options
        const uniqueAccounts = data.accountsData.filter(
          (item) =>
            item.accountNumber && item.institutionName && item.accountName
        );
        setDropdownOptions(uniqueAccounts); // Set filtered accounts
      } else {
        console.error("Failed to fetch filter data:", data.message);
      }
    } catch (error) {
      console.error("Error fetching filter data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFilterData();
  }, [fetchFilterData]);

  const handleFilterToggle = () => {
    setApplyFilter((prev) => !prev);
    setPage(1);
  };

  // const fetchAllUsers = async (page) => {
  //   setLoading(true);
  //   try {
  //     const token = localStorage.getItem("adminToken");
  //     const queryParams = new URLSearchParams({
  //       page,
  //       limit: 10,
  //     });

  //     // Add searchQuery if it exists
  //     if (searchQuery) queryParams.append("searchQuery", searchQuery);

  //     const response = await fetch(
  //       `${BASE_URL}/admin/allusers?${queryParams.toString()}`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     const data = await response.json();

  //     if (data.success) {
  //       setUsers(data.users);
  //       setTotalPages(data.totalPages);
  //     } else {
  //       console.error("Failed to fetch users:", data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching users:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchAllUsers = async (page, query) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const queryParams = new URLSearchParams({
        page,
        limit: 10,
        ...(query && { searchQuery: query }),
      });

      const response = await fetch(
        `${BASE_URL}/admin/allusers?${queryParams.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
        setTotalPages(data.totalPages);
      } else {
        console.error("Failed to fetch users:", data.message);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMinChange = (e) => {
    const newMin = Math.min(e.target.value, loanMaxAmount); // Ensure min is not greater than max
    setLoanMinAmount(newMin);
    // fetchUsers(page); // Fetch filtered users
  };

  const handleMaxChange = (e) => {
    const newMax = Math.max(e.target.value, loanMinAmount); // Ensure max is not less than min
    setLoanMaxAmount(newMax);
    // fetchUsers(page); // Fetch filtered users
  };

  const clearFilters = () => {
    setLoanStatus("All");
    setRepaymentFilter("All");
    setLoanMinAmount(500);
    setLoanMaxAmount(2000);
    setSearchQuery("");
    setAccountName("");
    setAccountNumber("");
    setInstitutionName("");
    setDropdownOptions([]);
    fetchFilterData();
    setPage(1);
  };

  //   const downloadCSV = () => {
  //     // Define CSV Header
  //     const dataToDownload = applyFilter ? filteredUsers : users;
  //     const headers = [
  //       "User Name",
  //       "Email",
  //       "Verified Status",
  //       "Number of Loans",
  //     ].join(",");

  //     // Prepare rows for CSV content
  //     const rows = dataToDownload.map((user) => {
  //       const fullName = `${user.firstName} ${user.lastName}`;
  //       const email = user.email || "N/A";
  //       const isVerified = user.isVerified ? "Verified" : "Not Verified";
  //       const numLoans = user.loans ? user.loans.length : 0;

  //       return [fullName, email, isVerified, numLoans].join(",");
  //     });

  //      //Combine headers and rows
  //     const csvContent = [headers, ...rows].join("\n");

  //     // Create a Blob and trigger download
  //     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  //     saveAs(blob, "Users_Summary_Report.csv");
  //   };

  //  const downloadPDF = () => {
  //     const dataToDownload = applyFilter ? filteredUsers : users;
  //     const doc = new jsPDF();

  //     const img = new Image();
  //     img.src = Logo;

  //     const pageWidth = doc.internal.pageSize.getWidth();

  //     doc.addImage(img, 'PNG',pageWidth / 2 - 25, 10, 50, 20);
  //     doc.setFontSize(18);
  //     doc.setTextColor("#333333");
  //     doc.text("CashFluence", pageWidth / 2, 40, { align: "center" });

  //     // Add subtitle
  //     doc.setFontSize(12);
  //     doc.setTextColor("#666666");
  //     doc.text("User Loan Details Report", pageWidth / 2, 50, { align: "center" });

  //     // Initialize Y-axis for positioning
  //     let yPosition = 60;

  //     dataToDownload.forEach((user, index) => {
  //       const sortedLoans = user.loans
  //     ? user.loans.sort((a, b) => a.id - b.id)
  //     : [];
  //       // Add user section
  //       doc.setFontSize(12);
  //       doc.setTextColor("#000000");
  //       doc.text(`${index + 1}. Name: ${user.firstName} ${user.lastName}`, 10, yPosition);
  //       doc.setFontSize(10);
  //       doc.setTextColor("#555555");
  //       doc.text(`Email: ${user.email}`, 15, yPosition + 5);

  //       if (sortedLoans.length > 0) {
  //         // Add loans table
  //         doc.autoTable({
  //           startY: yPosition + 10,
  //           head: [["Loan ID", "Status", "Amount", "Created At"]],
  //           body: sortedLoans.map((loan) => [
  //             loan.id,
  //             loan.status,
  //             `$${loan.amount}`,
  //             loan?.createdAt ? new Date(loan.createdAt).toLocaleDateString(): "N/A",
  //           ]),
  //           theme: "grid",
  //           styles: {
  //             fontSize: 10,
  //             textColor: "#333333",
  //             lineColor: "#dddddd",
  //           },
  //           headStyles: {
  //             fillColor: "#5EB66E",
  //             textColor: "#ffffff",
  //           },
  //           alternateRowStyles: {
  //             fillColor: "#f8f9fa",
  //           },
  //         });

  //         yPosition = doc.lastAutoTable.finalY + 10;  //Adjust Y position
  //       } else {
  //          // no loans, show message
  //         doc.setFontSize(10);
  //         doc.setTextColor("#ff0000");
  //         doc.text("No loans available.", 15, yPosition + 10);
  //         yPosition += 20;
  //       }

  //        //Add space between users
  //       yPosition += 10;

  //       // Check if the page needs to be added
  //       if (yPosition > doc.internal.pageSize.getHeight() - 20) {
  //         doc.addPage();
  //         yPosition = 20; // Reset Y position on a new page
  //       }
  //     });

  //      //Download the PDF
  //     doc.save("Cashfluence_Loans.pdf");
  //   };

  const downloadCSV = () => {
    const dataToDownload = applyFilter ? filteredUsers : users;

    const headers = [
      "User Name",
      "Email",
      "Verified Status",
      "Number of Loans",

      // Plaid IDV & KYC Information
      "Plaid IDV Status",
      "KYC Status",
      "Address Match",
      "DOB Match",
      "ID Number Match",
      "Name Match",
      "Phone Number Match",

      // Anti-Fraud Information
      "Anti-Fraud Status",
      "User Interactions",
      "Fraud Ring Detected",
      "Bot Detected",
    ].join(",");

    const rows = dataToDownload.map((user) => {
      const fullName = `${user.firstName} ${user.lastName}`;
      const email = user.email || "N/A";
      const isVerified = user.isVerified ? "Verified" : "Not Verified";
      const numLoans = user.loans ? user.loans.length : 0;

      // Plaid User Data
      const plaid = user.plaidUser;
      const plaid_idv_status = plaid?.plaid_idv_status || "N/A";
      const kyc_status = plaid?.kyc_status || "N/A";

      // KYC Details (Summary)
      const summary = plaid?.kyc_details?.summary || {};
      const address = summary.address || "N/A";
      const dob = summary.dob || "N/A";
      const id_number = summary.id_number || "N/A";
      const name = summary.name || "N/A";
      const phone_number = summary.phone_number || "N/A";

      // Anti-Fraud Information
      const anti_fraud_status = plaid?.anti_fraud_status || "N/A";
      const behavior = plaid?.anti_fraud_details?.behavior || {};
      const user_interactions = behavior.user_interactions || "N/A";
      const fraud_ring_detected = behavior.fraud_ring_detected || "N/A";
      const bot_detected = behavior.bot_detected || "N/A";

      return [
        fullName,
        email,
        isVerified,
        numLoans,

        // Plaid IDV & KYC Information
        plaid_idv_status,
        kyc_status,
        address,
        dob,
        id_number,
        name,
        phone_number,

        // Anti-Fraud Information
        anti_fraud_status,
        user_interactions,
        fraud_ring_detected,
        bot_detected,
      ].join(",");
    });

    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "Users_Summary_Report.csv");
  };

  const downloadPDF = () => {
    const dataToDownload = applyFilter ? filteredUsers : users;
    const doc = new jsPDF("p", "mm", "a4"); // Portrait mode

    const img = new Image();
    img.src = Logo;

    const pageWidth = doc.internal.pageSize.getWidth();

    doc.addImage(img, "PNG", pageWidth / 2 - 25, 10, 50, 20);
    doc.setFontSize(18);
    doc.setTextColor("#333333");
    doc.text("CashFluence", pageWidth / 2, 40, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor("#666666");
    doc.text("User Loan Details Report", pageWidth / 2, 50, {
      align: "center",
    });

    let yPosition = 60;

    dataToDownload.forEach((user, index) => {
      const sortedLoans = user.loans
        ? user.loans.sort((a, b) => a.id - b.id)
        : [];

      doc.setFontSize(12);
      doc.setTextColor("#000000");
      doc.text(
        `${index + 1}. Name: ${user.firstName} ${user.lastName}`,
        10,
        yPosition
      );
      doc.setFontSize(10);
      doc.setTextColor("#555555");
      doc.text(`Email: ${user.email}`, 15, yPosition + 5);

      if (user.plaidUser) {
        const plaid = user.plaidUser;
        const summary = plaid.kyc_details?.summary || {};
        const behavior = plaid.anti_fraud_details?.behavior || {};

        // ✅ Table 1: Plaid IDV & KYC Information
        const kycData = [
          ["Plaid IDV Status", plaid.plaid_idv_status || "N/A"],
          ["KYC Status", plaid.kyc_status || "N/A"],
          ["Address Match", summary.address || "N/A"],
          ["DOB Match", summary.dob || "N/A"],
          ["ID Number Match", summary.id_number || "N/A"],
          ["Name Match", summary.name || "N/A"],
          ["Phone Number Match", summary.phone_number || "N/A"],
        ];

        // ✅ Table 2: Anti-Fraud Information
        const antiFraudData = [
          ["Anti-Fraud Status", plaid.anti_fraud_status || "N/A"],
          ["User Interactions", behavior.user_interactions || "N/A"],
          ["Fraud Ring Detected", behavior.fraud_ring_detected || "N/A"],
          ["Bot Detected", behavior.bot_detected || "N/A"],
        ];

        // ✅ Define Column Positions
        const leftTableX = 15; // Left column for KYC
        const rightTableX = 110; // Right column for Anti-Fraud

        // ✅ Ensure enough space between tables
        const tableWidth = 80; // Fixed width to prevent overlap

        // 🟢 **Render Left Table (KYC)**
        doc.setFontSize(10);
        doc.setTextColor("#000000");
        doc.text("Plaid IDV & KYC Information:", leftTableX, yPosition + 15);

        doc.autoTable({
          startY: yPosition + 20,
          margin: { left: leftTableX },
          tableWidth: tableWidth, // Fixed width
          head: [["Field", "Value"]],
          body: kycData.map(([key, value]) => [
            {
              content: key,
              styles: { fontStyle: "bold", textColor: "#000000" },
            },
            {
              content: value,
              styles: { fontStyle: "bold", textColor: "#1E90FF" },
            }, // Blue text for values
          ]),
          theme: "grid",
          styles: { fontSize: 9, cellPadding: 2, textColor: "#333333" },
          headStyles: { fillColor: "#5EB66E", textColor: "#ffffff" }, // Green header
          alternateRowStyles: { fillColor: "#f8f9fa" },
        });

        const kycFinalY = doc.lastAutoTable.finalY; // Capture KYC table height

        doc.setFontSize(10);
        doc.setTextColor("#000000");
        doc.text("Anti-Fraud Information:", rightTableX, yPosition + 15);

        doc.autoTable({
          startY: yPosition + 20,
          margin: { left: rightTableX },
          tableWidth: tableWidth, // Fixed width
          head: [["Field", "Value"]],
          body: antiFraudData.map(([key, value]) => [
            {
              content: key,
              styles: { fontStyle: "bold", textColor: "#000000" },
            },
            {
              content: value,
              styles: { fontStyle: "bold", textColor: "#1E90FF" },
            }, // Blue text for values
          ]),
          theme: "grid",
          styles: { fontSize: 9, cellPadding: 2, textColor: "#333333" },
          headStyles: { fillColor: "#FF914D", textColor: "#ffffff" }, // Orange header
          alternateRowStyles: { fillColor: "#f8f9fa" },
        });

        const antiFraudFinalY = doc.lastAutoTable.finalY; // Capture Anti-Fraud table height

        // ✅ Ensure proper spacing after the highest of both tables
        yPosition = Math.max(kycFinalY, antiFraudFinalY) + 20; // Extra 20 for spacing
      }

      // ✅ Loans Table with New Columns
      if (sortedLoans.length > 0) {
        doc.autoTable({
          startY: yPosition,
          head: [
            [
              "Loan ID",
              "Admin Side Status",
              "Amount",
              "Repayment Term",
              "Interest",
              "Loan Status",
              "Due Date",
              "Apply Date",
            ],
          ],
          body: sortedLoans.map((loan) => [
            loan.id,
            loan.status,
            `$${loan.amount}`,
            `${Math.round(loan.repaymentTerm / 30)} Months`, // Convert days to months
            loan.interest ? `${loan.interest}%` : "N/A",
            loan.isLoanComplete ? "Completed" : "Ongoing",
            loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : "N/A",
            loan.createdAt
              ? new Date(loan.createdAt).toLocaleDateString()
              : "N/A",
          ]),
          theme: "grid",
          styles: { fontSize: 9, textColor: "#333333", lineColor: "#dddddd" },
          headStyles: { fillColor: "#5EB66E", textColor: "#ffffff" },
          alternateRowStyles: { fillColor: "#f8f9fa" },
        });

        yPosition = doc.lastAutoTable.finalY + 20; // Extra spacing
      } else {
        doc.setFontSize(10);
        doc.setTextColor("#ff0000");
        doc.text("No loans available.", 15, yPosition + 10);
        yPosition += 30; // Extra spacing
      }

      if (yPosition > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        yPosition = 20;
      }
    });

    doc.save("Cashfluence_Loans.pdf");
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const searchQueryLower = searchQuery.toLowerCase();
    // Matches the search query in full name, email, or loan ID
    const matchesSearchQuery =
      fullName.includes(searchQueryLower) ||
      user.email.toLowerCase().includes(searchQueryLower) ||
      (user.loans &&
        user.loans.some((loan) =>
          loan.id.toString().includes(searchQueryLower)
        ));

    // Matches loan status
    const matchesLoanStatus =
      loanStatus === "All" ||
      !user.loans ||
      user.loans.some((loan) => loan.status === loanStatus);

    // Matches loan amount range
    const matchesLoanAmountRange =
      user.loans &&
      user.loans.some(
        (loan) => loan.amount >= loanMinAmount && loan.amount <= loanMaxAmount
      );

    // Matches repayment filter
    const matchesRepaymentFilter =
      repaymentFilter === "All" ||
      (user.loans &&
        user.loans.some((loan) => loan.repaymentTerm === repaymentFilter));

    // Matches institution name filter in either fromAccount or toAccount
    const matchesInstitutionName =
      !institutionName ||
      (user.loans &&
        user.loans.some(
          (loan) =>
            (loan.fromAccount &&
              loan.fromAccount.institutionName &&
              loan.fromAccount.institutionName
                .toLowerCase()
                .includes(institutionName.toLowerCase())) ||
            (loan.toAccount &&
              loan.toAccount.institutionName &&
              loan.toAccount.institutionName
                .toLowerCase()
                .includes(institutionName.toLowerCase()))
        ));

    // Matches account name or account number in either fromAccount or toAccount
    const matchesAccountFilter =
      (!accountName && !accountNumber) ||
      (user.loans &&
        user.loans.some(
          (loan) =>
            ((loan.fromAccount &&
              loan.fromAccount.accountName &&
              loan.fromAccount.accountName
                .toLowerCase()
                .includes(accountName.toLowerCase())) ||
              (loan.toAccount &&
                loan.toAccount.accountName &&
                loan.toAccount.accountName
                  .toLowerCase()
                  .includes(accountName.toLowerCase()))) &&
            ((loan.fromAccount &&
              loan.fromAccount.accountNumber &&
              loan.fromAccount.accountNumber
                .toLowerCase()
                .includes(accountNumber.toLowerCase())) ||
              (loan.toAccount &&
                loan.toAccount.accountNumber &&
                loan.toAccount.accountNumber
                  .toLowerCase()
                  .includes(accountNumber.toLowerCase())))
        ));

    // Return the user if all criteria match
    return (
      matchesSearchQuery &&
      matchesLoanStatus &&
      matchesLoanAmountRange &&
      matchesRepaymentFilter &&
      matchesInstitutionName &&
      matchesAccountFilter
    );
  });

  const filteredAllUsers = users.filter((user) => {
    const searchQueryLower = searchQuery.toLowerCase();

    return (
      user.firstName.toLowerCase().includes(searchQueryLower) ||
      user.lastName.toLowerCase().includes(searchQueryLower) ||
      user.email.toLowerCase().includes(searchQueryLower) ||
      user.loans.some((loan) =>
        loan.id.toString().toLowerCase().includes(searchQueryLower)
      )
    );
  });

  // Function to handle card click (navigate to user details)
  const handleCardClick = (user, userId) => {
    navigate(`/admin/userloanlist/${userId}`, { state: { user, profileData } });
  };
  const renderUserCard = (user) => (
    <div
      key={user.id}
      className="bg-[#F8F8F8] p-5 rounded-lg shadow border border-[#E5E5E5] min-h-[150px] cursor-pointer"
      onClick={() => handleCardClick(user, user.id)}
    >
      <div className="font-sans flex justify-between">
        <div className="flex flex-col text-left">
          <h3 className="font-sans text-lg font-semibold mb-1">
            {user.firstName} {user.lastName}
          </h3>
          <p className="font-sans text-gray-600 mb-1">{user.email}</p>
          <p className="font-sans text-gray-800 mb-1">
            Loans: {user.loans.length}
          </p>
        </div>
        <div className="flex flex-col space-y-2 justify-end md:mt-0 !mt-[75px] md:ml-0 -ml-[89px]">
          <span className="font-sans border-2 border-black font-bold text-black py-1  px-2 rounded-lg">
            {user?.loans && user.loans.length > 0
              ? user.loans.some((loan) => loan.status === "Pending")
                ? "Pending Loans" // Show this if there's any loan with status "Pending"
                : "No pending Loans" // Show this if there are loans with status "Approved" or "Rejected"
              : "No Loans"}
          </span>
        </div>
      </div>
    </div>
  );

  const uniqueValues = (arr, key) => {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1); // Reset to page 1 when a new search is performed
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={handleSearch}
        profileData={profileData}
      />
      <div className="font-sans flex flex-grow">
        {loading ? (
          <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
            <Loader />
          </div>
        ) : (
          // Display loader while data is loading
          <div className="w-full md:w-full bg-[#ffff] md:p-6 p-5">
            <div className="flex flex-col sm:flex-row w-full justify-between items-center">
              <h2 className="text-left text-xl md:text-[24px] font-bold font-sans">
                User Management
              </h2>

              <div className="flex items-center w-full sm:w-1/5 justify-between sm:justify-center  mb-3">
                {/* <div className="flex flex-col items-center  ">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={applyFilter}
                      onChange={handleFilterToggle}
                      className="mr-2 w-5 h-5"
                    />
                    Enable Filters
                  </label>
                </div> */}

                <div className="ml-[13rem]">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="relative p-1 bg-gray-200 rounded-full"
                  >
                    <CiMenuKebab size={30} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-5 top-10 md:mt-[8rem] mt-[4rem] md:w-[160px] w-[60vw] bg-white border rounded shadow-lg z-10 ">
                      <button
                        onClick={downloadPDF}
                        className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                      >
                        Export PDF
                      </button>
                      <button
                        onClick={downloadCSV}
                        className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                      >
                        Export CSV
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {applyFilter && (
              <div
                ref={sectionRef}
                className={`transition-all duration-500 ease-in-out overflow-hidden transform ${
                  applyFilter
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-5 opacity-0"
                }`}
                style={{
                  maxHeight: applyFilter ? "300px" : "0", // Animate height
                }}
              >
                <div className="flex font-sans items-center justify-around mb-3 mt-3">
                  <div className="w-full">
                    <div class="w-full overflow-x-scroll h-[40vh] sm:h-[17vh] sm:overflow-hidden flex flex-col sm:flex-row sm:flex-wrap lg:flex-row p-4 justify-between bg-white rounded-lg shadow-md space-y-6 lg:space-y-0 lg:space-x-6">
                      {/* Institution Name Dropdown */}
                      <div className="w-full md:w-[20%] lg:w-[13%]">
                        <label className="block text-sm font-semibold text-gray-600 mb-2">
                          Institution Name
                        </label>
                        <select
                          value={institutionName}
                          onChange={(e) =>
                            handleFilterChange(
                              "institutionName",
                              e.target.value
                            )
                          }
                          className="w-full p-3 border text-sm border-[#C4C4C4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5EB66E]"
                        >
                          <option value="">Select Institution</option>
                          {uniqueValues(dropdownOptions, "institutionName").map(
                            (option, index) => (
                              <option
                                key={index}
                                value={option.institutionName}
                              >
                                {option.institutionName}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      {/* Account Name Dropdown */}
                      <div className="w-full md:w-[20%] lg:w-[15%]">
                        <label className="block text-sm font-semibold text-gray-600 mb-2">
                          Account Name
                        </label>
                        <select
                          value={accountName}
                          onChange={(e) =>
                            handleFilterChange("accountName", e.target.value)
                          }
                          className="w-full p-3 border text-sm border-[#C4C4C4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5EB66E]"
                        >
                          <option value="">Select Account Name</option>
                          {uniqueValues(dropdownOptions, "accountName").map(
                            (option, index) => (
                              <option key={index} value={option.accountName}>
                                {option.accountName}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      {/* Account Number Dropdown */}
                      <div className="w-full md:w-[20%]  lg:w-[17%]">
                        <label className="block text-sm font-semibold text-gray-600 mb-2">
                          Account Number
                        </label>
                        <select
                          value={accountNumber}
                          onChange={(e) =>
                            handleFilterChange("accountNumber", e.target.value)
                          }
                          className="w-full p-3 border text-sm border-[#C4C4C4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5EB66E]"
                        >
                          <option value="">Select Account Number</option>
                          {uniqueValues(dropdownOptions, "accountNumber").map(
                            (option, index) => (
                              <option key={index} value={option.accountNumber}>
                                {option.accountNumber}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      {/* Loan Status Dropdown */}
                      <div className="w-full md:w-[15%] lg:w-[10%]">
                        <label className="block text-sm font-semibold text-gray-600 mb-2">
                          Loan Status
                        </label>
                        <select
                          value={loanStatus}
                          onChange={(e) =>
                            handleFilterChange("loanStatus", e.target.value)
                          }
                          className="w-full p-3 border text-sm border-[#C4C4C4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5EB66E]"
                        >
                          <option value="All">All</option>
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>

                      {/* Loan Amount Range */}
                      <div className="w-full sm:w-1/5">
                        <label className="block text-sm font-semibold text-gray-600 mb-2">
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

                      {/* Clear Filters Button */}
                      <div className="w-[20vw] h-[5vh] md:w-auto lg:w-[10%] md:mt-0 flex items-center lg:justify-end justify-center">
                        <button
                          onClick={clearFilters}
                          disabled={
                            accountName == "" &&
                            accountNumber == "" &&
                            institutionName == "" &&
                            loanStatus == "All" &&
                            loanMaxAmount == 2000 &&
                            loanMinAmount == 500
                          }
                          className={`w-[20vw] h-[6vh] md:w-auto lg:px-5 lg:py-3 text-sm rounded-md text-white 
      ${
        accountName == "" &&
        accountNumber == "" &&
        institutionName == "" &&
        loanStatus == "All" &&
        loanMaxAmount == 2000 &&
        loanMinAmount == 500
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-[#5EB66E] hover:bg-[#4FA75E]"
      }`}
                        >
                          Clear Filters
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {applyFilter
                ? (filteredUsers || []).map((user) => renderUserCard(user))
                : (filteredAllUsers || []).map((user) => renderUserCard(user))}
            </div>
            <div
              className={`flex items-center justify-center mt-6 ${
                (!loading && applyFilter && filteredUsers.length === 0) ||
                filteredAllUsers.length === 0
                  ? "h-[60vh]"
                  : "h-0"
              }`}
            >
              {!loading && applyFilter ? (
                filteredUsers.length === 0 ? (
                  <div>
                    <p className="text-center text-gray-500 text-lg">
                      No users found.
                    </p>
                  </div>
                ) : null
              ) : filteredAllUsers.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">
                  No users found.
                </p>
              ) : null}
            </div>

            {applyFilter ? (
              <div className="flex items-center justify-center mt-6 space-x-4">
                <button
                  onClick={() =>
                    setPage((prevPage) => Math.max(prevPage - 1, 1))
                  }
                  disabled={page === 1}
                  className={`px-4 py-2 text-lg rounded-md transition ${
                    page === 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#5EB66E] text-white hover:bg-green-600"
                  }`}
                >
                  Previous
                </button>
                <span className="text-lg text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setPage((prevPage) =>
                      prevPage < totalPages &&
                      (applyFilter ? filteredUsers : filteredAllUsers)
                        .length === 10
                        ? prevPage + 1
                        : prevPage
                    )
                  }
                  disabled={
                    (applyFilter ? filteredUsers : filteredAllUsers).length <
                      10 || page === totalPages
                  }
                  className={`px-4 py-2 text-lg rounded-md transition ${
                    filteredUsers.length < 10 || page === totalPages
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#5EB66E] text-white hover:bg-green-600"
                  }`}
                >
                  Next
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center mt-6 space-x-4">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className={`px-4 py-2 text-lg rounded-md transition ${
                    page === 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#5EB66E] text-white hover:bg-green-600"
                  }`}
                >
                  Previous
                </button>
                <span className="text-lg text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className={`px-4 py-2 text-lg rounded-md transition ${
                    page === totalPages
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#5EB66E] text-white hover:bg-green-600"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
