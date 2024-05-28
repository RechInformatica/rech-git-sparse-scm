// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Repository } from './repository';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "rech-git-sparse-scm" is now active!');

	let disposable = vscode.commands.registerCommand('rech-git-sparse-scm.init', () => {
		vscode.window.showInformationMessage('Iniciando Extensão Git Sparse!');
		let repository = new Repository();
		repository.init();

	});
	context.subscriptions.push(disposable);

	let sparse = vscode.commands.registerCommand('rech-git-sparse-scm.sparseCheckout', () => {
		vscode.window.showInformationMessage('Executado Comando de Sparse!');

	});
	context.subscriptions.push(sparse);

}

// This method is called when your extension is deactivated
export function deactivate() {}
