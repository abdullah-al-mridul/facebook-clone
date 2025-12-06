import { Request, Response } from "express";
import Conversation from "../models/Conversation";
import Message from "../models/Message";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { AuthRequest } from "../middlewares/authMiddleware";

// @desc    Create or get conversation
// @route   POST /api/chat
// @access  Private
export const accessConversation = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.body;
    const authReq = req as AuthRequest;
    const currentUserId = (authReq.user as any)._id;

    if (!userId) {
      throw new ApiError(400, "UserId param not sent with request");
    }

    let isChat = await Conversation.find({
      $and: [
        { participants: { $elemMatch: { $eq: currentUserId } } },
        { participants: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("participants", "-password")
      .populate("lastMessage");

    isChat = await Conversation.populate(isChat, {
      path: "lastMessage.sender",
      select: "firstName lastName username profilePicture",
    });

    if (isChat.length > 0) {
      res.send(new ApiResponse(200, isChat[0], "Conversation retrieved"));
    } else {
      var chatData = {
        participants: [currentUserId, userId],
      };

      try {
        const createdChat = await Conversation.create(chatData);
        const FullChat = await Conversation.findOne({
          _id: createdChat._id,
        }).populate("participants", "-password");
        res
          .status(200)
          .json(new ApiResponse(200, FullChat, "Conversation created"));
      } catch (error) {
        throw new ApiError(400, (error as Error).message);
      }
    }
  }
);

// @desc    Fetch all conversations
// @route   GET /api/chat
// @access  Private
export const fetchConversations = asyncHandler(
  async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const currentUserId = (authReq.user as any)._id;

    try {
      Conversation.find({
        participants: { $elemMatch: { $eq: currentUserId } },
      })
        .populate("participants", "-password")
        .populate("lastMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
          results = await Conversation.populate(results, {
            path: "lastMessage.sender",
            select: "firstName lastName username profilePicture",
          });
          res
            .status(200)
            .json(new ApiResponse(200, results, "Conversations retrieved"));
        });
    } catch (error) {
      throw new ApiError(400, (error as Error).message);
    }
  }
);

// @desc    Send message
// @route   POST /api/chat/message
// @access  Private
export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const { content, conversationId } = req.body;
  const authReq = req as AuthRequest;
  const currentUserId = (authReq.user as any)._id;

  if (!content || !conversationId) {
    throw new ApiError(400, "Invalid data passed into request");
  }

  var newMessage = {
    sender: currentUserId,
    content: content,
    conversation: conversationId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate(
      "sender",
      "firstName lastName username profilePicture"
    );
    message = await message.populate("conversation");
    message = await (message as any).populate({
      path: "conversation.participants",
      select: "firstName lastName username profilePicture email",
    });

    await Conversation.findByIdAndUpdate(req.body.conversationId, {
      lastMessage: message,
    });

    res.json(new ApiResponse(200, message, "Message sent"));
  } catch (error) {
    throw new ApiError(400, (error as Error).message);
  }
});

// @desc    Fetch messages for a conversation
// @route   GET /api/chat/message/:conversationId
// @access  Private
export const allMessages = asyncHandler(async (req: Request, res: Response) => {
  try {
    const messages = await Message.find({
      conversation: req.params.conversationId,
    })
      .populate("sender", "firstName lastName username profilePicture")
      .populate("conversation");

    res.json(new ApiResponse(200, messages, "Messages retrieved"));
  } catch (error) {
    throw new ApiError(400, (error as Error).message);
  }
});
