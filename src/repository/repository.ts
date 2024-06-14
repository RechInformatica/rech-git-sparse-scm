import { SourceControl, SourceControlResourceGroup, scm } from "vscode";
import { ResourceStateProvider as ResourceStateProvider } from './resources-states/provider/resourceStateProvider';
import { TestCommand } from "../commands/testCommand";

/**
 * Represents a repository with sparse source control management.
 */
export class Repository {
    private gitSparseSCM: SourceControl;
    private remoteRepository: SourceControlResourceGroup;
    private resourceStateProvider: ResourceStateProvider;

    /**
     * Creates an instance of Repository.
     *
     * @param {ResourceStateProvider} resourceStateProvider - The provider for resource states.
     */
    constructor(resourceStateProvider: ResourceStateProvider) {
        this.gitSparseSCM = scm.createSourceControl('git-sparse', 'Git Sparse');
        this.remoteRepository = this.gitSparseSCM.createResourceGroup("remote-repo", "Remote Repository");
        this.resourceStateProvider = resourceStateProvider;
        this.resourceStateProvider.load().then((list) => {
			this.remoteRepository.resourceStates = list.getResourceList();
		});
    }

    /**
     * Reloads the repository with filtered resource states.
     */
    public reload() {
        this.resourceStateProvider.load(this.gitSparseSCM.inputBox.value).then((list) => {
			this.remoteRepository.resourceStates = list.getResourceList();
		});
    }

    /**
     * Initializes the repository with initial setup.
     */
    public init() {
        this.gitSparseSCM.inputBox.placeholder = "Filter here (Ctrl+Enter to filter)";
        this.gitSparseSCM.acceptInputCommand = new TestCommand();
        this.resourceStateProvider.load().then((list) => {
			this.remoteRepository.resourceStates = list.getResourceList();
		});
    }
}
