import { Command } from "vscode";

/**
 * Represents a command to filter the files in the remote repository.
 */
export class FilterCommand implements Command {

    title: string;
    command: string;

    constructor(filter: string) {
        this.title = filter.length > 0 ? "$(filter) Filtering: " + filter : "$(filter) Filter";
        this.command = "rech-git-sparse-scm.searchInResourceGroup";
    }

}
