import React from "react";
import Button from "../button";

export default function BulkAction({
  allPost,
  uniqueDates,
  setSelectedDate,
  selectedDate,
  selectedCategory,
  setSelectedCategory,
  uniqueCategories,
  selectedBulkAction,
  setSelectedBulkAction,
  handleBulkAction,
  handleTrashAction,
}) {
  return (
    <div className="allPost-post__filtered">
      <div className="allPost-filter__action">
        <div className="allPost-filtered__action">
          <select
            name="bulkAction"
            id="bulkAction"
            value={selectedBulkAction}
            onChange={(e) => setSelectedBulkAction(e.target.value)}
          >
            <option value="-1">Bulk Action</option>
            <option value="edit">Edit</option>
            {/* <option value="trash" onClick={handleTrashAction}>
              Trash
            </option> */}
            <option value="trash">Trash</option>
          </select>
          <Button
            title="Apply"
            className="allPost-search-btn"
            type="submit"
            onClick={handleBulkAction}
          />
        </div>
        <div className="allPost-filtered__action">
          <select
            name="filterByDate"
            id="filterByDate"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            <option value="All Dates">All Dates</option>
            {uniqueDates.map((date, index) => (
              <option key={index} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>

        <div className="allPost-filtered__action">
          <select
            name="filterByCategories"
            id="filterByCategories"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All Categories">All Categories</option>
            {uniqueCategories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>

          <Button title="Filter" className="allPost-search-btn" type="submit" />
        </div>
      </div>

      <span>{allPost} item</span>
    </div>
  );
}
