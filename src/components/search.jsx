import React from "react";
import Button from "./button";
import "./styles/search.css";

function Search({ className, userNav__search }) {
  return (
    <div className={`${userNav__search} navbar__search`}>
      <input
        className={`${className} nav-search`}
        type="search"
        placeholder="What service are you looking for today?"
      />
      <div className="btn-nav">
        <Button>
          <i class="fa fa-search" aria-hidden="true"></i>
        </Button>
      </div>
    </div>
  );
}

export default Search;
