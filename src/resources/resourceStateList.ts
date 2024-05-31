import { SourceControlResourceState } from "vscode";

export interface ResourceStateList {
    sourceControlResourceStateList: SourceControlResourceState[];

    load(filter?: string): this;
    getResourceList(): SourceControlResourceState[];
}
