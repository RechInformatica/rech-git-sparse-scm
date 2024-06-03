import { SourceControlResourceState } from "vscode";

export interface ResourceStateProvider {
    sourceControlResourceStateList: SourceControlResourceState[];

    load(filter?: string): this;
    getResourceList(): SourceControlResourceState[];
}
