import React, { useCallback } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import the Quill Snow theme CSS
import "./formContent.css";
import Button from "../../button";
import "../../styles/createNew.css";
import Input from "../input";
import CustomImageBlot from "./customImageBlot"; // Import the custom blot

export default function FormContent({
  handleContentChange,
  editorContent,
  handleInputChange,
  data,
  errors,
}) {
  const toolbarOptions = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ color: [] }], // dropdown with defaults from theme
    ["link", "image", "video"],
    ["clean"], // remove formatting button
  ];

  const handleImageUpload = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const quill = ReactQuill.Quill.find(
            document.querySelector(".ql-container")
          );
          const range = quill.getSelection();
          quill.editor.insertEmbed(range.index, "customImage", {
            url: reader.result,
          });
        };
      }
    };
  }, []);

  const handleVideoUpload = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "video/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const quill = ReactQuill.Quill.find(
            document.querySelector(".ql-container")
          );
          const range = quill.getSelection();
          quill.editor.insertEmbed(range.index, "video", reader.result);
        };
      }
    };
  }, []);

  const handleAddMedia = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*,video/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const quill = ReactQuill.Quill.find(
            document.querySelector(".ql-container")
          );
          const range = quill.getSelection();
          const fileType = file.type.split("/")[0];
          if (fileType === "image") {
            quill.editor.insertEmbed(range.index, "customImage", {
              url: reader.result,
            });
          } else if (fileType === "video") {
            quill.editor.insertEmbed(range.index, "video", reader.result);
          }
        };
      }
    };
  }, []);

  const modules = {
    toolbar: {
      container: toolbarOptions,
      handlers: {
        image: handleImageUpload,
        video: handleVideoUpload,
      },
    },
  };

  return (
    <section className="formContent">
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
        {errors.title && (
          <div className="alert alert-danger">{errors.title}</div>
        )}
      </div>
      <section className="formContent__main">
        <div>
          <div className="media-main">
            <div className="addMedia__btn">
              <Button
                title="Add Media"
                iconData="fa fa-picture-o"
                onClick={handleAddMedia}
              />
            </div>
          </div>

          <ReactQuill
            modules={modules}
            onChange={handleContentChange}
            value={editorContent}
            theme="snow"
            placeholder={"Write something awesome..."}
          />
        </div>
      </section>
    </section>
  );
}
