import { SourceControl, SourceControlResourceGroup, scm } from "vscode";
import { ResourceStateProvider as ResourceStateProvider } from './resources-states/provider/resourceStateProvider';
import { TestCommand } from "../commands/testCommand";


export class Repository  {
	private gitSparseSCM: SourceControl;
	private remoteRepository: SourceControlResourceGroup;
	private resourceStateProvider: ResourceStateProvider;

    constructor(resourceStateProvider: ResourceStateProvider) {
		this.gitSparseSCM = scm.createSourceControl('git-sparse', 'Git Sparse');
		this.remoteRepository = this.gitSparseSCM.createResourceGroup("remote-repo", "Remote Repository");
		this.resourceStateProvider = resourceStateProvider;
		this.remoteRepository.resourceStates = this.resourceStateProvider.load().getResourceList();
    }

    public reload() {
		this.remoteRepository.resourceStates = this.resourceStateProvider.load(this.gitSparseSCM.inputBox.value).getResourceList();
	}

    public init() {
		this.gitSparseSCM.inputBox.placeholder = "Filtre os arquivos aqui...";
		this.gitSparseSCM.acceptInputCommand = new TestCommand();
		this.remoteRepository.resourceStates = this.resourceStateProvider.load().getResourceList();
    }
}
