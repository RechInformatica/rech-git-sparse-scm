import { TextDocumentContentProvider, EventEmitter, Uri } from "vscode";

/**
 * A class that provides the content for virtual text documents.
 */
export class VirtualDocument implements TextDocumentContentProvider {

    private fileContent: string;

    /**
     * Creates an instance of VirtualDocument.
     *
     * @param {string} fileContent - The content of the virtual document.
     */
    constructor(fileContent: string) {
        this.fileContent = fileContent;
    }

    /**
     * Provides the content for a virtual text document.
     *
     * @param {Uri} uri - The URI of the virtual document.
     * @returns {string} The content of the virtual document.
     */
    provideTextDocumentContent(uri: Uri): string {
        return this.fileContent;
    }
}
