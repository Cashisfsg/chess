export const composeRefs = <T>(
    ...refs: (
        | React.MutableRefObject<T | null>
        | React.RefCallback<T>
        | null
        | undefined
    )[]
): React.RefCallback<T> => {
    return (instance: T | null) => {
        refs.forEach(ref => {
            if (typeof ref === "function") {
                ref(instance);
            } else if (ref != null && ref !== undefined) {
                ref.current = instance;
            }
        });
    };
};
