import {
    SourceControlResourceDecorations,
} from "vscode";

export class RemoteResourceDecoration implements SourceControlResourceDecorations {
    faded?: boolean | undefined;

    constructor() {
        this.faded = true;
    }
}
