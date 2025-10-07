
export type User = {
  name: string;
  avatarUrl: string;
  isVerified?: boolean;
};

export type CommentType = {
  id: string;
  user: User;
  timestamp: string;
  content: string;
};

export type PostType = {
  id: string;
  user: User;
  timestamp: string;
  content: string;
  imageUrl?: string;
  imageHint?: string;
  likes: number;
  comments: number;
  shares: number;
  commentData?: CommentType[];
};

export type StoryType = {
  id: string;
  user: User;
  imageUrl: string;
  imageHint?: string;
};

export type Message = {
    id: number;
    sender: 'me' | 'other';
    text?: string;
    images?: string[];
    audioUrl?: string;
    avatarUrl?: string;
}

    