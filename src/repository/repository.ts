import { SourceControl, SourceControlResourceGroup, scm } from "vscode";
import { ResourceStateProvider as ResourceStateProvider } from './resources-states/provider/resourceStateProvider';
import { FilterCommand } from "../commands/filterCommand";

/**
 * Represents a repository with sparse source control management.
 */
export class Repository {
  private filter: string;
  private gitSparseSCM: SourceControl;
  private remoteRepository: SourceControlResourceGroup;
  private resourceStateProvider: ResourceStateProvider;

  /**
   * Creates an instance of Repository.
   *
   * @param {ResourceStateProvider} resourceStateProvider - The provider for resource states.
   */
  constructor(resourceStateProvider: ResourceStateProvider) {
    this.filter = '';
    this.gitSparseSCM = scm.createSourceControl('git-sparse', 'Git Sparse');
    this.gitSparseSCM.statusBarCommands = [new FilterCommand(this.filter)];
    this.remoteRepository = this.gitSparseSCM.createResourceGroup("remote-repo", "Remote Repository");
    this.resourceStateProvider = resourceStateProvider;
    this.resourceStateProvider.load().then((list) => {
      this.remoteRepository.resourceStates = list.getResourceList();
    });
  }

  /**
   * Initializes the repository with initial setup.
   */
  public init() {
    // todo: não criar quando for sparse
    this.gitSparseSCM.inputBox.visible = false;
    this.resourceStateProvider.load().then((list) => {
      this.remoteRepository.resourceStates = list.getResourceList();
    });
  }

  /**
   * Set value for filter resource states and displays
   */
  public setFilter(filter: string) {
    this.filter = filter;
    this.gitSparseSCM.statusBarCommands = [new FilterCommand(this.filter)];
  }

  /**
   * Reloads the repository with filtered resource states.
   */
  public reload() {
    this.resourceStateProvider.load(this.filter).then((list) => {
      this.remoteRepository.resourceStates = list.getResourceList();
    });
  }

}
