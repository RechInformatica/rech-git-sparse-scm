import { Extension, SourceControlResourceState, extensions } from "vscode";
import { ResourceStateProvider } from "./ResourceStateProvider";
import { GitExtension } from "../../../git/git";
import { GitExecutor } from "../../../git/GitExecutor";
import { RemoteResource } from "../remote/RemoteResource";

/**
 * Provides resource states for Git repositories.
 */
export class ResourceStateProviderGit implements ResourceStateProvider {

    /**
     * List of source control resource states.
     */
    private gitExtension: Extension<GitExtension> | undefined;
    sourceControlResourceStateList: SourceControlResourceState[];

    /**
     * Creates an instance of ResourceStateProviderGit.
     */
    constructor() {
        this.sourceControlResourceStateList = [];
        this.gitExtension = extensions.getExtension<GitExtension>('vscode.git');
    }

    /**
     * Return Git API Extension
     *
     * @returns {Extension<GitExtension>} Git API Extension
     */
    public getGitExtension(): Extension<GitExtension> | undefined {
        return this.gitExtension;
    }

    /**
     * Loads resource states from the Git repository.
     *
     * @param {string} [filter] - Optional filter criteria to apply to the resource list.
     * @returns {this} The current instance of the provider.
     */
    load(filter?: string): Promise<this> {
        return new Promise((resolve, reject) => {
            if (!this.gitExtension) {
                return reject(new Error('Git extension not found.'));
            }

            const api = this.gitExtension.exports.getAPI(1);
            if (api.repositories.length === 0) {
                return reject(new Error('No Git repositories found.'));
            }

            const repository = api.repositories[0];
            let repoPath = repository.rootUri.path;
            if (repoPath.startsWith('/')) {
                repoPath = repoPath.substring(1);
            }
            repoPath = repoPath.replace(/\//g, '\\');

            const gitExecutor = GitExecutor.getIntance();
            gitExecutor.setGitPath(api.git.path);
            gitExecutor.setRepoPath(repoPath);

            gitExecutor.isSparseCheckoutRepository().then((isSparseChekout) => {
                if (!isSparseChekout) {
                    return reject(new Error('Sparse-Checkout not activated.'));
                }
            });

            gitExecutor.lsTree(true).then((stdout) => {
                const fileList = stdout.split('\n');
                this.sourceControlResourceStateList = fileList.map(file => new RemoteResource(file));
                if (filter && filter !== '') {
                    const lowerCaseFilter = filter.toLocaleLowerCase();
                    this.sourceControlResourceStateList = this.sourceControlResourceStateList.filter(resource =>
                        resource.resourceUri.fsPath.toLocaleLowerCase().includes(lowerCaseFilter)
                    );
                }
                resolve(this);
            }).catch(err => {
                reject(new Error(`Failed to execute ls-tree command: ${err.message}`));
            });
        });
    }

    /**
     * Retrieves the list of resource states.
     *
     * @returns {SourceControlResourceState[]} The list of resource states.
     */
    getResourceList(): SourceControlResourceState[] {
        return this.sourceControlResourceStateList;
    }

}
