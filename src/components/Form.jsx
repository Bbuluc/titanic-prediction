// Renders the Titanic Survival Prediction form.
// Users can input passenger details, and the form sends a POST
// request to the FastAPI backend to get survival predictions.
//
// Features:
// - Inputs: name, age, gender, class, siblings/spouses, parents/children, fare, embarkation point
// - Range slider for age, number inputs for numeric values
// - Handles loading, errors, and prediction results
// - Displays prediction status and probabilities
// -------------------------------------------------------------

import { useState } from "react";
import PredictIcon from "./icons/PredictIcon";

export default function FormSection() {
  // State for all form values
  const [formData, setFormData] = useState({
    age: 30,
    gender: "",
    pclass: "",
    sibsp: 0,
    parch: 0,
    embarked: "",
    fare: 7.25,
    name: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle change for all inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    console.log(`${import.meta.env.VITE_API_URL}/predict`)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pclass: formData.pclass,
          gender: formData.gender,
          age: formData.age,
          sibsp: parseInt(formData.sibsp),
          parch: parseInt(formData.parch),
          fare: parseFloat(formData.fare),
          embarked: formData.embarked,
          name: formData.name || "Unknown",
        }),
      });

      if (!response.ok) {
        throw new Error("Prediction failed");
      }

      const data = await response.json();
      setPrediction(data);
      console.log("Prediction:", data);
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-md mx-auto my-10 bg-white rounded-2xl shadow-lg p-6 text-white">
      <h2 className="text-2xl font-semibold text-center text-blue-800 mb-6">
        Titanic Survival Predictor
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-400"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., John Doe"
            maxLength={20}
            className="w-full mt-1 p-2 rounded-md text-gray-500 border border-gray-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Age - Range Slider */}
        <div>
          <label
            htmlFor="age"
            className="block text-sm font-medium text-gray-400"
          >
            Age:{" "}
            <span className="text-gray-500 font-semibold">{formData.age}</span>
          </label>
          <input
            type="range"
            id="age"
            name="age"
            min="0"
            max="100"
            value={formData.age}
            onChange={handleChange}
            className="w-full mt-2 accent-blue-800"
          />
        </div>

        {/* Gender */}
        <div>
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-gray-400"
          >
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 rounded-md text-gray-500 border border-gray-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Passenger Class */}
        <div>
          <label
            htmlFor="pclass"
            className="block text-sm font-medium text-gray-400"
          >
            Passenger Class
          </label>
          <select
            id="pclass"
            name="pclass"
            value={formData.pclass}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 rounded-md text-gray-500 border border-gray-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="">Select class</option>
            <option value="1">1st Class</option>
            <option value="2">2nd Class</option>
            <option value="3">3rd Class</option>
          </select>
        </div>

        {/* Fare */}
        <div>
          <label
            htmlFor="fare"
            className="block text-sm font-medium text-gray-400"
          >
            Fare ($)
          </label>
          <input
            type="number"
            id="fare"
            name="fare"
            min="0"
            step="0.01"
            value={formData.fare}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 rounded-md text-gray-500 border border-gray-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Siblings/Spouses Aboard */}
        <div>
          <label
            htmlFor="sibsp"
            className="block text-sm font-medium text-gray-400"
          >
            Siblings / Spouses Aboard
          </label>
          <input
            type="number"
            id="sibsp"
            name="sibsp"
            min="0"
            max="10"
            value={formData.sibsp}
            onChange={handleChange}
            className="w-full mt-1 p-2 rounded-md text-gray-500 border border-gray-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Parents/Children Aboard */}
        <div>
          <label
            htmlFor="parch"
            className="block text-sm font-medium text-gray-400"
          >
            Parents / Children Aboard
          </label>
          <input
            type="number"
            id="parch"
            name="parch"
            min="0"
            max="10"
            value={formData.parch}
            onChange={handleChange}
            className="w-full mt-1 p-2 rounded-md text-gray-500 border border-gray-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
  
        {/* Embarkation Point */}
        <div>
          <label
            htmlFor="embarked"
            className="block text-sm font-medium text-gray-400"
          >
            Embarkation Point
          </label>
          <select
            id="embarked"
            name="embarked"
            value={formData.embarked}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 rounded-md text-gray-500 border border-gray-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="">Select port</option>
            <option value="C">Cherbourg (C)</option>
            <option value="Q">Queenstown (Q)</option>
            <option value="S">Southampton (S)</option>
          </select>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Prediction Result */}
        {prediction && (
          <div className="p-4 bg-blue-100 border border-blue-800 rounded-md">
            <h3 className="font-semibold text-blue-800 mb-2">
              Prediction Result:
            </h3>
            
            <p className="text-gray-700">
              <strong>Status:</strong>{" "}
              {prediction.survived === 1 ? "✅ Would Survive" : "❌ Would Not Survive"}
            </p>
            <p className="text-gray-700">
              <strong>Survival Probability:</strong>{" "}
              {(prediction.survival_probability * 100).toFixed(1)}%
            </p>
            <p className="text-gray-700">
              <strong>Death Probability:</strong>{" "}
              {(prediction.death_probability * 100).toFixed(1)}%
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex mx-auto w-30 mt-4 bg-blue-800 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition gap-2 hover:scale-105 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Predicting..." : "Predict"}
          <PredictIcon />
        </button>
      </form>
    </section>
  );
}