import { SourceControlResourceDecorations, ThemeIcon, Uri } from "vscode";

/**
 * Class with the decoration of a remote resource.
 */
export class RemoteResourceDecoration implements SourceControlResourceDecorations {

    iconPath?: string | Uri | ThemeIcon;
    faded?: boolean;
    tooltip?: string;

    constructor(local: boolean) {
        if (local) {
            this.iconPath = new ThemeIcon('pass');
            this.faded = true;
            this.tooltip = 'Local';
        } else {
            this.iconPath = new ThemeIcon('cloud');
            this.faded = false;
            this.tooltip = 'Remote';
        }
    }

}
