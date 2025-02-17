import axios from "axios";
import { UserType } from "../postComponent/RenderPost";
import useSWR from "swr";
import { ReplyData } from "../store/replyCommentStore";
import { ToastFunctionType } from "./usePostHook";
import { UpdateReplyCommentType } from "@/app/api/comment-reply/update-comment-reply/route";

export type GetBackReplyCommentType = {
  comment_reply_id: string;
  content: string;
  User: UserType;
  createdAt: Date;
  dateDifferent: string;
  Target_user: UserType;
};

export default function useReplyComment(comment_id: string, user_id: string) {
  const getReplyComment = async (
    comment_id: string
  ): Promise<GetBackReplyCommentType[] | []> => {
    let returnedReplyComments: GetBackReplyCommentType[] | [] = [];
    try {
      const response = await axios.get(
        `/api/comment-reply/get-comment-reply?comment_id=${comment_id}&user_id=${user_id}`
      );

      if (response.status === 200) {
        returnedReplyComments = response.data.allCommentReply;
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      return returnedReplyComments;
    }
  };

  const createReplyComments = async (
    replyData: ReplyData,
    setViewReplies: React.Dispatch<boolean>,
    setReplyContent: React.Dispatch<string>,
    setOpenReply: React.Dispatch<boolean>,
    showToast: ToastFunctionType
  ): Promise<string> => {
    let commentReplyId = "";
    try {
      const res = await axios.post(
        "/api/comment-reply/create-comment-reply",
        replyData
      );

      if (res.status === 200) {
        // mutate([
        //   "/api/comment-reply/get-comment-reply",
        //   replyData.comment_id,
        // ]);
        setViewReplies(true);
        commentReplyId = res.data.newCommentReply.comment_reply_id;
        mutate([res.data.newCommentReply, ...(data ?? [])]);
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
  };

  const deleteReplyComments = async (
    comment_reply_id: string,
    showToast: ToastFunctionType,
    commentId: string
  ): Promise<GetBackReplyCommentType[] | []> => {
    let excludedDeletedReplyComment: GetBackReplyCommentType[] = [];
    try {
      const res = await axios.delete(
        `/api/comment-reply/delete-comment-reply/comment_reply_id=${comment_reply_id}`
      );

      if (res.status === 200) {
        // mutate(["/api/comment-reply/get-comment-reply", commentId]);
        showToast({
          title: "Success",
          description: "Your reply has been deleted",
        });
        excludedDeletedReplyComment =
          data?.filter(
            (replyComment) => replyComment.comment_reply_id !== comment_reply_id
          ) ?? [];
      } else {
        showToast({
          title: "Error",
          description: "Unexpected error occured. Please try deleting it later",
        });
      }
    } catch (err) {
      console.log(err);
      showToast({
        title: "Error",
        description: "Unexpected error occured. Please try deleting it later",
      });
    }

    return excludedDeletedReplyComment;
  };

  const updateReplyComment = async (
    updatedCommentReply: UpdateReplyCommentType,
    showToast: ToastFunctionType
  ): Promise<GetBackReplyCommentType[] | []> => {
    let allReplyCommentWithUpdatedReplyComment: GetBackReplyCommentType[] = [];
    try {
      const res = await axios.put(
        "/api/comment-reply/update-comment-reply",
        updatedCommentReply
      );

      if (res.status === 200) {
        // mutate([
        //   "/api/comment-reply/get-comment-reply",
        //   replyComment.comment_id,
        // ]);
        showToast({
          title: "Success",
          description: "Your reply has been updated",
        });
        allReplyCommentWithUpdatedReplyComment =
          data?.map((commentReply) => {
            if (
              commentReply.comment_reply_id ===
              updatedCommentReply.comment_reply_id
            ) {
              return { ...commentReply, content: updatedCommentReply.content };
            }

            return commentReply;
          }) ?? [];
      } else {
        showToast({
          title: "Error",
          description: "Unexpected error occured. Please try updating it later",
        });
      }
    } catch (err) {
      console.log(err);
      showToast({
        title: "Error",
        description: "Unexpected error occured. Please try updating it later",
      });
    }

    return allReplyCommentWithUpdatedReplyComment;
  };

  const { data, isLoading, error, mutate } = useSWR(
    ["/api/comment-reply/get-comment-reply", comment_id],
    ([url, comment_id]) => getReplyComment(comment_id)
  );

  return {
    replyComments: data,
    isLoading,
    replyCommentsError: error,
    createReplyComments,
    updateReplyComment,
    deleteReplyComments,
    mutateReplyComment: mutate,
  };
}
