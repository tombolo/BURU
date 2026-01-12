import React, { useState } from "react";

const StateSelector = ({ states }) => {
  const [selectedState, setSelectedState] = useState("");
  const [showAllStates, setShowAllStates] = useState(false);

  const displayedStates = showAllStates ? states : states.slice(0, 10);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Select Your State</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search states..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          />
          {selectedState && (
            <button
              onClick={() => setSelectedState("")}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-4">
        {displayedStates
          .filter((state) =>
            state.toLowerCase().includes(selectedState.toLowerCase())
          )
          .map((state) => (
            <button
              key={state}
              className="p-2 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition duration-200"
              onClick={() =>
                (window.location.href = `/licenses/${state.toLowerCase()}`)
              }
            >
              {state}
            </button>
          ))}
      </div>

      {!showAllStates && states.length > 10 && (
        <button
          onClick={() => setShowAllStates(true)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          + Show all {states.length} states
        </button>
      )}
    </div>
  );
};

export default StateSelector;
