import Quill from "quill";

const BlockEmbed = Quill.import("blots/block/embed");

class CustomImageBlot extends BlockEmbed {
  static create(value) {
    const node = super.create();
    node.classList.add("custom-image-blot-container");
    node.setAttribute("contenteditable", false);

    const image = document.createElement("img");
    image.setAttribute("src", value.url);
    node.appendChild(image);

    const button = document.createElement("button");
    button.innerHTML = "✖"; // Use an icon or text for the remove button
    button.className = "remove-button";
    button.onclick = (e) => {
      e.preventDefault();
      node.parentNode.removeChild(node);
    };
    node.appendChild(button);

    return node;
  }

  static value(node) {
    const image = node.querySelector("img");
    return {
      url: image.getAttribute("src"),
    };
  }
}

CustomImageBlot.blotName = "customImage";
CustomImageBlot.tagName = "div";
CustomImageBlot.className = "custom-image-blot";

Quill.register(CustomImageBlot);

export default CustomImageBlot;
