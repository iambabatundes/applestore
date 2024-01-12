import React from "react";
// import ReactImageMagnify from "react-image-magnify";

export default function ImagePreview() {
  const images = "/brandNew21.webp";
  return (
    <section style={{ width: 500, height: 800 }}>
      <div className="imageMagnify">
        {/* <ReactImageMagnify
          {...{
            smallImage: {
              alt: "Wristwatch by Ted Baker London",
              isFluidWidth: true,
              src: images,
              //   sizes:
              //     "(max-width: 480px) 100vw, (max-width: 1200px) 30vw, 360px",
              width: "100%",
              height: "100px",
            },

            largeImage: {
              src: images,
              width: 900,
              height: 900,
            },
          }}
        /> */}
      </div>
    </section>
  );
}
