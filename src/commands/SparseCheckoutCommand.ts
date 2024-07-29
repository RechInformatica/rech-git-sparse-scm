import { Command, Uri, commands } from "vscode";
import { GitExecutor } from "../git/GitExecutor";

/**
 * Represents a command to perform sparse checkout in Git.
 */
export class SparseCheckoutCommand implements Command {

    title: string;
    command: string;
    arguments?: any[];

    /**
     * Creates an instance of SparseCheckoutCommand.
     *
     * @param {Uri} resourceUri - The URI of the resource to perform sparse checkout on.
     */
    constructor(resourceUri: Uri) {
        this.title = "Sparse Checkout";
        this.command = "rech-git-sparse-scm.sparseCheckout";
        this.arguments = [resourceUri];
    }

    /**
     * Executes the sparse checkout command.
     *
     * @param {Uri} resourceUri - The URI of the resource to perform sparse checkout on.
     */
    public static sparseCheckout(resourceUri: Uri) {
        const gitExecutor = GitExecutor.getIntance();
        gitExecutor.sparseCheckoutAdd(resourceUri).then(() => {
            gitExecutor.checkout().then(() => {
                commands.executeCommand('vscode.open', "." + resourceUri.path);
            });
        });
    }
}
