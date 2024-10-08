import * as vscode from 'vscode';
import { Repository } from './repository/Repository';
import { ResourceStateProviderGit } from './repository/resources-states/provider/ResourceStateProviderGit';
import { RemotePreviewCommand } from './commands/RemotePreviewCommand';
import { SparseCheckoutCommand } from './commands/SparseCheckoutCommand';
import { RemoveSparseCheckoutCommand } from './commands/RemoveSparseCheckoutCommand';

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
		repository.reload();
	});

	watcher.onDidCreate(async (uri) => {
		repository.reload();
	});

	watcher.onDidDelete(async (uri) => {
		repository.reload();
	});
	context.subscriptions.push(watcher);

	// Commands available on extension

	// Opens remote file view on local editor
	const remotePreview = vscode.commands.registerCommand('rech-git-sparse-scm.remotePreview', (uri: vscode.Uri) => {
		RemotePreviewCommand.openPreview(uri, context);
	});
	context.subscriptions.push(remotePreview);

	// Add selected file in sparse-checkout control
	const sparseCheckout = vscode.commands.registerCommand('rech-git-sparse-scm.sparseCheckout', (resource: vscode.SourceControlResourceState) => {
		let resourcePath = "";
		if (resource && resource.resourceUri) {
			resourcePath = resource.resourceUri.path;
		} else {
			// Obtain repository directory mirror list
			const activeEditor = vscode.window.activeTextEditor;
			if (activeEditor) {
				const config = vscode.workspace.getConfiguration('rech-git-sparse-scm');
				const mirrorDirectories: string[] = config.get('mirrorRepository', []);
				mirrorDirectories.forEach(mirrorDirectory => {
					mirrorDirectory = mirrorDirectory.replaceAll("\\", "/");
					resourcePath = activeEditor.document.uri.path.replace(mirrorDirectory, '');
				});
			}
		}
		// Is there a valid file to sparse checkout?
		if (resourcePath.length > 0) {
			SparseCheckoutCommand.sparseCheckout(resourcePath, context);
		} else {
			vscode.window.showErrorMessage('Nenhum arquivo selecionado ou aberto para adicionar no sparse-checkout.');
		}
	});
	context.subscriptions.push(sparseCheckout);

	// Remove selected file in sparse-checkout control
	const removeSparseCheckout = vscode.commands.registerCommand('rech-git-sparse-scm.removeSparseCheckout', (resource: vscode.SourceControlResourceState) => {
		RemoveSparseCheckoutCommand.removeSparseCheckout(resource.resourceUri);
	});
	context.subscriptions.push(removeSparseCheckout);

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
