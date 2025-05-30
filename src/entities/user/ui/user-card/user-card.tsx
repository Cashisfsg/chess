import { CountDownTimer } from "@/shared/ui/count-down-timer";

import { useStorage } from "@/shared/lib/hooks/use-storage";

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
    const [{ data: timestamp, status }] = useStorage<number>(
        "game_time_start",
        sessionStorage
    );

    return (
        <div className="grid grid-cols-[auto_1fr_auto] gap-x-2.5">
            <img
                src={userIcon[color]}
                alt={`${color} user icon`}
                height="40"
                width="40"
            />
            <span className="justify-self-start text-sm">{fullname}</span>

            <div
                className={`flex items-center gap-x-2.5 self-center px-2.5 py-1.5 text-2xl ${color === "black" ? "bg-[#262421] text-white" : "bg-white text-[#262421]"}`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    className="rotate-90 fill-current"
                >
                    <path d="M5.48,9a.93.93,0,0,0-.3.71v.58a.94.94,0,0,0,.3.71,1,1,0,0,0,.71.3h4.58a1,1,0,0,0,.71-.3.94.94,0,0,0,.29-.71V9.7A.92.92,0,0,0,11.48,9a1,1,0,0,0-.71-.27H6.19A1,1,0,0,0,5.48,9Z" />
                    <path d="M19.22,6.1a9.9,9.9,0,0,0-2.14-3.18A10.23,10.23,0,0,0,13.9.78,9.76,9.76,0,0,0,10,0,9.86,9.86,0,0,0,6.1.78,10,10,0,0,0,.78,6.1,9.81,9.81,0,0,0,0,10a9.81,9.81,0,0,0,.78,3.9A10,10,0,0,0,6.1,19.22,9.86,9.86,0,0,0,10,20a9.76,9.76,0,0,0,3.89-.78,10.23,10.23,0,0,0,3.18-2.14,9.9,9.9,0,0,0,2.14-3.18A9.81,9.81,0,0,0,20,10,9.81,9.81,0,0,0,19.22,6.1ZM17.07,13a7.65,7.65,0,0,1-1.65,2.42A7.81,7.81,0,0,1,13,17.06a7.46,7.46,0,0,1-3,.6,7.51,7.51,0,0,1-3-.6,7.74,7.74,0,0,1-2.43-1.65A8,8,0,0,1,2.94,13a7.46,7.46,0,0,1-.6-3,7.46,7.46,0,0,1,.6-3A8,8,0,0,1,4.58,4.59,7.74,7.74,0,0,1,7,2.94a7.51,7.51,0,0,1,3-.6,7.45,7.45,0,0,1,3,.6,7.74,7.74,0,0,1,2.43,1.65A7.65,7.65,0,0,1,17.07,7a7.46,7.46,0,0,1,.6,3A7.46,7.46,0,0,1,17.07,13Z"></path>
                </svg>
                {status === "success" ? (
                    <CountDownTimer
                        key={1}
                        finishTime={timestamp}
                    />
                ) : (
                    <CountDownTimer
                        key={2}
                        minutes={10}
                    />
                )}
            </div>
        </div>
    );
};
