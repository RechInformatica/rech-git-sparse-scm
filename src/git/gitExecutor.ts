import { exec } from 'child_process';
import { promisify } from 'util';
import { Uri } from 'vscode';

const execPromise = promisify(exec);

/**
 * A class to execute Git commands.
 */
export class GitExecutor {
    private static gitExecutorInstance: GitExecutor;
    private gitPath: string | undefined;
    private repoPath: string | undefined;

    constructor() { }

    /**
     * Gets the singleton instance of the GitExecutor.
     *
     * @returns {GitExecutor} The singleton instance of GitExecutor.
     */
    public static getIntance(): GitExecutor {
        if (this.gitExecutorInstance) {
            return this.gitExecutorInstance;
        }
        this.gitExecutorInstance = new GitExecutor();
        return this.gitExecutorInstance;
    }

    /**
     * Sets the path to the Git executable.
     *
     * @param {string | undefined} value - The path to the Git executable.
     */
    public setGitPath(value: string | undefined) {
        this.gitPath = value;
    }

    /**
     * Sets the repository path.
     *
     * @param {string | undefined} value - The repository path.
     */
    public setRepoPath(value: string | undefined) {
        this.repoPath = value;
    }

    /**
     * Adds a file to sparse-checkout.
     *
     * @param {Uri} file - The file to add to sparse-checkout.
     * @returns {Promise<string>} The output from the Git command.
     */
    public sparseCheckoutAdd(file: Uri): Promise<string> {
        let command = `sparse-checkout add ${file.path}`;
        return this.raw(command);
    }

    /**
     * Checks out the current branch.
     *
     * @returns {Promise<string>} The output from the Git command.
     */
    public checkout(): Promise<string> {
        let command = `checkout`;
        return this.raw(command);
    }

    /**
     * Shows the content of a file from a specific branch.
     *
     * @param {string} branch - The branch name.
     * @param {Uri} file - The file to show.
     * @returns {Promise<string>} The output from the Git command.
     */
    public show(branch: string, file: Uri): Promise<string> {
        let command = `show ${branch}:.${file.path}`;
        return this.raw(command);
    }

    /**
     * Lists the files in a tree structure for a specific branch.
     *
     * @param {string} branch - The branch name.
     * @param {boolean} nameOnly - Whether to list only file names.
     * @returns {Promise<string>} The output from the Git command.
     */
    public lsTree(branch: string, nameOnly: boolean): Promise<string> {
        let command = `ls-tree -r ${branch}`;
        if (nameOnly) {
            command = command + ` --name-only`;
        }
        return this.raw(command);
    }

    /**
     * Executes a raw Git command.
     *
     * @param {string} command - The Git command to execute.
     * @returns {Promise<string>} The output from the Git command.
     * @throws {Error} If there is an error executing the Git command.
     */
    public async raw(command: string): Promise<string> {
        try {
            const { stdout, stderr } = await execPromise(`${this.gitPath} -C ${this.repoPath} ${command}`);
            if (stderr) {
                throw new Error(stderr);
            }
            return stdout;
        } catch {
            throw new Error(`Error executing git command: `);
        }
    }
}
