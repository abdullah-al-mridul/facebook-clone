

import { PostType, ReactionName } from "@/types";

const dummyUsers = [
    { name: 'John Smith', avatarUrl: 'https://picsum.photos/seed/john/40/40' },
    { name: 'Alice Johnson', avatarUrl: 'https://picsum.photos/seed/alice/40/40', isVerified: true },
    { name: 'Michael Chen', avatarUrl: 'https://picsum.photos/seed/michael/40/40' },
    { name: 'Emily Davis', avatarUrl: 'https://picsum.photos/seed/emily/40/40', isVerified: true },
];

const reactionNames: ReactionName[] = ['Like', 'Love', 'Haha', 'Wow', 'Sad', 'Angry'];

export const samplePosts: PostType[] = [
    {
      id: '1',
      user: { name: 'Jane Doe', avatarUrl: 'https://picsum.photos/seed/jane/40/40', isVerified: true },
      timestamp: '2h ago',
      privacy: 'Public',
      content: 'Just enjoying a beautiful day at the park! The weather is perfect for a nice long walk. 🌳☀️ #blessed #naturelover',
      imageUrl: 'https://picsum.photos/seed/post1/600/400',
      imageHint: 'park nature',
      likes: 128,
      comments: 16,
      shares: 8,
      commentData: [
          { id: 'c1', user: dummyUsers[0], timestamp: '1h ago', content: 'Looks amazing! I wish I was there.' },
          { id: 'c2', user: dummyUsers[1], timestamp: '30m ago', content: 'So jealous! Enjoy the weather!' }
      ],
      analytics: {
        reach: 1500,
        likes: 128,
        comments: 16,
      },
      reactions: [
        { user: dummyUsers[0], reaction: 'Like' },
        { user: dummyUsers[1], reaction: 'Love' },
        { user: dummyUsers[2], reaction: 'Haha' },
        { user: dummyUsers[3], reaction: 'Like' },
      ]
    },
    {
      id: '2',
      user: { name: 'John Smith', avatarUrl: 'https://picsum.photos/seed/john/40/40' },
      timestamp: '5h ago',
      privacy: 'Friends',
      content: 'Excited to announce I\'m starting a new journey as a Software Engineer at ChronoFeed! Wish me luck! 🚀',
      likes: 256,
      comments: 42,
      shares: 12,
      commentData: [],
      analytics: {
        reach: 5200,
        likes: 256,
        comments: 42,
      },
      reactions: dummyUsers.map((user, i) => ({
          user,
          reaction: reactionNames[i % reactionNames.length],
      }))
    },
    {
      id: '3',
      user: { name: 'Alice Johnson', avatarUrl: 'https://picsum.photos/seed/alice/40/40', isVerified: true },
      timestamp: '1d ago',
      privacy: 'Only Me',
      content: 'Tried a new recipe for homemade pasta tonight and it was a huge success! So delicious! 🍝😋',
      imageUrl: 'https://picsum.photos/seed/post3/600/400',
      imageHint: 'pasta food',
      likes: 95,
      comments: 23,
      shares: 5,
      commentData: [
          { id: 'c3', user: { name: 'Jane Doe', avatarUrl: 'https://picsum.photos/seed/jane/40/40', isVerified: true }, timestamp: '1d ago', content: 'That looks so yummy! You have to share the recipe!' }
      ],
      analytics: {
        reach: 980,
        likes: 95,
        comments: 23,
      },
      reactions: [
         { user: dummyUsers[0], reaction: 'Love' },
         { user: dummyUsers[3], reaction: 'Wow' },
      ]
    },
  ];
