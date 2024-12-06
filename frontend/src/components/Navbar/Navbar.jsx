import React, { useState } from "react";
import ProfileInfo from "../Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";

const Navbar = ({ userInfo, onSearchNote, handleClearSearch, condition }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    } else {
      handleClearSearch();
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  };

  return (
    <div className="bg-white flex flex-wrap items-center justify-between px-6 py-2 drop-shadow gap-y-3 md:gap-y-0">
      <h2 className="text-xl order-1 md:order-1 font-medium text-black text-center md:text-left py-2">Notes</h2>
      {condition.search === "show" ? (
        <SearchBar
          value={searchQuery}
          onChange={({ target }) => {
            setSearchQuery(target.value);
          }}
          onClearSearch={onClearSearch}
          handleSearch={handleSearch}
        />
      ) : (
        ""
      )}
      {condition.user === "show" ? (
        <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
      ) : (
        ""
      )}
    </div>
  );
};

export default Navbar;
