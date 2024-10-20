import { useEffect } from "react";

export function useClickOutside(refs = [], cb = () => {}) {
  useEffect(() => {
    function handleClickOutside(event) {
      const isContained = refs.some(
        (ref) => ref.current && ref.current.contains(event.target)
      );
      if (!isContained) {
        cb();
      }
    }
    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [refs]);
}
