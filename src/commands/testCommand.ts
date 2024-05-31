import {
    Command } from "vscode";

    export class TestCommand implements Command {
        title: string;
        command: string;
        tooltip?: string | undefined;
        arguments?: any[] | undefined;

        constructor() {
            this.title = "Test";
            this.command = "rech-git-sparse-scm.test";
        }

    }
