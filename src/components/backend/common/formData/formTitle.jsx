import React from "react";
import Input from "../input";

export default function FormTitle({ handleInputChange, data }) {
  return (
    <div>
      <Input
        type="text"
        id="title"
        className="createNew__title"
        name="title"
        onChange={handleInputChange}
        placeholder="Add title"
        size="20"
        spellCheck="true"
        value={data.title}
      />
    </div>
  );
}
