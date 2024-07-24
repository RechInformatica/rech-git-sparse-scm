import fs from 'fs';
import { Command, SourceControlResourceDecorations, SourceControlResourceState, Uri } from "vscode";
import { GitExecutor } from "../../../git/GitExecutor";
import { RemoteResourceDecoration } from "./RemoteResourceDecoration";
import { RemotePreviewCommand } from "../../../commands/RemotePreviewCommand";

/**
 * Represents a remote resource state in source control.
 */
export class RemoteResource implements SourceControlResourceState {

    resourceUri: Uri;
    command?: Command;
    decorations?: SourceControlResourceDecorations;
    contextValue?: string;

    /**
     * Creates an instance of RemoteResource.
     *
     * @param {string} name - The name or path of the remote resource.
     */
    constructor(name: string) {
        this.resourceUri = Uri.parse(name);
        const localUri = GitExecutor.getIntance().getRepoPath()?.concat(this.resourceUri.path);
        const existsLocal = (localUri !== undefined && fs.existsSync(localUri));
        this.decorations = new RemoteResourceDecoration(existsLocal);
        if (existsLocal) {
            this.command = {
                command: 'vscode.open',
                title: 'Open File',
                arguments: [Uri.file(localUri)]
            };
            this.contextValue = "local";
        } else {
            this.command = new RemotePreviewCommand(this.resourceUri);
            this.contextValue = "remote";
        }
    }
}
