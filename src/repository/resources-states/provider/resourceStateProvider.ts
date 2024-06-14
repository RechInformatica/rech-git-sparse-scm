import { SourceControlResourceState } from "vscode";

/**
 * Interface that provides resource states for source control.
 */
export interface ResourceStateProvider {
    /**
     * List of source control resource states.
     */
    sourceControlResourceStateList: SourceControlResourceState[];

    /**
     * Loads resource states optionally filtered by a given criteria.
     *
     * @param {string} [filter] - Optional filter criteria.
     * @returns {this} The current instance of the provider.
     */
    load(filter?: string): Promise<this>;

    /**
     * Retrieves the list of resource states.
     *
     * @returns {SourceControlResourceState[]} The list of resource states.
     */
    getResourceList(): SourceControlResourceState[];
}
