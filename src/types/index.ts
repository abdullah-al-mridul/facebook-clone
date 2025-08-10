export type User = {
  name: string;
  avatarUrl: string;
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
};
