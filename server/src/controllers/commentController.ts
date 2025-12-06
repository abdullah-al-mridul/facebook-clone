import { Request, Response } from "express";
import Comment from "../models/Comment";
import Post from "../models/Post";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { AuthRequest } from "../middlewares/authMiddleware";

// @desc    Add a comment to a post
// @route   POST /api/comments/:postId
// @access  Private
export const addComment = asyncHandler(async (req: Request, res: Response) => {
  const { content } = req.body;
  const { postId } = req.params;
  const authReq = req as AuthRequest;

  if (!content) {
    throw new ApiError(400, "Comment content is required");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const comment = await Comment.create({
    post: postId,
    user: (authReq.user as any)._id,
    content,
  });

  // Add comment to post's comments array
  post.comments.push(comment._id as any);
  await post.save();

  const populatedComment = await Comment.findById(comment._id).populate(
    "user",
    "firstName lastName username profilePicture"
  );

  res
    .status(201)
    .json(new ApiResponse(201, populatedComment, "Comment added successfully"));
});

// @desc    Delete a comment
// @route   DELETE /api/comments/:commentId
// @access  Private
export const deleteComment = asyncHandler(
  async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const authReq = req as AuthRequest;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new ApiError(404, "Comment not found");
    }

    // Check if user is owner of comment or owner of the post
    const post = await Post.findById(comment.post);

    if (!post) {
      // If post doesn't exist, just delete the comment? Or throw error?
      // Let's delete the comment to clean up
      await comment.deleteOne();
      res
        .status(200)
        .json(new ApiResponse(200, null, "Comment deleted (Post not found)"));
      return;
    }

    if (
      comment.user.toString() !== (authReq.user as any)._id.toString() &&
      post.user.toString() !== (authReq.user as any)._id.toString()
    ) {
      throw new ApiError(401, "User not authorized to delete this comment");
    }

    // Remove comment from post's comments array
    post.comments = post.comments.filter((id) => id.toString() !== commentId);
    await post.save();

    await comment.deleteOne();

    res
      .status(200)
      .json(new ApiResponse(200, null, "Comment deleted successfully"));
  }
);
