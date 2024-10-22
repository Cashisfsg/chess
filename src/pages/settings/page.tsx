import { useState, useEffect } from "react";
import { createNewUser } from "../../entities/user/api/create-user";

import { SearchGameButton } from "../../features/game/search";

interface FormFields {
    userId: HTMLInputElement;
    fullName: HTMLInputElement;
    userName: HTMLInputElement;
}

interface User {
    user_id: string;
    fullname: string;
    username: string;
}

export const SettingsPage = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) return;

        setUser(JSON.parse(storedUser));
    }, []);

    const onSubmitHandler: React.FormEventHandler<
        HTMLFormElement & FormFields
    > = async event => {
        event.preventDefault();

        const { userId, fullName, userName } = event.currentTarget;

        try {
            const newUser = {
                user_id: userId.value,
                fullname: fullName.value,
                username: userName.value
            };

            const response = await createNewUser(newUser);

            if (!response.ok) {
                throw new Error("Something went wrong");
            }

            localStorage.setItem("user", JSON.stringify(newUser));
            setUser(newUser);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <main className="grid flex-auto grid-rows-[auto_1fr_auto] gap-y-8">
            <h1 className="text-4xl font-bold">Настройки</h1>

            <section className="grid place-content-center gap-y-4">
                {!user ? (
                    <form
                        onSubmit={onSubmitHandler}
                        className="grid gap-y-4"
                    >
                        <label>
                            <span>Введите ID пользователя</span>
                            <input
                                required
                                type="number"
                                name="userId"
                                maxLength={12}
                            />
                        </label>

                        <label>
                            <span>Full name</span>
                            <input
                                required
                                name="fullName"
                                maxLength={12}
                            />
                        </label>

                        <label>
                            <span>User name</span>
                            <input
                                required
                                name="userName"
                                maxLength={12}
                            />
                        </label>

                        <button>Создать пользователя</button>
                    </form>
                ) : (
                    <button
                        onClick={() => {
                            localStorage.removeItem("user");
                            setUser(null);
                        }}
                    >
                        Удалить пользователя
                    </button>
                )}

                <SearchGameButton user={user} />

                <button className="flex items-center justify-center gap-x-4 rounded-2xl bg-black/30 px-6 py-4 shadow-lg transition-colors duration-150 active:bg-white/15">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="55"
                        height="55"
                        viewBox="0 0 90 90"
                        fill="none"
                    >
                        <path
                            d="M53.23 47.38H36.77V59.3h16.46V47.38z"
                            fill="#486688"
                        />
                        <path
                            d="M68.95 6.75h-47.9a6.68 6.68 0 0 0-6.68 6.68v28.8a6.68 6.68 0 0 0 6.68 6.68h47.9a6.68 6.68 0 0 0 6.68-6.68v-28.8a6.68 6.68 0 0 0-6.68-6.68z"
                            fill="#B3ACA8"
                        />
                        <path
                            d="M66.58 6.75H23.42a6.35 6.35 0 0 0-6.35 6.35v29.46a6.35 6.35 0 0 0 6.35 6.35h43.16a6.35 6.35 0 0 0 6.35-6.35V13.1a6.35 6.35 0 0 0-6.35-6.35z"
                            fill="#E8E6E1"
                        />
                        <path
                            d="M67.72 11.4H23.08a1.98 1.98 0 0 0-1.98 1.98v28.36a1.98 1.98 0 0 0 1.98 1.98h44.64a1.98 1.98 0 0 0 1.98-1.98V13.38a1.98 1.98 0 0 0-1.98-1.98z"
                            fill="#749BBF"
                        />
                        <path
                            d="M45 83.25c12.07 0 22.95-5.08 30.63-13.22v-5.47a6.68 6.68 0 0 0-6.68-6.68h-47.9a6.68 6.68 0 0 0-6.68 6.68v5.47C22.05 78.16 32.93 83.25 45 83.25z"
                            fill="#B3ACA8"
                        />
                        <path
                            d="M66.57 57.88H23.43c-3.51 0-6.35 2.84-6.35 6.35v8.42c7.44 6.59 17.21 10.59 27.93 10.59 10.72 0 20.49-4.01 27.93-10.59v-8.42c0-3.51-2.84-6.35-6.35-6.35h-.02z"
                            fill="#E8E6E1"
                        />
                        <path
                            d="M48.63 68.23c.24-1.77.23-3.51 0-5.17-.18-1.32-1.36-2.27-2.69-2.27H24.27c-2.09 0-3.78 1.69-3.78 3.78v4.59c0 1.18.6 2.27 1.58 2.93 8.12 5.52 16.18 6.76 19.39 7.04.93.08 1.85-.3 2.45-1.02 2.29-2.73 4.25-6.38 4.73-9.89l-.01.01z"
                            fill="#fff"
                        />
                        <path
                            d="M75.63 19.02h6.43c1.62 0 2.93 1.32 2.93 2.93V34.4c0 1.62-1.32 2.93-2.93 2.93h-6.43V19.01v.01zM14.37 37.33H7.94c-1.62 0-2.93-1.32-2.93-2.93V21.95c0-1.62 1.32-2.93 2.93-2.93h6.43v18.32-.01z"
                            fill="#486688"
                        />
                        <path
                            d="M46 13.44a2.67 2.67 0 0 0-1.52-2.04h-21.4c-.1 0-.2.02-.3.03a2 2 0 0 0-1.69 1.95v20.3c.42.51 1.02.86 1.71.93 1.72.19 6.14.14 7.98-.19 7.93-1.43 14.13-7.87 15.22-15.85.24-1.76.23-3.47 0-5.12v-.01z"
                            fill="#AED0F0"
                        />
                    </svg>
                    <span className="text-2xl font-bold">Найти соперника</span>
                </button>

                <button className="flex items-center justify-center gap-x-4 rounded-2xl bg-black/30 px-6 py-4 shadow-lg transition-colors duration-150 active:bg-white/15">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="55"
                        height="55"
                        viewBox="0 0 90 90"
                        fill="none"
                    >
                        <path
                            d="M53.23 47.38H36.77V59.3h16.46V47.38z"
                            fill="#486688"
                        />
                        <path
                            d="M68.95 6.75h-47.9a6.68 6.68 0 0 0-6.68 6.68v28.8a6.68 6.68 0 0 0 6.68 6.68h47.9a6.68 6.68 0 0 0 6.68-6.68v-28.8a6.68 6.68 0 0 0-6.68-6.68z"
                            fill="#B3ACA8"
                        />
                        <path
                            d="M66.58 6.75H23.42a6.35 6.35 0 0 0-6.35 6.35v29.46a6.35 6.35 0 0 0 6.35 6.35h43.16a6.35 6.35 0 0 0 6.35-6.35V13.1a6.35 6.35 0 0 0-6.35-6.35z"
                            fill="#E8E6E1"
                        />
                        <path
                            d="M67.72 11.4H23.08a1.98 1.98 0 0 0-1.98 1.98v28.36a1.98 1.98 0 0 0 1.98 1.98h44.64a1.98 1.98 0 0 0 1.98-1.98V13.38a1.98 1.98 0 0 0-1.98-1.98z"
                            fill="#749BBF"
                        />
                        <path
                            d="M45 83.25c12.07 0 22.95-5.08 30.63-13.22v-5.47a6.68 6.68 0 0 0-6.68-6.68h-47.9a6.68 6.68 0 0 0-6.68 6.68v5.47C22.05 78.16 32.93 83.25 45 83.25z"
                            fill="#B3ACA8"
                        />
                        <path
                            d="M66.57 57.88H23.43c-3.51 0-6.35 2.84-6.35 6.35v8.42c7.44 6.59 17.21 10.59 27.93 10.59 10.72 0 20.49-4.01 27.93-10.59v-8.42c0-3.51-2.84-6.35-6.35-6.35h-.02z"
                            fill="#E8E6E1"
                        />
                        <path
                            d="M48.63 68.23c.24-1.77.23-3.51 0-5.17-.18-1.32-1.36-2.27-2.69-2.27H24.27c-2.09 0-3.78 1.69-3.78 3.78v4.59c0 1.18.6 2.27 1.58 2.93 8.12 5.52 16.18 6.76 19.39 7.04.93.08 1.85-.3 2.45-1.02 2.29-2.73 4.25-6.38 4.73-9.89l-.01.01z"
                            fill="#fff"
                        />
                        <path
                            d="M75.63 19.02h6.43c1.62 0 2.93 1.32 2.93 2.93V34.4c0 1.62-1.32 2.93-2.93 2.93h-6.43V19.01v.01zM14.37 37.33H7.94c-1.62 0-2.93-1.32-2.93-2.93V21.95c0-1.62 1.32-2.93 2.93-2.93h6.43v18.32-.01z"
                            fill="#486688"
                        />
                        <path
                            d="M46 13.44a2.67 2.67 0 0 0-1.52-2.04h-21.4c-.1 0-.2.02-.3.03a2 2 0 0 0-1.69 1.95v20.3c.42.51 1.02.86 1.71.93 1.72.19 6.14.14 7.98-.19 7.93-1.43 14.13-7.87 15.22-15.85.24-1.76.23-3.47 0-5.12v-.01z"
                            fill="#AED0F0"
                        />
                    </svg>
                    <span className="text-2xl font-bold">Создать лобби</span>
                </button>

                {/* <button className="flex items-center justify-center gap-x-4 rounded-2xl bg-black/30 px-6 py-4 shadow-lg transition-colors duration-150 active:bg-white/15">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="55"
                        height="55"
                        viewBox="0 0 90 90"
                        fill="none"
                    >
                        <path
                            d="M53.23 47.38H36.77V59.3h16.46V47.38z"
                            fill="#486688"
                        />
                        <path
                            d="M68.95 6.75h-47.9a6.68 6.68 0 0 0-6.68 6.68v28.8a6.68 6.68 0 0 0 6.68 6.68h47.9a6.68 6.68 0 0 0 6.68-6.68v-28.8a6.68 6.68 0 0 0-6.68-6.68z"
                            fill="#B3ACA8"
                        />
                        <path
                            d="M66.58 6.75H23.42a6.35 6.35 0 0 0-6.35 6.35v29.46a6.35 6.35 0 0 0 6.35 6.35h43.16a6.35 6.35 0 0 0 6.35-6.35V13.1a6.35 6.35 0 0 0-6.35-6.35z"
                            fill="#E8E6E1"
                        />
                        <path
                            d="M67.72 11.4H23.08a1.98 1.98 0 0 0-1.98 1.98v28.36a1.98 1.98 0 0 0 1.98 1.98h44.64a1.98 1.98 0 0 0 1.98-1.98V13.38a1.98 1.98 0 0 0-1.98-1.98z"
                            fill="#749BBF"
                        />
                        <path
                            d="M45 83.25c12.07 0 22.95-5.08 30.63-13.22v-5.47a6.68 6.68 0 0 0-6.68-6.68h-47.9a6.68 6.68 0 0 0-6.68 6.68v5.47C22.05 78.16 32.93 83.25 45 83.25z"
                            fill="#B3ACA8"
                        />
                        <path
                            d="M66.57 57.88H23.43c-3.51 0-6.35 2.84-6.35 6.35v8.42c7.44 6.59 17.21 10.59 27.93 10.59 10.72 0 20.49-4.01 27.93-10.59v-8.42c0-3.51-2.84-6.35-6.35-6.35h-.02z"
                            fill="#E8E6E1"
                        />
                        <path
                            d="M48.63 68.23c.24-1.77.23-3.51 0-5.17-.18-1.32-1.36-2.27-2.69-2.27H24.27c-2.09 0-3.78 1.69-3.78 3.78v4.59c0 1.18.6 2.27 1.58 2.93 8.12 5.52 16.18 6.76 19.39 7.04.93.08 1.85-.3 2.45-1.02 2.29-2.73 4.25-6.38 4.73-9.89l-.01.01z"
                            fill="#fff"
                        />
                        <path
                            d="M75.63 19.02h6.43c1.62 0 2.93 1.32 2.93 2.93V34.4c0 1.62-1.32 2.93-2.93 2.93h-6.43V19.01v.01zM14.37 37.33H7.94c-1.62 0-2.93-1.32-2.93-2.93V21.95c0-1.62 1.32-2.93 2.93-2.93h6.43v18.32-.01z"
                            fill="#486688"
                        />
                        <path
                            d="M46 13.44a2.67 2.67 0 0 0-1.52-2.04h-21.4c-.1 0-.2.02-.3.03a2 2 0 0 0-1.69 1.95v20.3c.42.51 1.02.86 1.71.93 1.72.19 6.14.14 7.98-.19 7.93-1.43 14.13-7.87 15.22-15.85.24-1.76.23-3.47 0-5.12v-.01z"
                            fill="#AED0F0"
                        />
                    </svg>
                    <span className="text-2xl font-bold">
                        Играть против компьютера
                    </span>
                </button> */}
            </section>

            <footer>
                <p className="mt-4">
                    <span className="text-white/80">
                        <b className="text-white">12 456</b> онлайн
                        пользователей
                    </span>
                </p>
            </footer>
        </main>
    );
};
