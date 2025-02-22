import { z } from "zod";

export const SignUpSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export const UpdateReplyCommentSchema = z.object({
  content: z.string().min(1).max(65535),
  comment_reply_id: z.string(),
  comment_id: z.string(),
});

export const CommentSchema = z.object({
  content: z.string().min(1).max(65535),
  user_id: z.string(),
  post_id: z.string(),
});

export const CreatePostFormSchema = z.object({
  title: z.string().min(1).max(65535),
  content: z.string().min(1).max(65535),
});

export const CreatePostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  user_id: z.string(),
});
