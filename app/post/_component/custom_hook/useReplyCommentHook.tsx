import axios from "axios";
import { UserType } from "../postComponent/RenderPost";
import { ToastFunctionType } from "./usePostHook";
import { UpdateReplyCommentType } from "../EditCommentReplyDialog";
import {
  DeleteNotificationType,
  NewNotificationType,
} from "./useNotificationHook";
import useSWRInfinite from "swr/infinite";
import customAxios from "@/lib/custom-axios";

export type GetBackReplyCommentType = {
  comment_reply_id: string;
  content: string;
  User: UserType;
  createdAt: Date;
  dateDifferent: string;
  Target_user: UserType;
};

export type ReplyData = {
  content: string;
  user_id: string;
  target_user_id: string;
  comment_id: string;
};

export const COMMENT_REPLY_PAGE_SIZE = 5;

export default function useReplyComment(comment_id: string, user_id: string) {
  const getReplyComment = async (
    apiUrl: string
  ): Promise<GetBackReplyCommentType[] | []> => {
    let returnedReplyComments: GetBackReplyCommentType[] | [] = [];
    try {
      const response = await customAxios.get(apiUrl);

      if (response.status === 200) {
        returnedReplyComments = response.data.allCommentReply;
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
    return returnedReplyComments;
  };

  const createReplyComments = async (
    replyData: ReplyData,
    setViewReplies: React.Dispatch<boolean>,
    setReplyContent: React.Dispatch<string>,
    setOpenReply: React.Dispatch<boolean>,
    showToast: ToastFunctionType,
    addNotification?: (newNotification: NewNotificationType) => void,
    newNotification?: Omit<NewNotificationType, "resourceId">
  ): Promise<void> => {
    try {
      const res = await customAxios.post(
        "/api/comment-reply/create-comment-reply",
        replyData
      );

      if (res.status === 200) {
        setViewReplies(true);
        // Send the notification if the user is replying to other instead of himself
        if (newNotification && addNotification) {
          addNotification({
            ...newNotification,
            resourceId: res.data.newCommentReply.comment_reply_id,
          });
        }
        mutate(
          data?.map((page, index) => {
            index === 0 && page.push(res.data.newCommentReply);
            return page;
          })
        );
      }
    } catch (err) {
      showToast({
        title: "Error",
        description: "An error occured when replying. Please try again later",
      });
    } finally {
      setReplyContent("");
      setOpenReply(false);
    }
  };

  const deleteReplyComments = async (
    comment_reply_id: string,
    showToast: ToastFunctionType,
    deleteNotification?: (notificationToDelete: DeleteNotificationType) => void,
    notificationToDelete?: DeleteNotificationType
  ): Promise<GetBackReplyCommentType[][] | undefined> => {
    let excludedDeletedReplyComment: GetBackReplyCommentType[][] | undefined;
    try {
      const res = await customAxios.delete(
        `/api/comment-reply/delete-comment-reply?comment_reply_id=${comment_reply_id}`
      );

      if (res.status === 200) {
        showToast({
          title: "Success",
          description: "Your reply has been deleted",
        });
        if (deleteNotification && notificationToDelete) {
          deleteNotification(notificationToDelete);
        }
        excludedDeletedReplyComment =
          data?.map((page) =>
            page.filter(
              (replyComment) =>
                replyComment.comment_reply_id !== comment_reply_id
            )
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
  ): Promise<GetBackReplyCommentType[][] | undefined> => {
    let allReplyCommentWithUpdatedReplyComment:
      | GetBackReplyCommentType[][]
      | undefined;
    try {
      const res = await customAxios.put(
        "/api/comment-reply/update-comment-reply",
        updatedCommentReply
      );

      if (res.status === 200) {
        showToast({
          title: "Success",
          description: "Your reply has been updated",
        });
        allReplyCommentWithUpdatedReplyComment =
          data?.map((page) =>
            page.map((commentReply) => {
              if (
                commentReply.comment_reply_id ===
                updatedCommentReply.comment_reply_id
              ) {
                return {
                  ...commentReply,
                  content: updatedCommentReply.content,
                };
              }

              return commentReply;
            })
          ) ?? [];
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

  const getKey = (
    pageIndex: number,
    previousPageData: GetBackReplyCommentType[]
  ) => {
    if ((previousPageData && !previousPageData.length) || !comment_id)
      return null;
    return `/api/comment-reply/get-comment-reply?skipCommentReply=${pageIndex}&limitCommentReply=${COMMENT_REPLY_PAGE_SIZE}&comment_id=${comment_id}&user_id=${user_id}`;
  };

  const { data, isLoading, error, mutate, size, setSize } = useSWRInfinite<
    GetBackReplyCommentType[]
  >(getKey, getReplyComment);

  return {
    replyComments: data,
    isLoading,
    replyCommentsError: error,
    createReplyComments,
    updateReplyComment,
    deleteReplyComments,
    mutateReplyComment: mutate,
    commentReplySize: size,
    setCommentReplySize: setSize,
  };
}
