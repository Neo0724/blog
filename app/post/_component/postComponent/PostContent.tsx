import { useState } from "react";

type PostContentComponentProps = {
  content: string;
  handleScrollToPost: () => void;
};

export default function PostContent({
  content,
  handleScrollToPost,
}: PostContentComponentProps) {
  const [readMore, setReadMore] = useState(false);
  return (
    <>
      {content.length > 255 ? (
        <span>
          {readMore ? content : content.substring(0, 255) + "..."}
          <button
            className="text-blue-600 hover:opacity-75"
            onClick={() => {
              setReadMore((prev) => {
                if (prev) {
                  handleScrollToPost();
                }

                return !prev;
              });
            }}
          >
            {readMore ? "Read less" : "Read more"}
          </button>
        </span>
      ) : (
        <span>{content}</span>
      )}
    </>
  );
}
