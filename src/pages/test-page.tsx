import { useTelegramCloudStorage } from "@/shared/lib/hooks/use-telegram-cloud-storage";

interface FormFields {
    query: HTMLInputElement;
}

export const TestPage = () => {
    const [state, dispatch] = useTelegramCloudStorage<string>();

    const onSubmitHandler: React.FormEventHandler<
        HTMLFormElement & FormFields
    > = event => {
        event.preventDefault();

        const { query } = event.currentTarget;

        dispatch({
            type: "create",
            payload: { key: "query", value: query.value }
        });
    };

    return (
        <form onSubmit={onSubmitHandler}>
            <input
                type="text"
                name="query"
            />
            <button>Добавить в облачное хранилище ТГ</button>
            <p>
                Stored value: <span>{state.data}</span>
            </p>

            <button
                type="button"
                onClick={() => {
                    dispatch({ type: "read", payload: { key: "query" } });
                }}
            >
                Прочитать из хранилища
            </button>
        </form>
    );
};
