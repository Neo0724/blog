import useElementInView from "@/app/post/_component/custom_hook/useElementInViewHook";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

export default function ScrollToTop<T extends React.RefObject<HTMLElement>>({
  refToMonitor,
}: {
  refToMonitor: T;
}) {
  const { isVisible } = useElementInView(refToMonitor);
  const [scrollToTopBtn, setScrollToTopBtn] = useState<boolean>(false);

  useEffect(() => {
    if (!isVisible) {
      setScrollToTopBtn(true);
    } else {
      setScrollToTopBtn(false);
    }
  }, [isVisible]);
  return (
    <>
      {scrollToTopBtn && (
        <Button
          onClick={() => window.scrollTo(0, 0)}
          variant="ghost"
          className="fixed bottom-[2rem] right-5 mx-auto w-[min-content] flex flex-col h-[3rem] rounded-xl bg-[rgb(58,59,60)] z-[51]"
        >
          <span>
            <FaArrowUp />
          </span>
          <span>Scroll to top</span>
        </Button>
      )}
    </>
  );
}
