import * as vscode from 'vscode';
import { Repository } from './repository/Repository';
import { ResourceStateProviderGit } from './repository/resources-states/provider/ResourceStateProviderGit';
import { RemotePreviewCommand } from './commands/RemotePreviewCommand';
import { SparseCheckoutCommand } from './commands/SparseCheckoutCommand';
import { RemoveSparseCheckoutCommand } from './commands/RemoveSparseCheckoutCommand';
import { RemoteResource } from './repository/resources-states/remote/RemoteResource';

export function activate(context: vscode.ExtensionContext) {

	const updateContext =

	// Update context when active editor changes
	vscode.window.onDidChangeActiveTextEditor(() => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const filePath = editor.document.fileName;
			const config = vscode.workspace.getConfiguration('rech-git-sparse-scm');
			const mirrorRepositories = config.get('mirrorRepository', []);
			const isInMirrorRepo = mirrorRepositories.some(repo => filePath.startsWith(repo));
			vscode.commands.executeCommand('setContext', 'isInMirrorRepository', isInMirrorRepo);
		} else {
			vscode.commands.executeCommand('setContext', 'isInMirrorRepository', false);
		}
	});

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
	const removeAllSparseCheckout = vscode.commands.registerCommand('rech-git-sparse-scm.removeAllSparseCheckout', (resource: vscode.SourceControlResourceState) => {
		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (!workspaceFolders) {
			vscode.window.showErrorMessage('No opened workspace.');
			return;
		}
		// Obtain file from workspace
		vscode.workspace.findFiles('**/*').then((uris) => {
			// Crete a list from URIs
			const configuration = vscode.workspace.getConfiguration('rech-git-sparse-scm');
			const quickPickWhitelist: string[] = configuration.get('quickPickWhitelist') || [];

			const items = uris.map(uri => {
				const relativePath = vscode.workspace.asRelativePath(uri); // Caminho relativo à workspace
				const fileName = uri.path.split('/').pop(); // Nome do arquivo

				const isInWhitelist = (fileName ? quickPickWhitelist.includes(fileName) : false);

				return {
					label: (fileName ? fileName : ''),
					picked: !isInWhitelist, // Se estiver na whitelist, não deve estar marcado
					description: (fileName ? relativePath.replace(fileName, '') : relativePath),
				};
			});

			// Show URIs list to pick
			vscode.window.showQuickPick(items, {
				canPickMany: true,
				placeHolder: 'Select file to remove from sparse-checkout',
			}).then((selected) => {
				if (!selected || selected.length === 0) {
					vscode.window.showInformationMessage('No file selected.');
					return;
				} else {
					const paths = selected.map(file => {
						let path = file.description.replace('\\', '/');
						path = (path ? path : "/") + file.label;
						return path;
					});
					RemoveSparseCheckoutCommand.removeAllSparseCheckout(paths);
				}
			});
		});

	});
	context.subscriptions.push(removeAllSparseCheckout);
	const activeEditor = vscode.window.activeTextEditor;
	// Remove selected file in sparse-checkout control
	const removeSparseCheckout = vscode.commands.registerCommand('rech-git-sparse-scm.removeSparseCheckout', (resource: vscode.SourceControlResourceState | vscode.Uri) => {
		let resourcePath = "";
		if (resource) {
			if (resource instanceof RemoteResource) {
				resourcePath = resource.resourceUri.path;
			}
			if (resource instanceof vscode.Uri) {
				resourcePath = resource.path;
			}
		} else {
			// Obtain repository directory mirror list
			if (activeEditor) {
				const config = vscode.workspace.getConfiguration('rech-git-sparse-scm');
				const mirrorDirectories: string[] = config.get('mirrorRepository', []);
				mirrorDirectories.forEach(mirrorDirectory => {
					mirrorDirectory = mirrorDirectory.replaceAll("\\", "/");
					resourcePath = activeEditor.document.uri.path.replace(mirrorDirectory, '');
				});
			}
		}
		if (activeEditor) {
			let workspaceFolderFromFile = vscode.workspace.getWorkspaceFolder(activeEditor.document.uri)?.uri.fsPath;
			if (workspaceFolderFromFile) {
				workspaceFolderFromFile = workspaceFolderFromFile.replaceAll("\\", "/") + "/";
				resourcePath = resourcePath.replace(workspaceFolderFromFile, '');
			}
		}
		// Is there a valid file to sparse checkout?
		if (resourcePath.length > 0) {
			RemoveSparseCheckoutCommand.removeSparseCheckout(resourcePath);
		} else {
			vscode.window.showErrorMessage('Nenhum arquivo selecionado ou aberto para adicionar no sparse-checkout.');
		}
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
