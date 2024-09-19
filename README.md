# Rech Git Sparse Extension

## Overview

Welcome to the VS Code SCM Sparse Checkout Extension! This extension integrates with the Source Control Management (SCM) system to facilitate the use of sparse checkout directly within the VS Code editor. Sparse checkout allows you to selectively clone and checkout parts of a repository, improving performance and efficiency when working with large codebases.

## Features

### Version 0.0.6

- **New Documentation**: Explain step by step how to use the extension.

### Version 0.0.5

- **Remove Sparse Checkout**: Easily perform remove sparse checkout by clicking a button on the file list.

### Version 0.0.4

- **Repository File View**: Visualize all the files in your repository within the VS Code editor.
- **Sparse Checkout**: Easily perform sparse checkout by clicking a button on the file list.

## Installation

1. Open VS Code.
2. Go to the Extensions view by clicking the Extensions icon in the Activity Bar on the side of the window or by pressing `Ctrl+Shift+X`.
3. Search for "SCM Sparse Checkout Extension".
4. Click "Install".

## Usage

1. After installing the extension, open your project with sparse-checkout in VS Code.
2. Navigate to the Source Control view.
3. You will see a new section displaying all the files in your repository.
* <details>
    <summary>Click to expand GIF</summary>
    <div align="center">
        <img src="https://github.com/RechInformatica/rech-git-sparse-scm/raw/master/docs/gifs/using.gif" width="1680" alt="Using">
    </div>
</details>


4. To perform a sparse checkout, simply click the button next to the file or folder you want to checkout (+).
5. You can filter the remote files to find them more easily.
* <details>
    <summary>Click to expand GIF</summary>
    <div align="center">
        <img src="https://github.com/RechInformatica/rech-git-sparse-scm/raw/master/docs/gifs/adding.gif" width="1680" alt="Adding">
    </div>
</details>

6. To remove a file from sparse checkout, simply click the button next to the file or folder you want to checkout (-).
* <details>
    <summary>Click to expand GIF</summary>
    <div align="center">
        <img src="https://github.com/RechInformatica/rech-git-sparse-scm/raw/master/docs/gifs/removing.gif" width="1680" alt="Removing">
    </div>
</details>

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
