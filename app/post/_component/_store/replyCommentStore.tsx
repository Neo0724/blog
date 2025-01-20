import { create } from "zustand";
import { mutate } from "swr";
import { ToastProp } from "./postStore";
import axios from "axios";
import { UpdateReplyCommentType } from "@/app/api/update-reply-comment/route";

type ReplyData = {
  content: string;
  user_id: string;
  target_user_id: string;
  comment_id: string;
};

type ReplyCommentAction = {
  actions: {
    createReplyComments: (
      replyData: ReplyData,
      setViewReplies: React.Dispatch<boolean>,
      setReplyContent: React.Dispatch<string>,
      setOpenReply: React.Dispatch<boolean>,
      showToast: ({ title, description }: ToastProp) => void
    ) => Promise<string>;
    deleteReplyComments: (
      comment_reply_id: string,
      showToast: ({ title, description }: ToastProp) => void,
      commentId: string
    ) => Promise<void>;
    updateReplyComment: (
      replyComment: UpdateReplyCommentType,
      showToast: ({ title, description }: ToastProp) => void
    ) => Promise<void>;
  };
};

export const replyCommentStore = create<ReplyCommentAction>(() => ({
  actions: {
    createReplyComments: async (
      replyData,
      setViewReplies,
      setReplyContent,
      setOpenReply,
      showToast
    ) => {
      let commentReplyId = "";
      try {
        const res = await axios.post("/api/create-reply-comment", replyData);

        if (res.status === 200) {
          mutate(["/api/get-reply-comment", replyData.comment_id]);
          setViewReplies(true);
          commentReplyId = res.data.comment_reply_id;
        }
      } catch (err) {
        showToast({
          title: "Error",
          description: "An error occured when replying. Please try again later",
        });
      } finally {
        setReplyContent("");
        setOpenReply(false);
        return commentReplyId;
      }
    },
    deleteReplyComments: async (comment_reply_id, showToast, commentId) => {
      try {
        const res = await axios.delete("/api/delete-reply-comment", {
          params: {
            comment_reply_id: comment_reply_id,
          },
        });

        if (res.status === 200) {
          mutate(["/api/get-reply-comment", commentId]);
          showToast({
            title: "Success",
            description: "Your reply has been deleted",
          });
        } else {
          showToast({
            title: "Error",
            description:
              "Unexpected error occured. Please try deleting it later",
          });
        }
      } catch (err) {
        console.log(err);
        showToast({
          title: "Error",
          description: "Unexpected error occured. Please try deleting it later",
        });
      }
    },
    updateReplyComment: async (replyComment, showToast) => {
      try {
        const res = await axios.put("/api/update-reply-comment", replyComment);

        if (res.status === 200) {
          mutate(["/api/get-reply-comment", replyComment.comment_id]);
          showToast({
            title: "Success",
            description: "Your reply has been updated",
          });
        } else {
          showToast({
            title: "Error",
            description:
              "Unexpected error occured. Please try updating it later",
          });
        }
      } catch (err) {
        console.log(err);
        showToast({
          title: "Error",
          description: "Unexpected error occured. Please try updating it later",
        });
      }
    },
  },
}));
