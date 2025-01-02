import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa"; // Example icon for placeholder
// import emptyImage from "../../assets/images/no-camera.png"

const emptyImage = "https://res.cloudinary.com/drgheojrx/image/upload/v1717502336/Image_39_vgpsxk.png"
const ComplianceChecklist = ({data}) => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [modalData, setModalData] = useState(null);
  console.log("data------------",data);

const dummyImage = "https://via.placeholder.com/150"; // Fallback dummy image URL

const encodedUrl = encodeURIComponent("https://documentary-assets-production-sandbox-cognito-us-west-2.s3.us-west-2.amazonaws.com/flwses_2dr4A6FZKMHGr6/2/back.jpeg?response-content-disposition=attachment%3B%20filename%3Doriginal_back.jpeg&response-content-type=image%2Fjpeg&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIATAVOPDHKSADOTAWM%2F20241227%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20241227T103733Z&X-Amz-Expires=60&X-Amz-SignedHeaders=host&X-Amz-Signature=12e81e7b0e30332a5e8561fa8760b979bcf37ebbc33fcc6bbfbca7903471fc5a");
console.log(encodedUrl)
  // Open the modal with specific data
  const openModal = (section) => {
    setSelectedSection(section);
    switch (section) {
      case "KYC":
        setModalData({
          ...data.data.kyc_details,
          documentary_verification: data.data.documentary_verification,
          selfie_check: data.data.selfie_check,
        });
        break;
      case "Anti-Fraud":
        setModalData(data.data.anti_fraud_details || { message: "No data available for Anti-Fraud Checks." });
        break;
      case "Regulatory":
        setModalData(data.data.regulatory_details || { message: "No data available for Regulatory Requirements." });
        break;
      default:
        setModalData(null);
    }
  };

  // Close the modal
  const closeModal = () => {
    setSelectedSection(null);
    setModalData(null);
  };

