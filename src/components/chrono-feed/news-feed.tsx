import CreatePost from './create-post';
import Post from './post';
import type { PostType } from '@/types';

const samplePosts: PostType[] = [
  {
    id: '1',
    user: { name: 'Jane Doe', avatarUrl: 'https://placehold.co/40x40/E5E7EB/4B5563.png' },
    timestamp: '2h ago',
    content: 'Just enjoying a beautiful day at the park! The weather is perfect for a nice long walk. 🌳☀️ #blessed #naturelover',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'park nature',
    likes: 128,
    comments: 16,
    shares: 8,
  },
  {
    id: '2',
    user: { name: 'John Smith', avatarUrl: 'https://placehold.co/40x40/9CA3AF/FFFFFF.png' },
    timestamp: '5h ago',
    content: 'Excited to announce I\'m starting a new journey as a Software Engineer at ChronoFeed! Wish me luck! 🚀',
    likes: 256,
    comments: 42,
    shares: 12,
  },
  {
    id: '3',
    user: { name: 'Alice Johnson', avatarUrl: 'https://placehold.co/40x40/F3F4F6/1F2937.png' },
    timestamp: '1d ago',
    content: 'Tried a new recipe for homemade pasta tonight and it was a huge success! So delicious! 🍝😋',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'pasta food',
    likes: 95,
    comments: 23,
    shares: 5,
  },
];


export default function NewsFeed() {
  return (
    <div className="space-y-6">
      <CreatePost />
      {samplePosts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}
