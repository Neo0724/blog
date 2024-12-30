import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { MdDeleteForever } from "react-icons/md";
import { cn } from "@/lib/utils";
import { MdEdit } from "react-icons/md";
export default function PostOptionComponent({
  userId,
  authorId,
  postId,
  handleDelete,
}: {
  userId: string;
  authorId: string;
  postId: string;
  handleDelete: (postId: string) => void;
}) {
  const [toolbar, setToolbar] = useState(false);

  const handleEdit = (postId: string) => {

  }

  const handleOpenToolbar = () => {
    setToolbar((prev) => !prev);
    console.log(toolbar);
  };
  return (
    <>
      <div className="flex z-10 flex-col items-end absolute right-5">
        <button
          className="hover:bg-gray-500 border-gray-300 rounded-full w-7 h-7 flex items-center justify-center transition-colors duration-150"
          onClick={handleOpenToolbar}
        >
          <BsThreeDots />
        </button>
        {/* TODO: Add a confirmation for deletion */}
        {/* Delete post button */}
        {userId === authorId ? (
          <div
            className={cn(
              "bg-gray-800 border-2 border-gray-500 p-3 rounded-md mt-2 transition-transform duration-150",
              toolbar ? "scale-100" : "scale-0",
            )}
          >
            <button
              onClick={() => handleDelete(postId)}
              className="hover:opacity-75 flex gap-3 items-center transition-opacity duration-150 justify-left"
            >
              <MdDeleteForever />
              <span>Delete</span>
            </button>
            <button
              className="hover:opacity-75 flex gap-3 items-center transition-opacity duration-150 justify-left"
              onClick={() => handleEdit(postId)}
              <MdEdit />
            <span>Edit post</span>
          </button>
          </div>
      ) : (
      // To be continue ...
      <button
        className={cn(
          "bg-gray-800 hover:opacity-75 border-2 border-gray-500 p-3 rounded-md mt-2 transition-transform duration-150",
          toolbar ? "scale-100" : "scale-0",
        )}
      >
        Empty...
      </button>
        )}
    </div >
    </>
  );
}
