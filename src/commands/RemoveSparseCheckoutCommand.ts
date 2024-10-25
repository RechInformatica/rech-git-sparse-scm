import { Command, Uri, commands, window, workspace } from "vscode";
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
     * Removes multiple files from sparse checkout sequentially.
     *
     * @param {string[]} resourcePaths - An array of file paths to be removed from sparse checkout.
     * @returns {Promise<void>} - A promise that resolves when all files have been processed.
     */
    public static async removeAllSparseCheckout(resourcePaths: string[]): Promise<void> {
        for (const file of resourcePaths) {
            await RemoveSparseCheckoutCommand.removeSparseCheckout(file, false);
        }
    }
    /**
     * Remove file from sparse checkout.
     *
     * @param {Uri} resourceUri - The URI of the resource to perform sparse checkout remove.
     */
    public static removeSparseCheckout(resourcePath: string, message = true): Promise<void> {
        return new Promise((resolve, reject) => {
            const resourceUri = Uri.file(resourcePath);
            if (message) {
                window.showWarningMessage(
                    `Você tem certeza que deseja remover ${resourceUri.fsPath} do sparse-checkout?\n O arquivo será deletado e as alterações perdidas.`,
                    { modal: true },
                    'Sim', 'Não'
                ).then(selection => {
                    if (selection === 'Sim') {
                        this.removeSparseCheckoutCommand(resourceUri).then(resolve).catch(reject);
                    } else {
                        resolve();
                    }
                });
            } else {
                this.removeSparseCheckoutCommand(resourceUri).then(resolve).catch(reject);
            }
        });
    }

    private static removeSparseCheckoutCommand(resourceUri: Uri): Promise<void> {
        const gitExecutor = GitExecutor.getIntance();
        return gitExecutor.restoreStage(resourceUri)
            .then(() => gitExecutor.restore(resourceUri))
            .then(() => gitExecutor.sparseCheckoutRemove(resourceUri))
            .then(() => gitExecutor.checkout())
            .then(() => {
                window.showInformationMessage(`Removed ${resourceUri.fsPath} from sparse-checkout.`);
            });
    }

}
