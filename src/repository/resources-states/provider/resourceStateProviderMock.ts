import { SourceControlResourceState } from "vscode";
import { ResourceStateProvider } from "./resourceStateProvider";
import { RemoteResource } from "../remote/remoteResource";
import { rejects } from "assert";

/**
 * Mock implementation of ResourceStateProvider for testing purposes.
 */
export class ResourceStateProviderMock implements ResourceStateProvider {
    /**
     * List of source control resource states.
     */
    sourceControlResourceStateList: SourceControlResourceState[];

    /**
     * Creates an instance of ResourceStateProviderMock.
     */
    constructor() {
        this.sourceControlResourceStateList = [];
    }

    /**
     * Loads mock resource states.
     *
     * @param {string} [filter] - Optional filter criteria to apply to the resource list.
     * @returns {this} The current instance of the provider.
     */
    load(filter?: string): Promise<this> {
        return new Promise((resolve) => {
            const elements: RemoteResource[] = [];

            // Generate dummy elements to test
            for (let i = 1; i <= 250; i++) {
                elements.push(new RemoteResource(`root_${i}.txt`));
            }

            if (filter) {
                this.sourceControlResourceStateList = elements.filter(element => element.resourceUri.fsPath.includes(filter));
            } else {
                this.sourceControlResourceStateList = [...elements];
            }
            return resolve(this);
        });
    }

    /**
     * Retrieves the list of mock resource states.
     *
     * @returns {SourceControlResourceState[]} The list of mock resource states.
     */
    getResourceList(): SourceControlResourceState[] {
        return this.sourceControlResourceStateList;
    }
}
