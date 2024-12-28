// "use client";

// import React, { useState } from "react";
// import Report from "../global_components/report";

// const Report = () => {
//     const [description, setDescription] = useState("");
//     const [errorType, setErrorType] = useState("");

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log("Report submitted:", { description, errorType });
//         // Clear form after submission
//         setDescription("");
//         setErrorType("");
//     };

//     return (
//         <div className="max-w-lg mx-auto bg-white shadow-md rounded-md p-6 mt-10">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">Report an Issue</h2>
//             <form onSubmit={handleSubmit}>
//                 <div className="mb-4">
//                     <label
//                         htmlFor="errorType"
//                         className="block text-sm font-medium text-gray-700"
//                     >
//                         Error Type
//                     </label>
//                     <select
//                         id="errorType"
//                         value={errorType}
//                         onChange={(e) => setErrorType(e.target.value)}
//                         className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//                         required
//                     >
//                         <option value="" disabled>
//                             Select an error type
//                         </option>
//                         <option value="UI Bug">UI Bug</option>
//                         <option value="Functional Error">Functional Error</option>
//                         <option value="Performance Issue">Performance Issue</option>
//                         <option value="Other">Other</option>
//                     </select>
//                 </div>
//                 <div className="mb-4">
//                     <label
//                         htmlFor="description"
//                         className="block text-sm font-medium text-gray-700"
//                     >
//                         Description
//                     </label>
//                     <textarea
//                         id="description"
//                         value={description}
//                         onChange={(e) => setDescription(e.target.value)}
//                         placeholder="Describe the issue..."
//                         className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//                         rows="4"
//                         required
//                     ></textarea>
//                 </div>
//                 <button
//                     type="submit"
//                     className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
//                 >
//                     Submit Report
//                 </button>
//             </form>
//         </div>
        
//     );
// };

// export default Report;
