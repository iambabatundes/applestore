import React from "react";
import Input from "./input";
import Button from "../button";

export default function PublishImmediately({
  isImmediate,
  immediateDisplay,
  handleEditDateTime,
  months,
  month,
  day,
  year,
  hour,
  minute,
  handleSaveDateTime,
  handleCancelDateTime,
  setMinute,
  setDay,
  setHour,
  setYear,
  setMonth,
}) {
  return (
    <div className="post-actions postbox post-immediately">
      <i className="fa fa-calendar" aria-hidden="true"></i>
      {isImmediate ? "Publish:" : "Publish on:"}
      <span className="post-display post-immediately-now">
        {immediateDisplay}
      </span>

      {isImmediate ? (
        <span
          className="post-edit edit-immediately"
          onClick={handleEditDateTime}
        >
          Edit
        </span>
      ) : (
        <div className="date-time-select">
          <select
            value={String(month).padStart(2, "0")}
            onChange={(e) => setMonth(e.target.value)}
            className="dateTime__select"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={String(i + 1).padStart(2, "0")}>
                {String(i + 1).padStart(2, "0")} - {months[i]}
              </option>
            ))}
          </select>

          <Input
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="dataTime__input"
          />
          {/* <input
            // type="number"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="dataTime__input"
          /> */}
          {","}

          <Input
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="dataTime__input year__input"
          />
          {/* <input
            // type="datetime-local"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="dataTime__input year__input"
          /> */}

          {"at"}

          <Input // type="number"
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            className="dataTime__input"
          />

          {/* <input
            // type="number"
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            className="dataTime__input"
          /> */}
          {":"}

          <Input // type="number"
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
            className="dataTime__input"
          />
          {/* <input
            // type="number"
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
            className="dataTime__input"
          /> */}

          <div className="datasBtn">
            <Button
              onClick={handleSaveDateTime}
              title="Save"
              className="dataBtn"
            />
            <Button
              onClick={handleCancelDateTime}
              title="Cancel"
              className="dataBtn cancelData"
            />
          </div>
        </div>
      )}
    </div>
  );
}
