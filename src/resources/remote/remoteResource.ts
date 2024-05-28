import {
    Command,
    SourceControlResourceDecorations,
    SourceControlResourceState,
    Uri
  } from "vscode";

import { sparseCheckoutCommand } from "../../commands/SparseCheckoutCommand";
import { RemoteResourceDecoration } from "./remoteResourceDecoration";

export class RemoteResource implements SourceControlResourceState {
    resourceUri: Uri;
    command?: Command | undefined;
    decorations?: SourceControlResourceDecorations | undefined;
    contextValue?: string | undefined;

    constructor(name: string) {
        this.command = new sparseCheckoutCommand();
        this.decorations = new RemoteResourceDecoration();
        this.resourceUri = Uri.parse(name);
        this.contextValue = "remote";
    }

}
