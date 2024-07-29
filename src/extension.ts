import * as vscode from 'vscode';
import { Repository } from './repository/Repository';
import { ResourceStateProviderGit } from './repository/resources-states/provider/ResourceStateProviderGit';
import { RemotePreviewCommand } from './commands/RemotePreviewCommand';
import { SparseCheckoutCommand } from './commands/SparseCheckoutCommand';

export function activate(context: vscode.ExtensionContext) {

	// Initialize remote repository only after git extensions opens a repository
	const resourceStateProviderGit = new ResourceStateProviderGit();
	const repository = new Repository(resourceStateProviderGit);
	const gitExtension = resourceStateProviderGit.getGitExtension();
	if (gitExtension) {
		gitExtension.exports.getAPI(1).onDidOpenRepository(() => {
			repository.init();
		});
	}

	// Configure file watcher to reload resources states in SCM
	const watcher = vscode.workspace.createFileSystemWatcher('**/*');

	watcher.onDidChange(async (uri) => {
		console.log(`File changed: ${uri.fsPath}`);
		repository.reload();
	});

	watcher.onDidCreate(async (uri) => {
		console.log(`File created: ${uri.fsPath}`);
		repository.reload();
	});

	watcher.onDidDelete(async (uri) => {
		console.log(`File deleted: ${uri.fsPath}`);
		repository.reload();
	});
	context.subscriptions.push(watcher);

	// Commands available on extension

	// Opens remote file view on local editor
	let remotePreview = vscode.commands.registerCommand('rech-git-sparse-scm.remotePreview', (uri: vscode.Uri) => {
		RemotePreviewCommand.openPreview(uri, context);
	});
	context.subscriptions.push(remotePreview);

	// Add selected file in sparse-checkout control
	let sparseCheckout = vscode.commands.registerCommand('rech-git-sparse-scm.sparseCheckout', (resource: vscode.SourceControlResourceState) => {
		SparseCheckoutCommand.sparseCheckout(resource.resourceUri);
	});
	context.subscriptions.push(sparseCheckout);

	// Opens an input-box to filter shown files in remote repository
	let searchInResourceGroup = vscode.commands.registerCommand('rech-git-sparse-scm.searchInResourceGroup', () => {
		vscode.window.showInputBox({ prompt: 'Enter search query' }).then(query => {
			if (query) {
				repository.setFilter(query);
			} else {
				repository.setFilter('');

			}
			repository.reload();
		});
	});
	context.subscriptions.push(searchInResourceGroup);
}

export function deactivate() {
    //
}
