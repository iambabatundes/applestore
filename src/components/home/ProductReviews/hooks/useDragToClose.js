import { useDrag } from "@use-gesture/react";

export default function useDragToClose(y, api, onClose) {
  return useDrag(
    ({ last, movement: [, my], cancel }) => {
      if (my < -10) cancel();
      if (last) {
        if (my > 100) {
          api.start({
            y: 1000,
            onRest: () => onClose(),
          });
        } else {
          api.start({ y: 0 });
        }
      } else {
        api.start({ y: my });
      }
    },
    { from: () => [0, y.get()] }
  );
}
