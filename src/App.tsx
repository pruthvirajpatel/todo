import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div 
      className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6"
      data-testid="app-container"
    >
      {/* Logos */}
      <div className="flex gap-6 mb-8" data-testid="logos-section">
        <a 
          href="https://vite.dev" 
          target="_blank" 
          rel="noopener noreferrer"
          data-testid="vite-link"
        >
          <img 
            src={viteLogo} 
            className="h-20 w-20" 
            alt="Vite logo"
            data-testid="vite-logo"
          />
        </a>
        <a 
          href="https://react.dev" 
          target="_blank" 
          rel="noopener noreferrer"
          data-testid="react-link"
        >
          <img
            src={reactLogo}
            className="h-20 w-20 animate-spin-slow"
            alt="React logo"
            data-testid="react-logo"
          />
        </a>
      </div>

      <h1 
        className="text-5xl font-extrabold mb-6 text-gray-900"
        data-testid="main-heading"
      >
        Vite + React
      </h1>

      {/* Card */}
      <div 
        className="bg-white shadow-lg rounded-xl p-8 flex flex-col items-center mb-6"
        data-testid="counter-card"
      >
        <button
          onClick={() => setCount((count) => count + 1)}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          data-testid="counter-button"
        >
          count is {count}
        </button>
        <p className="mt-4 text-gray-500 text-center">
          Edit <code className="bg-gray-100 px-1 rounded">src/App.tsx</code> and
          save to test HMR
        </p>
      </div>

      <p className="text-gray-600 mb-8" data-testid="instruction-text">
        Click on the Vite and React logos to learn more
      </p>

      {/* Tailwind example */}
      <div 
        className="bg-white shadow-md rounded-xl p-8 text-center"
        data-testid="tailwind-demo"
      >
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Hello Tailwind + React!
        </h1>
        <p className="text-gray-700">Your setup is working 🎉</p>
      </div>
    </div>
  );
}

export default App;
