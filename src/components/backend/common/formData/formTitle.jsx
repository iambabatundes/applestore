import React from "react";
import Input from "../input";

export default function FormTitle({ handleTitleChange }) {
  return (
    <div>
      <Input
        type="text"
        id="AddTitle"
        className="createNew__title"
        name="Add title"
        onChange={(e) => handleTitleChange(e)}
        placeholder="Add title"
        size="28"
        spellCheck="true"
        autoComplete="off"
      />
    </div>
  );
}
