
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const ProfileTab = ({ children, active = false }: { children: React.ReactNode, active?: boolean}) => (
    <Button variant="ghost" className={`font-semibold text-base h-full py-4 px-4 rounded-none relative ${active ? 'text-primary' : 'text-muted-foreground'}`}>
        {children}
        {active && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary"></div>}
    </Button>
)

export default function ProfileTabs() {
    return (
        <div className="px-4 border-t">
            <div className="flex items-center">
                <ProfileTab active>Posts</ProfileTab>
                <ProfileTab>About</ProfileTab>
                <ProfileTab>Friends</ProfileTab>
                <ProfileTab>Photos</ProfileTab>
            </div>
        </div>
    )
}
