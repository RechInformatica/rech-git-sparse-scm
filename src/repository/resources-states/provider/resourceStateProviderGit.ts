import { SourceControlResourceState, extensions, Uri } from "vscode";
import { ResourceStateProvider } from "./resourceStateProvider";
import { GitExtension } from "../../../git/git";
import { GitExecutor } from "../../../git/gitExecutor";
import { RemoteResource } from "../remote/remoteResource";

/**
 * Provides resource states for Git repositories.
 */
export class ResourceStateProviderGit implements ResourceStateProvider {
    /**
     * List of source control resource states.
     */
    sourceControlResourceStateList: SourceControlResourceState[];

    /**
     * Creates an instance of ResourceStateProviderGit.
     */
    constructor() {
        this.sourceControlResourceStateList = [];
    }

    /**
     * Loads resource states from the Git repository.
     *
     * @param {string} [filter] - Optional filter criteria to apply to the resource list.
     * @returns {this} The current instance of the provider.
     */
    load(filter?: string): Promise<this> {
        return new Promise((resolve, reject) => {
            const gitExtension = extensions.getExtension<GitExtension>('vscode.git');
            if (!gitExtension) {
                reject(new Error('Git extension not found.'));
                return;
            }

            // TODO: Aqui é necessário esperar carregar a extensão de Git para ter o repositório carregado, porém ela só carrega depois de carregar a extensão Sparse
            // Ou seja, o melhor seria não utilizar a api da extensão do GIT e encontrar pela workspace o diretório
            // Com isso, ao iniciar a extensão já vai carregar os dados, sem depender da outra extensão ter carregado
            const api = gitExtension.exports.getAPI(1);
            if (api.repositories.length === 0) {
                reject(new Error('No Git repositories found.'));
                return;
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

            gitExecutor.lsTree("master", true).then(stdout => {
                const fileList = stdout.split('\n');
                this.sourceControlResourceStateList = fileList.map(file => new RemoteResource(file));
                if (filter) {
                    this.sourceControlResourceStateList = this.sourceControlResourceStateList.filter(resource =>
                        resource.resourceUri.fsPath.includes(filter)
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
function reject(arg0: Error) {
    throw new Error("Function not implemented.");
}