const capitalizeFirstLetter = (str) => {
    if (!str) return ""; // Handle null or undefined
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  
 
  // Rendering with camel case transformation
const renderKYCDetails = (modalData) => {
    const { status, summary, additional_info, documentary_verification, selfie_check } = modalData;
  
    return (
      <div className="space-y-6 p-4 bg-gray-50 rounded-lg shadow-lg">
        {/* Status */}
        <div className="mb-4">
          <span className="font-bold text-xl text-gray-800">Verification Status:</span>{" "}
          <span
            className={`px-3 py-1 rounded-full ${
              status === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {capitalizeFirstLetter(status) || "N/A"}
          </span>
        </div>
  
       {/* Summary Section */}
      {/* Summary Section */}
      <div className="mb-6 w-full">
        <h3 className="font-bold text-xl text-gray-900 mb-4">Summary</h3>
        <div className="bg-gray-50 p-6 rounded-lg shadow-md w-[80%]">
          {summary ? (
            Object.entries(summary).map(([key, value]) => (
              value && (
                <div key={key} className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-2 mb-2 w-full">
                  <span className="capitalize font-semibold text-gray-700 md:w-1/3">{key.replace(/_/g, " ")}:</span>
                  <span className="text-gray-800 font-medium md:w-2/3 md:text-right mt-1 md:mt-0">
                  {value === "no_match" ? "Not Matched" : capitalizeFirstLetter(value)}
                  </span>
                </div>
              )
            ))
          ) : (
            <p className="text-gray-500 italic">No summary data available.</p>
          )}
        </div>
      </div>

       {/* Additional Info Section */}
        <div className="mb-6 w-full">
          <h3 className="font-bold text-xl text-gray-900 mb-4">Additional Info</h3>
          <div className="bg-gray-50 p-6 rounded-lg shadow-md w-[80%]">
            {additional_info ? (
              Object.entries(additional_info).map(([key, value]) => (
                value && (
                  <div key={key} className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-2 mb-2">
                    <span className="capitalize font-semibold text-gray-700 md:w-1/3">{key.replace(/_/g, " ")}:</span>
                    <span className="text-gray-800 font-medium md:w-2/3 md:text-right mt-1 md:mt-0">
                  
                    {value === "no_match" ? "Not Matched" : capitalizeFirstLetter(value)}
                    </span>
                  </div>
                )
              ))
            ) : (
              <p className="text-gray-500 italic">No additional information available.</p>
            )}
          </div>
        </div>


        {/* Documentary Verification Section */}
        <div>
          <h3 className="font-bold text-lg text-gray-900 mb-4">Documentary Verification</h3>
          {documentary_verification === null ? (
            <div className="grid grid-cols-2 gap-6 bg-white p-4 rounded-lg shadow">
            <div className="flex flex-col items-center hover:scale-105 transition-transform">
              <img
              //   src={doc.images.original_front}
              src={emptyImage}
                alt="Document Front"
                className="rounded-lg shadow-lg border border-gray-200"
              />
              <p className="text-sm text-gray-500 mt-2">Front Side</p>
            </div>
            <div className="flex flex-col items-center hover:scale-105 transition-transform">
              <img
               src={emptyImage}
              //   src={doc.images.original_back}
                alt="Document Back"
                className="rounded-lg shadow-lg border border-gray-200"
              />
              <p className="text-sm text-gray-500 mt-2">Back Side</p>
            </div>
          </div>
          ):(
            <>
            {documentary_verification?.map((doc, index) => (
            <div key={index} className="grid grid-cols-2 gap-6 bg-white p-4 rounded-lg shadow">
              <div className="flex flex-col items-center hover:scale-105 transition-transform">
                <img
                //   src={doc.images.original_front}
                src={doc.images.original_front}
                  alt="Document Front"
                  className="rounded-lg shadow-lg border border-gray-200"
                />
                <p className="text-sm text-gray-500 mt-2">Front Side</p>
              </div>
              <div className="flex flex-col items-center hover:scale-105 transition-transform">
                <img
                 src={doc.images.original_back}
                //   src={doc.images.original_back}
                  alt="Document Back"
                  className="rounded-lg shadow-lg border border-gray-200"
                />
                <p className="text-sm text-gray-500 mt-2">Back Side</p>
              </div>
            </div>
          ))}
            </>
          )}
        </div>
  
        {/* Selfie Check Section */}
        <div>
      <h3 className="font-bold text-lg text-gray-900 mb-4">Selfie Check</h3>
      {selfie_check?.selfies?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {selfie_check.selfies.map((selfie, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 hover:scale-105 transition-transform"
            >
              <div className="w-32 h-32 rounded-full bg-gray-200 shadow-lg overflow-hidden flex items-center justify-center">
                {selfie.capture?.image_url ? (
                  <img
                    src={selfie.capture.image_url}
                    alt="Selfie"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="text-gray-400 w-full h-full" />
                )}
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  {selfie.capture?.image_url ? "Selfie Image" : "Placeholder Image"}
                </p>

                {selfie.capture?.video_url && (
                  <div className="mt-4">
                    <video
                      controls
                      className="w-48 rounded-lg shadow-lg border border-gray-200"
                    >
                      <source src={selfie.capture.video_url} type="video/webm" />
                      Your browser does not support the video tag.
                    </video>
                    <p className="text-sm text-gray-500 mt-2">Selfie Video</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center">
          <FaUserCircle className="text-gray-400 w-32 h-32" />
          <p className="text-gray-500 mt-4">No selfies found</p>
        </div>
  )}
</div>

      </div>
    );
  };

const renderAntiFraudDetails = (antiFraudDetails) => {
    if (!antiFraudDetails) {
      return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
          <p className="text-gray-500">No data available for Anti-Fraud Checks.</p>
        </div>
      );
    }
  
    const {
      status,
      behavior,
      email,
      phone,
      devices,
      identity_abuse_signals: identityAbuseSignals,
    } = antiFraudDetails;
  
    return (
      <div className="space-y-6 p-4 bg-gray-50 rounded-lg shadow-lg">
        {/* Status */}
        <div>
          <span className="font-bold text-xl text-gray-800">Status:</span>{" "}
          <span
            className={`px-3 py-1 rounded-full ${
              status === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {status || "N/A"}
          </span>
        </div>
  
        {/* Behavior Section */}
        <div>
          <h3 className="font-bold text-lg text-gray-900 mb-4">Behavior</h3>
          <div className="bg-gray-50 p-6 rounded-lg shadow-md w-[80%]">
          {behavior  &&
            Object.entries(behavior ).map(([key, value]) => (
              <div key={key} className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-2 mb-2">
                <span className="capitalize font-semibold text-gray-600">
                  {key.replace(/_/g, " ")}:
                </span>
                <span className="text-gray-800">
                  {value ? (value === "no_match" ? "Not Matched" : capitalizeFirstLetter(value)) : "N/A"}
                </span>
              </div>
            ))}
        </div>

        </div>
  
        {/* Devices Section */}
        <div>
          <h3 className="font-bold text-lg text-gray-900 mb-4">Devices</h3>
          <div className="bg-gray-50 p-6 rounded-lg shadow-md w-[80%]">
  {devices && devices.length > 0 ? (
    devices.map((device, index) => (
      <div key={index} className="space-y-2">
        {Object.entries(device).map(([key, value]) => (
          <div key={key} className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-2 mb-2">
            <span className="capitalize font-semibold text-gray-600 md:w-1/3">
              {key.replace(/_/g, " ")}:
            </span>
            <span className="text-gray-800 font-medium md:w-2/3 md:text-right mt-1 md:mt-0">
              {value ? (value === "no_match" ? "Not Matched" : capitalizeFirstLetter(value)) : 0}
            </span>
          </div>
        ))}
      </div>
    ))
  ) : (
    <p className="text-gray-500 italic">No devices available.</p>
  )}
</div>

        </div>
  
        {/* Identity Abuse Signals Section */}
        <div>
          <h3 className="font-bold text-lg text-gray-900 mb-4">Identity Abuse Signals</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 bg-white p-4 rounded-lg shadow w-[80%]">
  {identityAbuseSignals ? (
    Object.entries(identityAbuseSignals).map(([key, value]) =>
      value ? (
        <div key={key} className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-2 mb-2">
          <span className="capitalize font-semibold text-gray-600 md:w-1/3">
            {key.replace(/_/g, " ")}:
          </span>
          <span className="text-gray-800 md:w-2/3 md:text-right mt-1 md:mt-0">
            {value === "no_match" ? "Not Matched" : capitalizeFirstLetter(JSON.stringify(value))}
          </span>
        </div>
      ) : null
    )
  ) : (
    <p className="text-gray-500 italic col-span-2">No identity abuse signals available.</p>
  )}
</div>

        </div>
      </div>
    );
  };
  
const renderRegulatoryDetails = (regulatoryDetails) => {
    if (!regulatoryDetails) {
      return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-lg w-[80%]">
          <p className="text-gray-500">No data available for Regulatory Requirements.</p>
        </div>
      );
    }
  
    // Render the regulatory details if available
    return (
      <div className="space-y-6 p-4 bg-gray-50 rounded-lg shadow-lg w-[80%]">
        <h3 className="font-bold text-lg text-gray-900 mb-4">Regulatory Details</h3>
        <div className="bg-white p-4 rounded-lg shadow">
          <p>No data available for Regulatory Requirements.</p>
        </div>
      </div>
    );
  };

  // Render the modal content based on section
  
  const renderModalContent = () => {
    if (!modalData) {
      return <p className="text-gray-500">No details available for this section.</p>;
    }

    if (selectedSection === "KYC") {
      return renderKYCDetails(modalData);
    }

    if (selectedSection === "Anti-Fraud") {
        return renderAntiFraudDetails(modalData);
      }
    
    if (selectedSection === "Regulatory") {
        return renderRegulatoryDetails(modalData);
    }

    return <p className="text-gray-500">Details for {selectedSection} coming soon.</p>;
  };
console.log("data?.message",data?.message);

  return (
    <>
      {data?.data?.plaid_idv_status
        === "success" ? (
        <div className="space-y-4 w-full">
          <div className="flex justify-between">
            <span className="text-[#242424] font-sans text-[14px] font-semibold">KYC</span>
            <button
              onClick={() => openModal("KYC")}
              className="px-5 py-1 font-sans border-2 font-bold rounded-lg text-[#242424] border-[#242424]"
            >
              View
            </button>
          </div>
          <div className="flex justify-between">
            <span className="font-sans text-[#242424] text-[14px] font-semibold">
              Anti-Fraud Checks
            </span>
            <button
              onClick={() => openModal("Anti-Fraud")}
              className="font-sans px-5 py-1 border-2 font-bold rounded-lg text-[#242424] border-[#242424]"
            >
              View
            </button>
          </div>
          <div className="flex justify-between">
            <span className="font-sans text-[#242424] text-[14px] font-semibold">
              Regulatory Requirements
            </span>
            <button
              onClick={() => openModal("Regulatory")}
              className="font-sans px-5 py-1 border-2 font-bold rounded-lg text-[#242424] border-[#242424]"
            >
              View
            </button>
          </div>
        </div>
      ) : (
      
        <p className="text-center text-red-600 font-sans text-lg font-semibold mt-12 ">
          Identity Verification Failed
        </p>
    
      
      )}

      {/* Modal */}
      {selectedSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className={`relative bg-white p-6 rounded-lg shadow-lg ${
              selectedSection === "KYC" ? "w-1/2 h-4/5" : "w-1/2 h-4/5"
            }  overflow-y-scroll`}>
            <button
              onClick={closeModal}
              className="absolute m-5 top-4 right-4 px-3 py-1 text-white bg-green-500 rounded-full hover:bg-green-600"
            >
              Close
            </button>
            <h2 className="text-2xl font-bold mb-4 m-5">{selectedSection} Details</h2>
            {renderModalContent()}
          </div>
        </div>
      )}
    </>
  );
};

export default ComplianceChecklist;