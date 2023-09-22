import React, { useState } from "react";
import Button from "../../button";
import "../../styles/createNew.css";

export default function FormContent({ autoSave }) {
  //   const [selectedText, setSelectedText] = useState("");
  const [boldActive, setBoldActive] = useState(false);
  const [editorContent, setEditorContent] = useState("");

  const handleBoldClick = () => {
    document.execCommand("bold", false, null);
  };

  return (
    <section className="formContent__main">
      <div>
        <div className="media-main">
          <div className="addMedia__btn">
            <button>
              <i class="fa fa-picture-o" aria-hidden="true"></i>
              Add Media
            </button>
          </div>
        </div>

        <div className="writting__icons">
          <div className="writing__heading">
            <select name="heading" id="heading" className="writing-select">
              <option value="-1">Paragraph</option>
            </select>
          </div>

          <div>
            <span
              className={`writtenIcon ${boldActive ? "active" : ""}`}
              onClick={handleBoldClick}
            >
              <i className="fa fa-bold" aria-hidden="true"></i>
            </span>
          </div>

          <div>
            <span className="writtenIcon">
              <i className="fa fa-italic" aria-hidden="true"></i>
            </span>
          </div>

          <div>
            <span className="writtenIcon">
              <i className="fa fa-list-ul" aria-hidden="true"></i>
            </span>
          </div>
          <div>
            <span className="writtenIcon">
              <i className="fa fa-list-ol" aria-hidden="true"></i>
            </span>
          </div>

          <div>
            <span className="writtenIcon">
              <i className="fa fa-quote-left" aria-hidden="true"></i>
            </span>
          </div>

          <div>
            <span className="writtenIcon">
              <i className="fa fa-align-left" aria-hidden="true"></i>
            </span>
          </div>
          <div>
            <span className="writtenIcon">
              <i className="fa fa-align-center" aria-hidden="true"></i>
            </span>
          </div>

          <div>
            <span className="writtenIcon">
              <i className="fa fa-align-right" aria-hidden="true"></i>
            </span>
          </div>

          <div>
            <span className="writtenIcon">
              <i className="fa fa-align-justify" aria-hidden="true"></i>
            </span>
          </div>

          <div>
            <span className="writtenIcon">
              <i className="fa fa-link" aria-hidden="true"></i>
            </span>
          </div>

          <div>
            <span className="writtenIcon">
              <i className="fa fa-link" aria-hidden="true"></i>
            </span>
          </div>
        </div>

        <section>
          <div>
            {/* <textarea className="textarea"></textarea> */}
            <textarea
              id="editor"
              className="textarea"
              value={editorContent}
              onChange={(e) => setEditorContent(e.target.value)}
            />
          </div>

          <div className="">
            <div>
              <h4>Word Count</h4>
              <span>1</span>
            </div>

            {autoSave && (
              <div className="autoSave__info">
                <span>Saving...</span>
                <span>Error in saving</span>
              </div>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
