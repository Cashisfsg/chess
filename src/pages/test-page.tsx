import { useTelegramCloudStorage } from "@/shared/lib/hooks/use-telegram-cloud-storage";

interface FormFields {
    query: HTMLInputElement;
}

export const TestPage = () => {
    const [state, dispatch] = useTelegramCloudStorage<string>("test_query");

    console.log("Telegram cloud storage value: " + state.data);
    console.log(state);

    const onSubmitHandler: React.FormEventHandler<
        HTMLFormElement & FormFields
    > = event => {
        event.preventDefault();

        const { query } = event.currentTarget;

        dispatch({
            type: "create",
            payload: { value: query.value }
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
                    dispatch({ type: "read" });
                }}
            >
                Прочитать из хранилища
            </button>

            <button
                type="button"
                onClick={() => {
                    dispatch({ type: "delete" });
                }}
            >
                Удалить из хранилища
            </button>
        </form>
    );
};
