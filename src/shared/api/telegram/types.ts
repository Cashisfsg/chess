//! ================= Telegram types ================= //

interface WebAppUser {
    id: number;
    is_bot: boolean;
    first_name: string;
    last_name: string;
    username: string;
    language_code: string;
    is_premium: boolean;
    added_to_attachment_menu: boolean;
    allows_write_to_pm: boolean;
    photo_url: string;
}

interface WebAppChat {
    id: number;
    type: string;
    title: string;
    username: string;
    photo_url: string;
}
interface WebAppInitData {
    query_id: string;
    user: WebAppUser;
    receiver: WebAppUser;
    chat: WebAppChat;
    chat_type: string;
    chat_instance: string;
    start_param: string;
    can_send_after: number;
    auth_date: number;
    hash: string;
}

interface BackButton {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
}

interface MainButton {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive: unknown) => boolean;
    hideProgress: () => void;
    setParams: (params: {
        text: string;
        color: string;
        text_color: string;
        is_active: boolean;
        is_visible: boolean;
    }) => void;
}

interface WebApp {
    initData: string;
    initDataUnsafe: WebAppInitData;
    version: string;
    platform: string;
    colorScheme: string;
    isExpanded: boolean;
    viewportHeight: number;
    viewportStableHeight: number;
    headerColor: string;
    backgroundColor: string;
    isClosingConfirmationEnabled: boolean;
    BackButton: BackButton;
    MainButton: MainButton;
    openLink: (url: string) => void;
    showScanQrPopup: (text?: string) => void;
}

export interface TelegramClient {
    WebApp: WebApp;
}
