
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PostAnalyticsType } from '@/types';
import { BarChart2, MessageCircle, ThumbsUp } from 'lucide-react';

type PostAnalyticsProps = {
  analytics: PostAnalyticsType;
};

const AnalyticsItem = ({ icon: Icon, value, label }: { icon: React.ElementType, value: number, label: string }) => (
    <div className="flex flex-col items-center gap-1 p-4 rounded-lg bg-accent">
        <Icon className="w-6 h-6 text-primary" />
        <p className="text-xl font-bold">{value.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
    </div>
)

export default function PostAnalytics({ analytics }: PostAnalyticsProps) {
  return (
    <div className="px-4 pb-2">
      <Card className="bg-background/50">
        <CardHeader>
            <CardTitle className="text-lg">Post Insights</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-3 gap-4">
                <AnalyticsItem icon={BarChart2} value={analytics.reach} label="Reach" />
                <AnalyticsItem icon={ThumbsUp} value={analytics.likes} label="Likes" />
                <AnalyticsItem icon={MessageCircle} value={analytics.comments} label="Comments" />
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
