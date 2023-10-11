import React from "react";

export default function MediaLibrary({ mediaData }) {
  return (
    <section>
      <div>
        {mediaData.map((media) => (
          <div key={media.id}>
            <img src={media.imageUrl} alt={media.name} />
            <button onClick={() => onSelect(media)}>Insert</button>
          </div>
        ))}
      </div>
    </section>
  );
}
