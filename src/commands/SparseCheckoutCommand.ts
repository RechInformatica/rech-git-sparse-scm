import { Command, Uri, commands, ExtensionContext } from "vscode";
import { GitExecutor } from "../git/GitExecutor";
import { RemotePreviewCommand } from "./RemotePreviewCommand";

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
     * @param {string} resourcePath - The path of the resource to perform sparse checkout on.
     */
    public static sparseCheckout(resourcePath: string, context: ExtensionContext) {
        const gitExecutor = GitExecutor.getIntance();
        gitExecutor.sparseCheckoutAdd(resourcePath).then(() => {
            gitExecutor.checkout().then(() => {
                let fileUri = Uri.file(resourcePath);
                RemotePreviewCommand.openPreview(fileUri, context)
            });
        });
    }
}
