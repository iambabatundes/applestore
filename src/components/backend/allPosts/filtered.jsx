import React, { useEffect } from "react";
import Button from "../button";

export default function Filtered({
  allPost,
  published,
  draft,
  trash,
  setActiveTab,
  activeTab,
  selectedStatus, // Use selectedStatus prop
  setSelectedStatus,
  setSelectAll,
  resetIndividualPostCheckboxes, // Add this prop
  setSearchQuery, // Add setSearchQuery prop
  searchQuery, // Add searchQuery prop
}) {
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  useEffect(() => {
    // Reset individual post checkboxes when switching tabs
    resetIndividualPostCheckboxes();
  }, [activeTab]);

  return (
    <section>
      <div className="allPost-filtered">
        <ul className="allPost__filter">
          <li
            className={activeTab === "all" ? "active" : ""}
            onClick={() => {
              setActiveTab("all");
              selectedStatus !== "all" && setSelectedStatus("all");
              setSelectAll(false);
            }}
          >
            All <span>({allPost})</span>
          </li>

          {published > 0 && (
            <>
              <span>|</span>
              <li
                className={activeTab === "published" ? "active" : ""}
                onClick={() => {
                  setActiveTab("published");
                  selectedStatus !== "published" &&
                    setSelectedStatus("published");
                  setSelectAll(false);
                }}
              >
                Published <span>({published})</span>
              </li>
            </>
          )}

          {draft > 0 && (
            <>
              <span>|</span>
              <li
                className={activeTab === "draft" ? "active" : ""}
                onClick={() => {
                  setActiveTab("draft");
                  selectedStatus !== "draft" && setSelectedStatus("draft");
                  setSelectAll(false);
                }}
              >
                Draft <span>({draft})</span>
              </li>
            </>
          )}

          {trash > 0 && (
            <>
              <span>|</span>
              <li
                className={activeTab === "trash" ? "active" : ""}
                onClick={() => {
                  setActiveTab("trash");
                  selectedStatus !== "trash" && setSelectedStatus("trash");
                  setSelectAll(false);
                }}
              >
                Trash <span>({trash})</span>
              </li>
            </>
          )}
        </ul>

        <div className="allPost-search">
          <input
            type="search"
            placeholder="Search..."
            className="allPost-input"
            onChange={handleSearchChange} // Add onChange event handler
            value={searchQuery} // Set input value to searchQuery
          />

          <Button className="allPost-search-btn" type="submit" title="Search" />
        </div>
      </div>
    </section>
  );
}
