import { useState } from "react";

type PostContentComponentProps = {
  content: string;
};

export default function PostContent({ content }: PostContentComponentProps) {
  const [readMore, setReadMore] = useState(false);
  return (
    <>
      {content.length > 255 ? (
        <span>
          {readMore ? content : content.substring(0, 255) + "..."}
          <button
            className="text-blue-600 hover:opacity-75"
            onClick={() => {
              setReadMore((prev) => !prev);
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
