import { SourceControlResourceState } from "vscode";
import { ResourceStateList } from "./resourceStateList";
import { RemoteResource } from "./remote/remoteResource";

export class GitResourceStateListProvider implements ResourceStateList {
    sourceControlResourceStateList: SourceControlResourceState[];

    constructor() {
        this.sourceControlResourceStateList = [];
    }

    load(filter?: string): this {
        const elements = [];
        // dummy elements to test
        for (let i = 1; i <= 250; i++) {
            elements.push(new RemoteResource(`root_${i}.txt`));
        }

        if (filter) {
            this.sourceControlResourceStateList = elements.filter(element => element.resourceUri.fsPath.includes(filter));
        } else {
            this.sourceControlResourceStateList = [...elements];
        }
        return this;
    }

    getResourceList(): SourceControlResourceState[] {
        return this.sourceControlResourceStateList;
    }
}
