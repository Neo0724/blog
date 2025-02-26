import React, { useEffect, useState } from "react";

export default function useElementInView<T extends HTMLElement>(
  targetRef: React.RefObject<T>
) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const targetElement = targetRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        setIsVisible(entries[0].isIntersecting);
      },
      {
        threshold: 1,
      }
    );

    if (targetElement) {
      observer.observe(targetElement);
    }

    return () => {
      if (targetElement) {
        observer.unobserve(targetElement);
      }
    };
  }, [targetRef]);

  return { isVisible };
}
