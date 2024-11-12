interface ClipboardCopyProps extends React.ComponentPropsWithoutRef<"button"> {
    textToCopy: number | string | undefined;
}

export const ClipboardCopy: React.FC<ClipboardCopyProps> = ({
    textToCopy,
    ...props
}) => {
    const copyToClipboard: React.MouseEventHandler<
        HTMLButtonElement
    > = async event => {
        event.preventDefault();

        if (textToCopy === undefined) return;

        try {
            await navigator.clipboard.writeText(String(textToCopy));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <button
            {...props}
            onClick={copyToClipboard}
            title="Скопировать в буфер обмена"
            className="flex items-center justify-center gap-x-4 rounded-2xl bg-[#5d9948] px-6 py-4 text-xl font-bold text-white shadow-lg transition-colors duration-150 active:bg-[#a3d160] disabled:opacity-50"
        >
            <svg
                width="24"
                height="24"
                viewBox="0 0 26 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g clipPath="url(#clip0_140_1511)">
                    <path
                        d="M7.8 7.8V2.6C7.8 1.17 8.97 0 10.4 0H23.4C24.0896 0 24.7509 0.273928 25.2385 0.761522C25.7261 1.24912 26 1.91044 26 2.6V15.6C26 16.2896 25.7261 16.9509 25.2385 17.4385C24.7509 17.9261 24.0896 18.2 23.4 18.2H18.2V23.4C18.2 24.0896 17.9261 24.7509 17.4385 25.2385C16.9509 25.7261 16.2896 26 15.6 26H2.6C1.91044 26 1.24912 25.7261 0.761522 25.2385C0.273928 24.7509 0 24.0896 0 23.4V10.4C0 8.97 1.17 7.8 2.6 7.8H7.8ZM10.4 7.8H15.6C16.2896 7.8 16.9509 8.07393 17.4385 8.56152C17.9261 9.04912 18.2 9.71044 18.2 10.4V15.6H23.4V2.6H10.4V7.8ZM2.6 10.4V23.4H15.6V10.4H2.6Z"
                        fill="#FEF7FF"
                    />
                </g>
                <defs>
                    <clipPath id="clip0_140_1511">
                        <rect
                            width="26"
                            height="26"
                            fill="#FEF7FF"
                        />
                    </clipPath>
                </defs>
            </svg>
            <span>Копировать ссылку</span>
        </button>
    );
};
