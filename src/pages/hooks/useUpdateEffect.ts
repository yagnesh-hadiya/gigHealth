import { useEffect, useRef } from "react";

const useUpdateEffect = (effect: any, dependencies: any[]) => {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, dependencies);
};

export default useUpdateEffect;
