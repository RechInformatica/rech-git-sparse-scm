import { Command, Uri, commands, window } from "vscode";
import { GitExecutor } from "../git/GitExecutor";

/**
 * Represents a command to perform sparse checkout in Git.
 */
export class RemoveSparseCheckoutCommand implements Command {

    title: string;
    command: string;
    arguments?: any[];

    /**
     * Creates an instance of SparseCheckoutCommand.
     *
     * @param {Uri} resourceUri - The URI of the resource to perform sparse checkout on.
     */
    constructor(resourceUri: Uri) {
        this.title = "Remove Sparse Checkout";
        this.command = "rech-git-sparse-scm.removeSparseCheckout";
        this.arguments = [resourceUri];
    }

    /**
     * Remove file from sparse checkout.
     *
     * @param {Uri} resourceUri - The URI of the resource to perform sparse checkout remove.
     */
    public static removeSparseCheckout(resourceUri: Uri) {
        window.showWarningMessage(
            `Você tem certeza que deseja remover ${resourceUri.fsPath} do sparse-checkout?\n O arquivo será deletado e as alterações perdidas.`,
            { modal: true },
            'Sim', 'Não'
        ).then(selection => {
            if (selection === 'Sim') {
                const gitExecutor = GitExecutor.getIntance();
                // Restore file and delete
                gitExecutor.restoreStage(resourceUri).then(() => {
                    gitExecutor.restore(resourceUri).then(() => {
                        gitExecutor.sparseCheckoutRemove(resourceUri).then(() => {
                            gitExecutor.checkout().then(() => {
                                window.showInformationMessage(`Removed ${resourceUri.fsPath} from sparse-checkout.`);
                            });
                        });
                    });
                });
            }
        });
    }
}
