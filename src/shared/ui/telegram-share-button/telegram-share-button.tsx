interface TelegramShareButtonProps
    extends Omit<React.ComponentPropsWithoutRef<"a">, "href"> {
    url: string;
    caption?: string;
    receiver?: string;
}

export const TelegramShareButton: React.FC<TelegramShareButtonProps> = ({
    url,
    caption = "",
    receiver = "",
    ...props
}) => {
    return (
        <a
            href={`https://t.me/share/url?url=${url}&text=${caption}&to=${receiver}`}
            {...props}
        />
    );
};
