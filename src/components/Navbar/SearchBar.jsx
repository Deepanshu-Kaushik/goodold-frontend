import { SearchOutlined } from "@ant-design/icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { Link } from "react-router-dom";

export default function SearchBar() {
  const { token } = localStorage;
  const [searchProfile, setSearchProfile] = useState("");
  const [foundUsers, setFoundUsers] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchProfile("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setFoundUsers([{ _id: 0, text: "Loading...." }]);
    setSearchProfile(value);
    fetchSearchResults(value);
  };

  const fetchSearchResults = useCallback(
    debounce(async (text) => {
      if (!text.trim()) return;
      try {
        const results = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/search-user`,
          {
            method: "POST",
            body: JSON.stringify({ query: text.trim() }),
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await results.json();
        if (data.length) setFoundUsers(data);
        else setFoundUsers([{ _id: 0, text: "No user found!" }]);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setFoundUsers([{ _id: 0, text: "Error fetching results" }]);
      }
    }, 1000),
    []
  );

  return (
    <div className="relative" ref={searchRef}>
      <div
        className="application-grey p-0.5 md:p-2 rounded-xl flex items-center"
        title="Search for a profile"
      >
        <input
          className="application-grey outline-none ml-2 placeholder:text-sm"
          type="text"
          placeholder="Search..."
          value={searchProfile}
          onChange={handleInputChange}
        />
        <SearchOutlined
          style={{
            paddingRight: "10px",
            cursor: "pointer",
          }}
        />
      </div>
      {searchProfile.trim() && (
        <div className="absolute flex flex-col bg-white w-full top-12 rounded-lg shadow-xl shadow-slate-400 border-e-2 border-l-2 border-t-2 border-slate-300 max-h-screen overflow-y-auto">
          {foundUsers?.map((ele) =>
            ele?._id !== 0 ? (
              <Link
                to={"/profile/" + ele?._id}
                key={ele?._id}
                className="hover:bg-slate-200 p-4 py-2 gap-2 w-full flex items-center"
                onClick={() => setSearchProfile("")}
              >
                <img
                  src={ele.userPicturePath}
                  className="size-8 rounded-full object-cover"
                />
                <h1>
                  {ele.firstName} {ele.lastName}
                </h1>
              </Link>
            ) : (
              <span
                key={ele?._id}
                className="text-red-600 w-full text-center p-2"
              >
                {ele.text}
              </span>
            )
          )}
        </div>
      )}
    </div>
  );
}
