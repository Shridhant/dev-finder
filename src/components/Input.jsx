import React, { useState } from "react";

function Input({ gitsearch }) {
  const [val, setVal] = useState("");

  function handleChange(e) {
    setVal(e.target.value);
  }

  function search() {
    gitsearch(val);
  }

  return (
    <div>
      <div className="flex justify-center items-center mt-5">
        <div className="w-full max-w-sm min-w-[200px] relative mt-4">
          <div className="relative">
            <input
              className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 h-[50px] rounded-md pl-3 pr-20 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              placeholder="Enter your GitHub Name"
              onChange={handleChange}
              value={val}
            />
            <button
              onClick={search} // Pass the function reference, not the invocation
              className="absolute right-1 top-2.5 rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Input;
