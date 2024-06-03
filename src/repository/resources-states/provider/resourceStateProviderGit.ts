import { SourceControlResourceState } from "vscode";
import { ResourceStateProvider } from "./resourceStateProvider";
// import { RemoteResource } from "./remote/remoteResource";

export class ResourceStateProviderGit implements ResourceStateProvider {
    sourceControlResourceStateList: SourceControlResourceState[];

    constructor() {
        this.sourceControlResourceStateList = [];
    }

    load(filter?: string): this {
        if (filter) {
            return this;
        }
        return this;
    }

    getResourceList(): SourceControlResourceState[] {
        return this.sourceControlResourceStateList;
    }
}
