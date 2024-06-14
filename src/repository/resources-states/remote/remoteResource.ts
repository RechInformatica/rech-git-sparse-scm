import {
    Command,
    SourceControlResourceDecorations,
    SourceControlResourceState,
    Uri
} from "vscode";

import { RemoteResourceDecoration } from "./remoteResourceDecoration";
import { RemotePreviewCommand } from "../../../commands/remotePreviewCommand";

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
        this.command = new RemotePreviewCommand(this.resourceUri);
        this.decorations = new RemoteResourceDecoration();
        this.contextValue = "remote";
    }
}
