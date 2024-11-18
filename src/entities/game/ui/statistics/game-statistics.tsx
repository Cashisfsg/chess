import useSWR from "swr";

import { baseQuery } from "@/shared/api/config";

interface GameStatisticsProps extends React.ComponentPropsWithoutRef<"p"> {}

export const GameStatistics: React.FC<GameStatisticsProps> = props => {
    const { data, isLoading } = useSWR<{ active_users: number }>(
        "/stats/all",
        baseQuery,
        {
            // refreshInterval: 5000,
            // revalidateOnMount: false,
            onError: error => console.error(error)
        }
    );

    return (
        <p
            className="mt-4 text-center text-white/80"
            {...props}
        >
            {isLoading ? (
                <span className="inline-block h-3 w-64 animate-pulse rounded-full bg-slate-400" />
            ) : (
                <>
                    <strong className="text-white">{data?.active_users}</strong>{" "}
                    онлайн пользователей
                </>
            )}
        </p>
    );
};
