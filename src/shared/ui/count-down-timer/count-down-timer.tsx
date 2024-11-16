import { useState, useEffect, useRef } from "react";

interface DefaultTimerProps extends React.TimeHTMLAttributes<HTMLTimeElement> {
    onTimeout?: () => void;
}

interface TimeDurationNumeric extends DefaultTimerProps {
    finishTime?: never;
    minutes?: number;
    seconds?: number;
}

interface TimeDurationString extends DefaultTimerProps {
    finishTime: number | string | undefined;
    minutes?: never;
    seconds?: never;
}

type TimerProps = TimeDurationNumeric | TimeDurationString;

const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTE_PER_HOUR = 60;

export const CountDownTimer: React.FC<TimerProps> = ({
    finishTime,
    minutes = 0,
    seconds = 0,
    onTimeout,
    ...props
}) => {
    const targetTime = useRef(
        finishTime
            ? new Date(finishTime).getTime()
            : new Date(
                  new Date().getTime() +
                      (minutes * SECONDS_PER_MINUTE + seconds + 1) *
                          MILLISECONDS_PER_SECOND
              ).getTime()
    );

    const [time, setTime] = useState(() => {
        if (finishTime === undefined)
            return { minutes: minutes, seconds: seconds };

        const currentTime = new Date().getTime();
        const timeDifference = targetTime.current - currentTime;

        if (timeDifference <= 0) return { minutes: minutes, seconds: seconds };

        const startMinutes = Math.floor(
            (timeDifference %
                (MILLISECONDS_PER_SECOND *
                    SECONDS_PER_MINUTE *
                    MINUTE_PER_HOUR)) /
                (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE)
        );

        const startSeconds = Math.floor(
            (timeDifference % (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE)) /
                MILLISECONDS_PER_SECOND
        );

        return { minutes: startMinutes, seconds: startSeconds };
    });

    // prettier-ignore
    const timeString = `${
        `${time.minutes}`.padStart(2, "0")
    }:${
        `${time.seconds}`.padStart(2, "0")
    }`;

    useEffect(() => {
        const timer = setInterval(() => {
            const currentTime = new Date().getTime();
            const timeDifference = targetTime.current - currentTime;

            if (timeDifference <= 0) {
                onTimeout?.();
                clearInterval(timer);
                setTime(time => ({ ...time, minutes: 0, seconds: 0 }));
                return;
            }

            const minutesLeft = Math.floor(
                (timeDifference %
                    (MILLISECONDS_PER_SECOND *
                        SECONDS_PER_MINUTE *
                        MINUTE_PER_HOUR)) /
                    (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE)
            );

            const secondsLeft = Math.floor(
                (timeDifference %
                    (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE)) /
                    MILLISECONDS_PER_SECOND
            );

            setTime(time => ({
                ...time,
                minutes: minutesLeft,
                seconds: secondsLeft
            }));
        }, 1000);

        return () => clearInterval(timer);
    }, [finishTime, minutes, seconds, onTimeout]);

    return (
        <time
            {...props}
            dateTime={`PT${time.minutes}M${time.seconds}S`}
        >
            {timeString}
        </time>
    );
};
