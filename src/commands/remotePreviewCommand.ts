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
        this.title = "Remote Preview";
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
        GitExecutor.getIntance().show("master", resourceUri).then(async (fileContent) => {
            const schemeName = "remote-preview";
            const virtualDocument = new VirtualDocument(fileContent);
            context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(schemeName, virtualDocument));

            const uri = vscode.Uri.parse(schemeName + ":" + resourceUri.path);
            const doc = await vscode.workspace.openTextDocument(uri);
            // TODO:Verificar como abrir documentos que não sejam texto. Abrir visualização de imagem, por exemplo, ou Preview de readme.md como da pra fazer pelo explorer normal
            await vscode.window.showTextDocument(doc, { preview: true });
        });
    }
}
