import { Link } from "react-router-dom";
import { AlertDialog } from "@/shared/ui/alert-dialog";

export const GameOverDialog = () => {
    return (
        <AlertDialog.Root>
            <AlertDialog.Content>
                <AlertDialog.Label>Победили белые</AlertDialog.Label>
                <Link to="/settings">Новая игра</Link>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
};
