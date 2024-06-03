// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Repository } from './repository/repository';
// import { ResourceStateProviderGit } from './repository/resources-states/provider/resourceStateProviderGit';
import { ResourceStateProviderMock } from './repository/resources-states/provider/resourceStateProviderMock';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {


	// let repository = new Repository(new ResourceStateProviderGit());
	let repository = new Repository(new ResourceStateProviderMock());
	repository.init();

	let sparse = vscode.commands.registerCommand('rech-git-sparse-scm.sparseCheckout', () => {
		vscode.window.showInformationMessage('Executado Comando de Sparse Checkout!');
	});
	context.subscriptions.push(sparse);

	let test = vscode.commands.registerCommand('rech-git-sparse-scm.test', () => {
		vscode.window.showInformationMessage('Executado Comando de Teste (reload do ctrl+enter)!');
		repository.reload();
	});
	context.subscriptions.push(test);

}

// This method is called when your extension is deactivated
export function deactivate() {}
