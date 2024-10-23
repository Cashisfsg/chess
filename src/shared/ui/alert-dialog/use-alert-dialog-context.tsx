import { createContext, useContext } from "react";

export const AlertDialogContext = createContext<{
    alertDialogId: string;
    alertDialogLabelId: string;
    alertDialogDescriptionId: string;
    alertDialogRef: React.RefObject<HTMLDivElement>;
} | null>(null);

export const useAlertDialogContext = () => {
    const context = useContext(AlertDialogContext);

    if (!context) {
        throw new Error(
            "Component must be rendered as child of AlertDialog component"
        );
    }

    return context;
};
