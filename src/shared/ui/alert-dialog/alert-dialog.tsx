import { useRef, useMemo, useId } from "react";
import {
    AlertDialogContext,
    useAlertDialogContext
} from "./use-alert-dialog-context";
import { composeRefs } from "@/shared/lib/utils/compose-refs";
import { composeEventHandlers } from "@/shared/lib/utils/compose-event-handlers";

interface RootProps extends React.PropsWithChildren {}

export const Root: React.FC<RootProps> = ({ children }) => {
    const alertDialogId = `alert-dialog-${useId()}`;
    const alertDialogLabelId = `alert-dialog-label-${useId()}`;
    const alertDialogDescriptionId = `alert-dialog-description-${useId()}`;
    const alertDialogRef = useRef<HTMLDialogElement>(null);

    const context = useMemo(
        () => ({
            alertDialogId,
            alertDialogLabelId,
            alertDialogDescriptionId,
            alertDialogRef
        }),
        []
    );

    return (
        <AlertDialogContext.Provider value={context}>
            {children}
        </AlertDialogContext.Provider>
    );
};

Root.displayName = "AlertDialog.Root";

interface ContentProps
    extends Omit<
        React.ComponentPropsWithoutRef<"dialog">,
        | "id"
        | "role"
        // | "aria-modal"
        // | "popover"
        | "aria-labelledby"
        | "aria-describedby"
    > {
    forwardRef?: React.RefObject<HTMLDialogElement>;
}

export const Content: React.FC<ContentProps> = ({ forwardRef, ...props }) => {
    const {
        alertDialogId,
        alertDialogLabelId,
        alertDialogDescriptionId,
        alertDialogRef
    } = useAlertDialogContext();

    return (
        <dialog
            {...props}
            id={alertDialogId}
            role="alertdialog"
            // aria-modal="true"
            aria-labelledby={alertDialogLabelId}
            aria-describedby={alertDialogDescriptionId}
            ref={composeRefs(forwardRef, alertDialogRef)}
        />
    );
};

Content.displayName = "AlertDialog.Content";

interface LabelProps extends Omit<React.ComponentPropsWithoutRef<"h2">, "id"> {}

export const Label: React.FC<LabelProps> = props => {
    const { alertDialogLabelId } = useAlertDialogContext();

    return (
        <h2
            {...props}
            id={alertDialogLabelId}
        />
    );
};

Label.displayName = "AlertDialog.Label";

interface DescriptionProps
    extends Omit<React.ComponentPropsWithoutRef<"div">, "id"> {}

export const Description: React.FC<DescriptionProps> = props => {
    const { alertDialogDescriptionId } = useAlertDialogContext();

    return (
        <div
            {...props}
            id={alertDialogDescriptionId}
        />
    );
};

Description.displayName = "AlertDialog.Description";

interface CloseProps extends React.ComponentPropsWithoutRef<"button"> {}

export const Close: React.FC<CloseProps> = ({
    type = "button",
    onClick,
    ...props
}) => {
    const { alertDialogRef } = useAlertDialogContext();

    const onClickHandler = () => {
        alertDialogRef.current?.close();
    };

    return (
        <button
            {...props}
            type={type}
            onClick={composeEventHandlers(onClick, onClickHandler)}
        />
    );
};

Close.displayName = "AlertDialog.Close";
