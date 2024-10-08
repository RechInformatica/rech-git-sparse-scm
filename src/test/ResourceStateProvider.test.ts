import * as assert from 'assert';

import * as vscode from 'vscode';
import { ResourceStateProviderMock } from '../repository/resources-states/provider/ResourceStateProviderMock';
import { RemoteResource } from '../repository/resources-states/remote/RemoteResource';

suite('ResourceStateProvider tests suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('filter tests', () => {
		const resourcesStateProvider = new ResourceStateProviderMock();
		let resource_expected = [new RemoteResource(`root_10.txt`),
		                           new RemoteResource(`root_100.txt`),
		                           new RemoteResource(`root_101.txt`),
		                           new RemoteResource(`root_102.txt`),
		                           new RemoteResource(`root_103.txt`),
		                           new RemoteResource(`root_104.txt`),
		                           new RemoteResource(`root_105.txt`),
		                           new RemoteResource(`root_106.txt`),
		                           new RemoteResource(`root_107.txt`),
		                           new RemoteResource(`root_108.txt`),
								   new RemoteResource(`root_109.txt`)];
		resourcesStateProvider.load("root_10").then((list) => {
			let resources = list.getResourceList();
			let json_resource_expected = JSON.stringify(resources.map(res => res.resourceUri.path.toString()));
			let json_resource_actual = JSON.stringify(resource_expected.map(res => res.resourceUri.path.toString()));
			assert.equal(json_resource_expected, json_resource_actual);
		});

		resource_expected = [new RemoteResource(`root_101.txt`)];
		resourcesStateProvider.load("root_101").then((list) => {
			let resources = list.getResourceList();
			let json_resource_expected = JSON.stringify(resources.map(res => res.resourceUri.path.toString()));
			let json_resource_actual = JSON.stringify(resource_expected.map(res => res.resourceUri.path.toString()));
			assert.equal(json_resource_expected, json_resource_actual);
		});

		resource_expected = [];
		resourcesStateProvider.load("999").then((list) => {
			let resources = list.getResourceList();
			let json_resource_expected = JSON.stringify(resources.map(res => res.resourceUri.path.toString()));
			let json_resource_actual = JSON.stringify(resource_expected.map(res => res.resourceUri.path.toString()));
			assert.equal(json_resource_expected, json_resource_actual);

		});
	});
});
