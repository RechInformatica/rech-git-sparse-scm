import {
    Command } from "vscode";

    export class SparseCheckoutCommand implements Command {
        title: string;
        command: string;
        tooltip?: string | undefined;
        arguments?: any[] | undefined;

        constructor() {
            this.title = "Sparse Checkout";
            this.command = "rech-git-sparse-scm.sparseCheckout";
        }

    }
