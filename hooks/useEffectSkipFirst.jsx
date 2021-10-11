import { useEffect, useRef } from "react";

export const useEffectSkipFirst = (fn, arr) => {
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;

      return;
    }

    return fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, arr);
};
