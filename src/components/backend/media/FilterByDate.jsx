import React from "react";

export default function FilterByDate({
  handleDateChange,
  selectedDate,
  uniqueDates,
}) {
  return (
    <div className="mediaByDate-main">
      <select
        name="mediaByDate"
        id="mediaByDate"
        className="allMediadata"
        onChange={handleDateChange}
        value={selectedDate}
      >
        {/* <option value="">All Date</option>
        {uniqueDates.map((date) => (
          <option key={date} value={date}>
            {date}
          </option>
        ))} */}
      </select>
    </div>
  );
}
