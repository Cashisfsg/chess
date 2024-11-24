import { AlertDialog } from "@/shared/ui/alert-dialog";
import { Link } from "react-router-dom";

interface GameOverDialogSinglePlayerProps {
    dialogRef: React.RefObject<HTMLDialogElement>;
    label: string;
    description: string;
}

export const GameOverDialogSinglePlayer: React.FC<
    GameOverDialogSinglePlayerProps
> = ({ dialogRef, label, description }) => {
    return (
        <AlertDialog.Root>
            <AlertDialog.Content
                forwardRef={dialogRef}
                className="fixed inset-0 my-auto flex-col gap-y-4 overflow-hidden rounded-2xl bg-black p-4 open:flex"
            >
                <AlertDialog.Label className="-mx-4 -mt-4 bg-[#1f1f1f] py-4 text-2xl font-bold text-white">
                    {label}
                </AlertDialog.Label>
                <AlertDialog.Description className="text-lg font-bold text-white">
                    {description}
                </AlertDialog.Description>
                <Link
                    to="/"
                    className="flex items-center justify-center gap-x-4 rounded-2xl bg-[#5d9948] px-6 py-4 text-2xl font-bold text-white shadow-lg transition-colors duration-150 active:bg-[#a3d160] disabled:opacity-50"
                >
                    Новая игра
                </Link>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
};
