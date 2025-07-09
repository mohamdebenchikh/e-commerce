import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { Admin } from '@/types';

export function AdminInfo({ user, showEmail = false }: { user: Admin; showEmail?: boolean }) {
    const getInitials = useInitials();

    const username = user.name;

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={user.avatar} alt={username} />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(username)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-start text-sm leading-tight">
                <span className="truncate font-medium">{username}</span>
                {showEmail && <span className="truncate text-xs text-muted-foreground">{user.email}</span>}
            </div>
        </>
    );
}
