import ArrowButton from "./arrowButton";

export default function CarouselControls({ onPrev, onNext, isHovered }) {
  return (
    <>
      <ArrowButton
        direction="left"
        onClick={onPrev}
        className={isHovered ? "show-arrow" : "hide-arrow"}
      />
      <ArrowButton
        direction="right"
        onClick={onNext}
        className={`${
          isHovered ? "show-arrow" : "hide-arrow"
        } arrowButton__nextBtn`}
      />
    </>
  );
}
