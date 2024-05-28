import { scm } from "vscode";
import { RemoteResource } from './resources/remote/remoteResource';


export class Repository  {
    // public sourceControl: SourceControl;

    constructor() {
        // this.sourceControl = this.sourceControl.createResourceGroup("teste", "teste")
    }

    public init() {

	// Create a new SourceControl for git sparse
	let gitSparseSCM = scm.createSourceControl('git-sparse', 'Git Sparse');

	// Create a new RemoteResource group to list remote repository files
	let remoteRepository = gitSparseSCM.createResourceGroup("remote-repo", "Remote Repository");
	const resourceRoot = new RemoteResource("root.txt");
	const resourcePathRoot = new RemoteResource("/path/file.txt");
	remoteRepository.resourceStates = [resourceRoot, resourcePathRoot];
    }
}
