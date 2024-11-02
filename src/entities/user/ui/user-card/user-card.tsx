import BlackUserIcon from "@/assets/img/png/black_user.png";
import WhiteUserIcon from "@/assets/img/png/white_user.png";

interface UserCardProps {
    fullname: string | undefined;
    color: "black" | "white";
}

const userIcon = {
    black: BlackUserIcon,
    white: WhiteUserIcon
};

export const UserCard: React.FC<UserCardProps> = ({ fullname, color }) => {
    return (
        <div className="grid grid-cols-[auto_1fr] gap-x-2.5">
            <img
                src={userIcon[color]}
                alt={`${color} user icon`}
                height="40"
                width="40"
            />
            <span className="justify-self-start text-sm">{fullname}</span>
        </div>
    );
};
