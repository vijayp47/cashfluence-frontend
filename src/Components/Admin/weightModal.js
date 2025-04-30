import React, { useState, useEffect } from 'react';
import { updateWeightConfig } from "../../API/apiServices";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PercentInput = ({ label, name, value, onChange }) => (
  <label className="flex flex-col text-sm font-medium text-gray-700">
    {label}
    <div className="relative">
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 pr-10 pl-3 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {value !== "" && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
          %
        </span>
      )}
    </div>
  </label>
);

const WeightModal = ({ isOpen, closeModal, weights, setWeights }) => {
  const [editedWeights, setEditedWeights] = useState(weights);

  useEffect(() => {
    if (isOpen) {
      setEditedWeights(weights);
    }
  }, [isOpen, weights]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedWeights((prevState) => ({
      ...prevState,
      [name]: parseFloat(value) || 0, // ensures a number is stored
    }));
  };

  const handleSubmit = async () => {
    try {
      const updatedWeights = await updateWeightConfig(editedWeights);
      setWeights(updatedWeights);
    
      toast.success("Weights updated successfully!");
      setTimeout(() => {
        closeModal(); // Close modal after toast notification
      }, 2500);
    } catch (error) {
      console.error("Error updating weight config:", error);
      toast.error("Error updating weight config:", error);
    }
  };

  return isOpen ? (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
            Manage Weights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Section 1: Influencer Score Weights */}
  <h3 className="col-span-2 text-lg font-semibold text-gray-800 mb-2">Influencer Score Weights</h3>
  
  <PercentInput
    label="Engagement Rate:"
    name="influencer_engagementRate"
    value={editedWeights?.influencer_engagementRate}
    onChange={handleChange}
  />
  <PercentInput
    label="Income Consistency:"
    name="influencer_incomeConsistency"
    value={editedWeights?.influencer_incomeConsistency}
    onChange={handleChange}
  />
  <PercentInput
    label="Platform Diversity:"
    name="influencer_platformDiversity"
    value={editedWeights?.influencer_platformDiversity}
    onChange={handleChange}
  />
  <PercentInput
    label="Content Quality:"
    name="influencer_contentQuality"
    value={editedWeights?.influencer_contentQuality}
    onChange={handleChange}
  />

  {/* Section 2: Interest Rate */}
  <h3 className="col-span-2 text-lg font-semibold text-gray-800  mt-2">
  Interest Rate Weights (Calculated using Payment History and Influencer Score weights)
</h3>
<p className="col-span-2 text-sm text-gray-600 mb-2">
  The Interest Rate is calculated by considering the weights of Payment History and Influencer Score. These weights determine the final score for calculating the interest rate.
</p>

  <PercentInput
    label="Payment History:"
    name="rate_paymentHistory"
    value={editedWeights?.rate_paymentHistory}
    onChange={handleChange}
  />
  <PercentInput
    label="Influencer Score:"
    name="rate_influencerScore"
    value={editedWeights?.rate_influencerScore}
    onChange={handleChange}
  />
</div>


          <div className="flex justify-end mt-6 gap-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-lg bg-[#5EB66E] text-white hover:bg-[#4FA75E] shadow-md transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div>
        {/* Moved ToastContainer outside of the modal */}
        <ToastContainer position="top-center" autoClose={2000} />
      </div>
    </>
  ) : null;
};

export default WeightModal;
