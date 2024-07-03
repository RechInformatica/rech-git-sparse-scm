import {
    Command } from "vscode";

    export class FilterCommand implements Command {
        title: string;
        command: string;
        tooltip?: string | undefined;
        arguments?: any[] | undefined;

        constructor(filter: string) {
            if (filter && filter.length > 0) {
                this.title = "$(filter) Filtering: " + filter;
            } else {
                this.title = "$(filter) Filter";
            }
            this.command = "rech-git-sparse-scm.searchInResourceGroup";
        }

    }
