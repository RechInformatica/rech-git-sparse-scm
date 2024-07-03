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

    public getRepoPath(): string | undefined {
        return this.repoPath;
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
        let command = 'checkout';
        return this.raw(command);
    }

    /**
     * Shows the content of a file from the current branch.
     *
     * @param {Uri} file - The file to show.
     * @returns {Promise<string>} The output from the Git command.
     */
    public async catFile(file: Uri): Promise<string> {
        const currentBranch = await this.currentBranch();
        if (currentBranch && currentBranch.length > 0) {
            return this.catFileFrom(currentBranch, file);
        } else {
            return this.catFileFrom('master', file);
        }
    }

    /**
    * Shows the content of a file from a specific branch.
    *
    * @param {string} branch - The branch name.
    * @param {Uri} file - The file to show.
    * @returns {Promise<string>} The output from the Git command.
    */
    public catFileFrom(branch: string, file: Uri): Promise<string> {
        let command = `cat-file -p ${branch}:.${file.path}`;
        return this.raw(command);
    }

    /**
     * Returns true when sparse-chekcout is active
     *
     * @returns {Promise<boolean>} Sparse-checkout active.
     */
    public async isSparseCheckoutRepository(): Promise<boolean> {
        const stdout = await this.raw('config core.sparseCheckout');
        if (stdout && stdout === 'true') {
            return true;
        }
        return false;
    }

    /**
     * Returns true when branch is published
     *
     * @returns {Promise<boolean>} Branch is published.
     */
    public async isPublishedBranch(currentBranch: string): Promise<boolean> {
        const stdout = await this.raw(`branch --list --remotes origin/${currentBranch}`);
        if (stdout && stdout.length > 0) {
            return true;
        }
        return false;
    }

    /**
     * Gets the current branch
     *
     * @returns {Promise<string>} The current branch.
     */
    public async currentBranch(): Promise<string> {
        const stdout = await this.raw('branch');
        // Captura a linha que começa com '*', indicando a branch atual
        const currentBranch = stdout.split('\n').find(line => line.startsWith('*'))?.replace('* ', '').trim();
        if (currentBranch) {
            return currentBranch;
        } else {
            return '';
        }
    }

    /**
     * Lists the files in a tree structure for a specific branch.
     *
     * @param {boolean} nameOnly - Whether to list only file names.
     * @returns {Promise<string>} The output from the Git command.
     */
    public async lsTree(nameOnly: boolean): Promise<string> {

        const stdout = await this.raw('branch');
        // Captura a linha que começa com '*', indicando a branch atual
        const currentBranch = stdout.split('\n').find(line => line.startsWith('*'))?.replace('* ', '').trim();
        let command;
        if (currentBranch) {
            command = `ls-tree -r ${currentBranch}`;
        } else {
            command = 'ls-tree -r master';
        }
        if (nameOnly) {
            command = `${command} --name-only`;
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
            throw new Error(`Error executing git command: ${command}`);
        }
    }
}