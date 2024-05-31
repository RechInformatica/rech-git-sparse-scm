import { SourceControl, SourceControlResourceGroup, scm } from "vscode";
import { ResourceStateList } from '../resources/resourceStateList';
import { TestCommand } from "../commands/testCommand";
import { RemoteResource } from "../resources/remote/remoteResource";


export class Repository  {
	private gitSparseSCM: SourceControl;
	private remoteRepository: SourceControlResourceGroup;
	private resourceStateList: ResourceStateList;

    constructor(resourceStateList: ResourceStateList) {
		this.gitSparseSCM = scm.createSourceControl('git-sparse', 'Git Sparse');
		this.remoteRepository = this.gitSparseSCM.createResourceGroup("remote-repo", "Remote Repository");
		this.resourceStateList = resourceStateList;
		this.remoteRepository.resourceStates = this.resourceStateList.load().getResourceList();
        // this.sourceControl = this.sourceControl.createResourceGroup("teste", "teste")
    }

    public reload() {
		const elements = this.resourceStateList.load(this.gitSparseSCM.inputBox.value).getResourceList();
		this.remoteRepository.resourceStates = [...elements, new RemoteResource("root_2.txt")];
	}

    public init() {
		this.gitSparseSCM.inputBox.placeholder = "Filtre os arquivos aqui...";
		this.gitSparseSCM.acceptInputCommand = new TestCommand();
		this.remoteRepository.resourceStates = this.resourceStateList.load().getResourceList();
    }
}
