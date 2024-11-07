//! ================= Telegram types ================= //

interface WebAppUser {
    id: number;
    is_bot?: boolean;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    is_premium?: boolean;
    added_to_attachment_menu?: boolean;
    allows_write_to_pm?: boolean;
    photo_url?: string;
}

type WebAppChatType = "group" | "supergroup" | "channel";

interface WebAppChat {
    id: number;
    type: WebAppChatType;
    title: string;
    username?: string;
    photo_url?: string;
}
interface WebAppInitData {
    query_id?: string;
    user?: WebAppUser;
    receiver?: WebAppUser;
    chat?: WebAppChat;
    chat_type?: string;
    chat_instance?: string;
    start_param?: string;
    can_send_after?: number;
    auth_date: number;
    hash: string;
}

interface ThemeParams {
    bg_color: string;
    text_color: string;
    hint_color: string;
    link_color: string;
    button_color: string;
    button_text_color: string;
    secondary_bg_color: string;
    header_bg_color: string;
    bottom_bar_bg_color: string;
    accent_text_color: string;
    section_bg_color: string;
    section_header_text_color: string;
    section_separator_color: string;
    subtitle_text_color: string;
    destructive_text_color: string;
}

interface BackButton {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
}

interface MainButton {
    type: Readonly<string>;
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    hasShineEffect: boolean;
    position: string;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive: boolean) => void;
    hideProgress: () => void;
    setParams: (params: {
        text: string;
        color: string;
        text_color: string;
        has_shine_effect: boolean;
        position: string;
        is_active: boolean;
        is_visible: boolean;
    }) => void;
}

interface SettingsButton {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
}

type NotificationType = "error" | "success" | "warning";

interface HapticFeedback {
    impactOccurred: (
        style: "light" | "medium" | "heavy" | "rigid" | "soft"
    ) => void;
    notificationOccurred: (type: NotificationType) => void;
    selectionChanged: () => void;
}

export interface CloudStorage {
    setItem: (
        key: string,
        value: string,
        callback: (error: string | null, success?: boolean) => void

        // callback?: {
        //     (error: string): void;
        //     (error: null, success: boolean): void;
        // }
    ) => void;
    getItem: (
        key: string,
        callback: (error: string | null, value?: string) => string | void
    ) => void;
    getItems: (
        keys: string[],
        callback: (error: Error | null, values?: string[]) => void
    ) => void;
    removeItem: (
        key: string,
        callback?: (error: Error | null, success?: boolean) => void
    ) => void;
    removeItems: (
        keys: string[],
        callback?: (error: Error | null, success?: boolean) => void
    ) => void;
    getKeys: (callback: (error: Error | null, keys?: string[]) => void) => void;
}

type BiometricType = "finger" | "face" | "unknown";

interface BiometricRequestAccessParams {
    reason?: string;
}

interface BiometricAuthenticateParams {
    // !The text to be displayed to a user in the popup describing why you are asking them to authenticate and what action you will be taking based on that authentication, 0-128 characters.
    reason?: string;
}

interface BiometricManager {
    isInited: boolean;
    isBiometricAvailable: boolean;
    biometricType: BiometricType;
    isAccessRequested: boolean;
    isAccessGranted: boolean;
    isBiometricTokenSaved: boolean;
    deviceId: string;
    init: (callback?: () => void) => void;
    requestAccess: (
        params: BiometricRequestAccessParams,
        callback?: (accessGranted: boolean) => void
    ) => void;
    authenticate: (
        params: BiometricAuthenticateParams,
        callback?: (success: boolean, token?: string) => void
    ) => void;
    updateBiometricToken: (
        token: string,
        callback?: (success: boolean) => void
    ) => void;
    openSettings: () => void;
}

type EventType =
    | "themeChanged"
    | "viewportChanged"
    | "mainButtonClicked"
    | "secondaryButtonClicked"
    | "backButtonClicked"
    | "settingsButtonClicked"
    | "invoiceClosed"
    | "popupClosed"
    | "qrTextReceived"
    | "scanQrPopupClosed"
    | "clipboardTextReceived"
    | "writeAccessRequested"
    | "contactRequested"
    | "biometricManagerUpdated"
    | "biometricAuthRequested"
    | "biometricTokenUpdated";

interface StoryWidgetLink {
    url: string;
    name?: string;
}
interface StoryShareParams {
    text: string;
    widget_link?: StoryWidgetLink;
}

type PopupButtonType = "default" | "ok" | "close" | "cancel" | "destructive";

interface PopupButton {
    id?: string;
    type?: PopupButtonType;
    text?: string;
}

interface PopupParams {
    title?: string;
    message: string;
    buttons?: PopupButton[];
}

interface ScanQrPopupParams {
    text?: string;
}

interface WebApp {
    initData: string;
    initDataUnsafe: WebAppInitData;
    version: string;
    platform: string;
    colorScheme: string;
    themeParams: ThemeParams;
    isExpanded: boolean;
    viewportHeight: number;
    viewportStableHeight: number;
    headerColor: string;
    backgroundColor: string;
    bottomBarColor: string;
    isClosingConfirmationEnabled: boolean;
    isVerticalSwipesEnabled: boolean;
    BackButton: BackButton;
    MainButton: MainButton;
    SecondaryButton: MainButton;
    SettingsButton: SettingsButton;
    HapticFeedback: HapticFeedback;
    CloudStorage: CloudStorage;
    BiometricManager: BiometricManager;
    isVersionAtLeast: (version: string) => boolean;
    setHeaderColor: (color: string) => void;
    setBackgroundColor: (color: string) => void;
    setBottomBarColor: (color: string) => void;
    enableClosingConfirmation: () => void;
    disableClosingConfirmation: () => void;
    enableVerticalSwipes: () => void;
    disableVerticalSwipes: () => void;
    onEvent: (eventType: EventType, eventHandler: () => void) => void;
    offEvent: (eventType: EventType, eventHandler: () => void) => void;
    sendData: (data: { data: string; button_text: string }) => void;
    openLink: (url: string, options?: { try_instant_view: boolean }) => void;
    openTelegramLink: (url: string) => void;
    openInvoice: (url: string, callback?: (status: string) => void) => void;
    shareToStory: (media_url: string, params?: StoryShareParams) => void;
    showPopup: (params: PopupParams, callback?: (id: string) => void) => void;
    showAlert: (message: string, callback?: () => void) => void;
    showConfirm: (
        message: string,
        callback?: (success: boolean) => void
    ) => void;
    showScanQrPopup: (
        params: ScanQrPopupParams,
        callback?: (text: string) => boolean
    ) => void;
    closeScanQrPopup: () => void;
    readTextFromClipboard: (callback?: (text: string) => void) => void;
    requestWriteAccess: (callback?: (accessGranted: boolean) => void) => void;
    requestContact: (callback?: (success: boolean) => void) => void;
    ready: () => void;
    expand: () => void;
    close: () => void;
}

export interface TelegramClient {
    WebApp: WebApp;
}
