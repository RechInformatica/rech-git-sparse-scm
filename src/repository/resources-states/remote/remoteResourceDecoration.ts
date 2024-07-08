import {
    SourceControlResourceDecorations,
    ThemeIcon,
    Uri,
} from "vscode";


export class RemoteResourceDecoration implements SourceControlResourceDecorations {
    iconPath?: string | Uri | ThemeIcon | undefined;
    faded?: boolean | undefined;
    tooltip?: string | undefined;

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
