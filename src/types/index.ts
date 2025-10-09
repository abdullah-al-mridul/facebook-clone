

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

export type PostAnalyticsType = {
  reach: number;
  likes: number;
  comments: number;
};

export type ReactionName = 'Like' | 'Love' | 'Haha' | 'Wow' | 'Sad' | 'Angry';

export type ReactionType = {
  user: User;
  reaction: ReactionName;
};

export type PostPrivacy = 'Public' | 'Friends' | 'Only Me';

export type PostType = {
  id: string;
  user: User;
  timestamp: string;
  privacy: PostPrivacy;
  content: string;
  imageUrl?: string;
  imageHint?: string;
  likes: number;
  comments: number;
  shares: number;
  commentData?: CommentType[];
  analytics?: PostAnalyticsType;
  reactions?: ReactionType[];
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

    