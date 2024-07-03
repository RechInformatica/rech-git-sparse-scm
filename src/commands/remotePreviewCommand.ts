import { Command, Uri } from "vscode";
import * as vscode from 'vscode';
import { GitExecutor } from "../git/gitExecutor";
import { VirtualDocument } from "../util/virtualDocument";

/**
 * Represents a command to preview remote files.
 */
export class RemotePreviewCommand implements Command {
    title: string;
    command: string;
    arguments?: any[] | undefined;

    /**
     * Creates an instance of RemotePreviewCommand.
     *
     * @param {Uri} resourceUri - The URI of the resource to preview remotely.
     */
    constructor(resourceUri: Uri) {
        this.title = "Open Remote Preview";
        this.command = "rech-git-sparse-scm.remotePreview";
        this.arguments = [resourceUri];
    }

    /**
    * Opens a preview of a remote file.
    *
    * @param {Uri} resourceUri - The URI of the remote resource to preview.
    * @param {vscode.ExtensionContext} context - The extension context to manage subscriptions.
    */
    public static async openPreview(resourceUri: Uri, context: vscode.ExtensionContext) {
        const isImage = /\.(png|jpe?g|gif|bmp|webp|svg)$/i.test(resourceUri.path);
        if (isImage) {
            this.openImagePreview(resourceUri);
        } else {
            GitExecutor.getIntance().catFile(resourceUri).then(async (fileContent) => {
                const schemeName = "remote-preview";
                const virtualDocument = new VirtualDocument(fileContent);
                context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(schemeName, virtualDocument));

                const uri = vscode.Uri.parse(schemeName + ":" + resourceUri.path);
                const doc = await vscode.workspace.openTextDocument(uri);
                await vscode.window.showTextDocument(doc, { preview: true });
            });
        }
    }

    /**
     * Opens a preview of an image file.
     *
     * @param {Uri} resourceUri - The URI of the remote image resource to preview.
     */
    private static openImagePreview(resourceUri: Uri) {
        const panel = vscode.window.createWebviewPanel(
            'imagePreview',
            resourceUri.path,
            vscode.ViewColumn.One,
            {}
        );
        const gitExecutor = GitExecutor.getIntance();
        gitExecutor.currentBranch().then((currentBranch) => {
            gitExecutor.isPublishedBranch(currentBranch).then((published) => {
                let branch;
                if (published) {
                    branch = currentBranch;
                } else {
                    const gitConfig = vscode.workspace.getConfiguration('git');
                    branch = gitConfig.get<string>('defaultBranchName');
                }
                panel.webview.html = `<img src="https://gitlab.rech.com.br/gitlab/rech/java/JRIUtil/-/raw/${branch}${resourceUri.fsPath.replaceAll('\\', '/')}"/>`;
            });
        });
    }
}
