
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PostType } from "@/types";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Copy, Facebook, Twitter, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "../ui/separator";

type ShareOverlayProps = {
  post: PostType;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

const SocialButton = ({ icon: Icon, text }: { icon: React.ElementType, text: string }) => (
    <Button variant="outline" className="w-full justify-start">
        <Icon className="mr-2 h-5 w-5" />
        {text}
    </Button>
)

export default function ShareOverlay({ post, isOpen, onOpenChange }: ShareOverlayProps) {
  const { toast } = useToast();
  if (!post) return null;

  const postUrl = `https://facemusk.com/post/${post.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl);
    toast({
        title: "Link Copied!",
        description: "The post link has been copied to your clipboard.",
    })
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Share this post
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
            <div className="space-y-2">
                <p className="font-semibold">Share on social media</p>
                <div className="space-y-2">
                    <SocialButton icon={Facebook} text="Share on Facebook" />
                    <SocialButton icon={Twitter} text="Share on Twitter" />
                    <SocialButton icon={MessageCircle} text="Share via Messenger" />
                </div>
            </div>
            <Separator />
            <div className="space-y-2">
                <p className="font-semibold">Or copy link</p>
                <div className="flex items-center gap-2">
                    <Input value={postUrl} readOnly />
                    <Button size="icon" onClick={handleCopyLink}>
                        <Copy />
                    </Button>
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


