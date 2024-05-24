import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../button";
import "../styles/createNew.css";

export default function PublishImmediately({
  isImmediate,
  immediateDisplay,
  handleEditDateTime,
  handleSaveDateTime,
  handleCancelDateTime,
  setDate,
  selectedDate,
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
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setDate(date)}
            showTimeSelect
            dateFormat="Pp"
            className="dateTime__input"
          />
          <div className="dateTime__buttons">
            <Button
              onClick={handleSaveDateTime}
              title="Save"
              className="dateTime__button"
            />
            <Button
              onClick={handleCancelDateTime}
              title="Cancel"
              className="dateTime__button dateTime__button--cancel"
            />
          </div>
        </div>
      )}
    </div>
  );
}
