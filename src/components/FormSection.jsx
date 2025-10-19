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
  });

  // Handle change for all inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // Later: send this data to backend (FastAPI / Flask)
  };

  return (
    <section className="max-w-md mx-auto my-10 bg-gray-800 rounded-2xl shadow-lg p-6 text-white">
      <h2 className="text-2xl font-semibold text-center text-blue-400 mb-6">
        Passenger Information
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Age - Range Slider */}
        <div>
          <label
            htmlFor="age"
            className="block text-sm font-medium text-gray-300"
          >
            Age:{" "}
            <span className="text-blue-300 font-semibold">{formData.age}</span>
          </label>
          <input
            type="range"
            id="age"
            name="age"
            min="0"
            max="100"
            value={formData.age}
            onChange={handleChange}
            className="w-full mt-2 accent-blue-400"
          />
        </div>

        {/* Gender */}
        <div>
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-gray-300"
          >
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full mt-1 p-2 rounded-md bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
            className="block text-sm font-medium text-gray-300"
          >
            Passenger Class
          </label>
          <select
            id="pclass"
            name="pclass"
            value={formData.pclass}
            onChange={handleChange}
            className="w-full mt-1 p-2 rounded-md bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="">Select class</option>
            <option value="1">1st Class</option>
            <option value="2">2nd Class</option>
            <option value="3">3rd Class</option>
          </select>
        </div>

        {/* Siblings/Spouses Aboard */}
        <div>
          <label
            htmlFor="sibsp"
            className="block text-sm font-medium text-gray-300"
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
            className="w-full mt-1 p-2 rounded-md bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Parents/Children Aboard */}
        <div>
          <label
            htmlFor="parch"
            className="block text-sm font-medium text-gray-300"
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
            className="w-full mt-1 p-2 rounded-md bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Embarkation Point */}
        <div>
          <label
            htmlFor="embarked"
            className="block text-sm font-medium text-gray-300"
          >
            Embarkation Point
          </label>
          <select
            id="embarked"
            name="embarked"
            value={formData.embarked}
            onChange={handleChange}
            className="w-full mt-1 p-2 rounded-md bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="">Select port</option>
            <option value="C">Cherbourg (C)</option>
            <option value="Q">Queenstown (Q)</option>
            <option value="S">Southampton (S)</option>
          </select>
        </div>

        <button
          type="submit"
          className="flex mx-auto w-30 mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition  gap-2"
        >
          Predict
          <PredictIcon />
        </button>
      </form>
    </section>
  );
}
