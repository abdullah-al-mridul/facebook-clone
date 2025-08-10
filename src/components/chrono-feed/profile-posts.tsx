
'use client';
import { useState } from 'react';
import CreatePost from './create-post';
import Post from './post';
import PostDialog from './post-dialog';
import { samplePosts } from '@/lib/data';

export default function ProfilePosts() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-5">
            <Card>
                <CardHeader>
                    <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Intro about the user goes here. Living life one day at a time!</p>
                </CardContent>
            </Card>
        </div>
      <div className="md:col-span-7 space-y-6">
        <CreatePost onOpenDialog={() => setIsDialogOpen(true)} />
        {samplePosts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
        <PostDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
      </div>
    </div>
  );
}
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
