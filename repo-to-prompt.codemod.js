const lines = [];

// Define patterns to ignore (similar to .gitignore)
const ignorePatterns = [
  // Build outputs and dependencies
  '.git',
  'node_modules',
  'dist',
  'build',
  'out',
  '.next',
  '.nuxt',
  '.output',
  'coverage',
  '.nyc_output',

  // Package manager files
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',

  // Cache directories
  '.cache',
  '.parcel-cache',
  '.eslintcache',
  '.npm',
  '.yarn',

  // Environment and local config
  '.env',
  '.env.local',
  '.env.development.local',
  '.env.test.local',
  '.env.production.local',

  // Editor directories and files
  '.idea',
  '.vscode',
  '*.swp',
  '*.swo',
  '.DS_Store',
  'Thumbs.db',

  // Logs
  'logs',
  '*.log',
  'npm-debug.log*',
  'yarn-debug.log*',
  'yarn-error.log*',

  // Testing
  '__tests__',
  '__mocks__',
  '*.test.*',
  '*.spec.*',

  // Temporary files
  'tmp',
  'temp',
  '*.tmp',

  // Generated files
  '*.generated.*',
  '*.min.*',

  // Binary and media files
  '*.zip',
  '*.tar.gz',
  '*.tgz',
  '*.rar',
  '*.7z',
  '*.pdf',
  '*.exe',
  '*.dll',
  '*.so',
  '*.dylib',
  '*.png',
  '*.jpg',
  '*.jpeg',
  '*.gif',
  '*.ico',
  '*.mov',
  '*.mp4',
  '*.mp3',
  '*.flv',
  '*.fla',
  '*.swf',
  '*.eot',
  '*.ttf',
  '*.woff',
  '*.woff2',
];

// Function to check if a path should be ignored
const shouldIgnore = (path) => {
  // Convert path to use forward slashes for consistency
  const normalizedPath = path.replace(/\\/g, '/');

  return ignorePatterns.some((pattern) => {
    // Exact match
    if (normalizedPath === pattern) return true;

    // Directory match (e.g., 'node_modules/something')
    if (normalizedPath.startsWith(pattern + '/')) return true;

    // File extension match (e.g., '*.log')
    if (
      pattern.startsWith('*.') &&
      normalizedPath.endsWith(pattern.substring(1))
    )
      return true;

    // Path contains pattern (e.g., 'something/node_modules/something')
    if (
      pattern.indexOf('/') === -1 &&
      normalizedPath.includes('/' + pattern + '/')
    )
      return true;

    return false;
  });
};

// Try to read .gitignore if it exists to add custom ignore patterns
const addGitignorePatterns = async (rootUri) => {
  try {
    const gitignoreUri = vscode.Uri.joinPath(rootUri, '.gitignore');
    const gitignoreContent = new TextDecoder().decode(
      await vscode.workspace.fs.readFile(gitignoreUri)
    );

    // Parse .gitignore and add valid patterns
    const customPatterns = gitignoreContent
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'));

    ignorePatterns.push(...customPatterns);
  } catch (error) {
    // .gitignore doesn't exist or can't be read, just continue
  }
};

// Helper function to check if a URI is a directory
const isDirectory = async (uri) => {
  try {
    const stat = await vscode.workspace.fs.stat(uri);
    return stat.type === vscode.FileType.Directory;
  } catch (error) {
    return false;
  }
};

// Function to recursively get all files in a directory
const getAllFilesInDirectory = async (dirUri, rootPath, allFiles = []) => {
  try {
    const entries = await vscode.workspace.fs.readDirectory(dirUri);

    for (const [name, type] of entries) {
      const entryUri = vscode.Uri.joinPath(dirUri, name);
      const relativePath = entryUri.path.substring(rootPath.length + 1);

      // Skip ignored files and directories
      if (shouldIgnore(relativePath)) continue;

      if (type === vscode.FileType.Directory) {
        // Recursively process subdirectories
        await getAllFilesInDirectory(entryUri, rootPath, allFiles);
      } else if (type === vscode.FileType.File) {
        allFiles.push(entryUri);
      }
    }

    return allFiles;
  } catch (error) {
    console.error(`Error reading directory ${dirUri.path}: ${error.message}`);
    return allFiles;
  }
};

// Process selected items (files or folders) and return a flat list of file URIs
const processSelectedItems = async (selectedItems, rootPath) => {
  const allFiles = [];

  for (const item of selectedItems) {
    if (await isDirectory(item)) {
      // If it's a directory, get all files recursively
      await getAllFilesInDirectory(item, rootPath, allFiles);
    } else {
      // If it's a file, add it directly
      allFiles.push(item);
    }
  }

  return allFiles;
};

// Add repository metadata
const workspaceFolders = vscode.workspace.workspaceFolders;
if (workspaceFolders && workspaceFolders.length > 0) {
  const rootPath = workspaceFolders[0].uri.fsPath;
  const rootUri = workspaceFolders[0].uri;
  lines.push('<repository>');
  lines.push(`  <root_path>${rootPath}</root_path>`);

  // Try to get package.json or similar for project metadata
  try {
    const packageJsonUri = vscode.Uri.joinPath(rootUri, 'package.json');
    const packageJsonContent = new TextDecoder().decode(
      await vscode.workspace.fs.readFile(packageJsonUri)
    );
    const packageJson = JSON.parse(packageJsonContent);

    lines.push(
      `  <project_name>${packageJson.name || 'Unknown'}</project_name>`
    );
    lines.push(
      `  <project_description>${
        packageJson.description || 'No description'
      }</project_description>`
    );
    lines.push(
      `  <dependencies>${JSON.stringify(
        packageJson.dependencies || {}
      )}</dependencies>`
    );
  } catch (error) {
    lines.push(
      '  <project_info>No package.json found or unable to parse</project_info>'
    );
  }

  lines.push('</repository>');

  // Add custom ignore patterns from .gitignore if available
  await addGitignorePatterns(rootUri);

  // Process selected items to get all files
  const allFiles = await processSelectedItems(selectedFiles, rootUri.path);

//   //   Add tree-like file structure for context
//   lines.push('<file_structure>');
//   if (workspaceFolders && workspaceFolders.length > 0) {
//     try {
//       const rootUri = workspaceFolders[0].uri;

//       // Add custom ignore patterns from .gitignore if available
//       await addGitignorePatterns(rootUri);

//       // Generate tree-like structure
//       lines.push('root/');

//       const buildFileTree = async (
//         dirUri,
//         indent = '├── ',
//         prefix = '',
//         relativePath = ''
//       ) => {
//         const entries = await vscode.workspace.fs.readDirectory(dirUri);

//         // Filter out ignored files and directories
//         const filteredEntries = entries.filter(([name, _]) => {
//           const entryPath = relativePath ? `${relativePath}/${name}` : name;
//           return !shouldIgnore(entryPath);
//         });

//         // Sort entries: directories first, then files
//         filteredEntries.sort((a, b) => {
//           if (
//             a[1] === vscode.FileType.Directory &&
//             b[1] !== vscode.FileType.Directory
//           )
//             return -1;
//           if (
//             a[1] !== vscode.FileType.Directory &&
//             b[1] === vscode.FileType.Directory
//           )
//             return 1;
//           return a[0].localeCompare(b[0]);
//         });

//         for (let i = 0; i < filteredEntries.length; i++) {
//           const [name, type] = filteredEntries[i];
//           const isLast = i === filteredEntries.length - 1;
//           const currentIndent = isLast ? '└── ' : '├── ';
//           const nextIndent = isLast ? '    ' : '│   ';
//           const entryPath = relativePath ? `${relativePath}/${name}` : name;

//           if (type === vscode.FileType.Directory) {
//             // Check if directory is empty or only contains ignored files
//             const subEntries = await vscode.workspace.fs.readDirectory(
//               vscode.Uri.joinPath(dirUri, name)
//             );
//             const filteredSubEntries = subEntries.filter(([subName, _]) => {
//               const subPath = `${entryPath}/${subName}`;
//               return !shouldIgnore(subPath);
//             });
//             const isEmpty = filteredSubEntries.length === 0;

//             if (isEmpty) {
//               lines.push(`${prefix}${currentIndent}${name}/ (empty)`);
//             } else {
//               lines.push(`${prefix}${currentIndent}${name}/`);
//               await buildFileTree(
//                 vscode.Uri.joinPath(dirUri, name),
//                 currentIndent,
//                 `${prefix}${nextIndent}`,
//                 entryPath
//               );
//             }
//           } else if (type === vscode.FileType.File) {
//             // Get file extension
//             const fileExtension = name.includes('.')
//               ? name.split('.').pop()
//               : '';
//             if (fileExtension) {
//               lines.push(
//                 `${prefix}${currentIndent}${
//                   name.split('.')[0]
//                 }.{${fileExtension}}`
//               );
//             } else {
//               lines.push(`${prefix}${currentIndent}${name}`);
//             }
//           }
//         }
//       };

//       await buildFileTree(rootUri);
//     } catch (error) {
//       lines.push(`Error: Failed to read directory structure: ${error.message}`);
//     }
//   }
//   lines.push('</file_structure>');

  // Add a focused file structure showing only selected files and their parent directories
  lines.push('<selected_files_structure>');
  if (allFiles.length > 0) {
    try {
      lines.push('Selected files:');

      // Create a map of directories that contain selected files
      const directoryMap = new Map();

      // Process each file to build directory structure
      for (const fileUri of allFiles) {
        const filePath = fileUri.path;
        const relativePath = filePath.startsWith(rootUri.path)
          ? filePath.substring(rootUri.path.length + 1)
          : filePath;

        // Skip ignored files
        if (shouldIgnore(relativePath)) continue;

        // Split the path into segments
        const segments = relativePath.split('/');

        // Build up the directory structure
        let currentPath = '';
        for (let i = 0; i < segments.length - 1; i++) {
          const segment = segments[i];
          const parentPath = currentPath;
          currentPath = currentPath ? `${currentPath}/${segment}` : segment;

          // Skip if this directory should be ignored
          if (shouldIgnore(currentPath)) continue;

          // Add this directory to the map if not already there
          if (!directoryMap.has(currentPath)) {
            directoryMap.set(currentPath, {
              parent: parentPath,
              name: segment,
              isFile: false,
              children: [],
            });

            // Add this directory as a child to its parent
            if (parentPath && directoryMap.has(parentPath)) {
              directoryMap.get(parentPath).children.push(currentPath);
            }
          }
        }

        // Add the file itself
        const fileName = segments[segments.length - 1];
        const fileDirPath = currentPath;
        const fullPath = currentPath ? `${currentPath}/${fileName}` : fileName;

        directoryMap.set(fullPath, {
          parent: fileDirPath,
          name: fileName,
          isFile: true,
          children: [],
        });

        // Add this file as a child to its parent directory
        if (fileDirPath && directoryMap.has(fileDirPath)) {
          directoryMap.get(fileDirPath).children.push(fullPath);
        }
      }

      // Function to render the tree
      const renderTree = (path = '', indent = '') => {
        const node = directoryMap.get(path);
        if (!node) return;

        // Sort children: directories first, then files
        const sortedChildren = [...node.children].sort((a, b) => {
          const nodeA = directoryMap.get(a);
          const nodeB = directoryMap.get(b);
          if (!nodeA.isFile && nodeB.isFile) return -1;
          if (nodeA.isFile && !nodeB.isFile) return 1;
          return nodeA.name.localeCompare(nodeB.name);
        });

        for (let i = 0; i < sortedChildren.length; i++) {
          const childPath = sortedChildren[i];
          const child = directoryMap.get(childPath);
          const isLast = i === sortedChildren.length - 1;
          const childIndent = isLast ? '└── ' : '├── ';
          const nextIndent = isLast ? '    ' : '│   ';

          if (child.isFile) {
            // Get file extension
            const name = child.name;
            const fileExtension = name.includes('.')
              ? name.split('.').pop()
              : '';
            if (fileExtension) {
              lines.push(
                `${indent}${childIndent}${
                  name.split('.')[0]
                }.{${fileExtension}}`
              );
            } else {
              lines.push(`${indent}${childIndent}${name}`);
            }
          } else {
            lines.push(`${indent}${childIndent}${child.name}/`);
            renderTree(childPath, `${indent}${nextIndent}`);
          }
        }
      };

      // Find root directories (those without parents or with parents not in the map)
      const rootDirs = Array.from(directoryMap.keys()).filter((path) => {
        const node = directoryMap.get(path);
        return !node.parent || !directoryMap.has(node.parent);
      });

      // Sort root directories
      rootDirs.sort((a, b) => {
        const nodeA = directoryMap.get(a);
        const nodeB = directoryMap.get(b);
        if (!nodeA.isFile && nodeB.isFile) return -1;
        if (nodeA.isFile && !nodeB.isFile) return 1;
        return nodeA.name.localeCompare(nodeB.name);
      });

      // Render the tree starting from root directories
      for (let i = 0; i < rootDirs.length; i++) {
        const rootDir = rootDirs[i];
        const node = directoryMap.get(rootDir);
        const isLast = i === rootDirs.length - 1;
        const rootIndent = isLast ? '└── ' : '├── ';
        const nextIndent = isLast ? '    ' : '│   ';

        if (node.isFile) {
          // Get file extension
          const name = node.name;
          const fileExtension = name.includes('.') ? name.split('.').pop() : '';
          if (fileExtension) {
            lines.push(`${rootIndent}${name.split('.')[0]}.{${fileExtension}}`);
          } else {
            lines.push(`${rootIndent}${name}`);
          }
        } else {
          lines.push(`${rootIndent}${node.name}/`);
          renderTree(rootDir, nextIndent);
        }
      }
    } catch (error) {
      lines.push(
        `Error: Failed to create selected files structure: ${error.message}`
      );
    }
  } else {
    lines.push('No files selected or all selected files are ignored.');
  }
  lines.push('</selected_files_structure>');

  // Add detailed information for each selected file
  for (const fileUri of allFiles) {
    try {
      // Skip if not a file
      if (await isDirectory(fileUri)) {
        continue;
      }

      const fileStat = await vscode.workspace.fs.stat(fileUri);

      // Skip if not a file
      if (fileStat.type !== vscode.FileType.File) {
        continue;
      }

      // Get file extension and language ID
      const fileName = fileUri.path.split('/').pop();
      const fileExtension = fileName.includes('.')
        ? fileName.split('.').pop()
        : '';

      // Skip ignored files
      const relativePath = fileUri.path.substring(rootUri.path.length + 1);
      if (shouldIgnore(relativePath)) continue;

      // Skip files that are too large (> 1MB)
      if (fileStat.size > 1024 * 1024) {
        lines.push(
          `<file path="${fileUri.path}" size="${fileStat.size}" skipped="true" reason="File too large (> 1MB)"/>`
        );
        continue;
      }

      const fileContent = new TextDecoder().decode(
        await vscode.workspace.fs.readFile(fileUri)
      );

      const languageId = fileExtension
        ? vscode.languages
            .getLanguages()
            .then(
              (langs) => langs.find((l) => l === fileExtension) || 'plaintext'
            )
            .catch(() => 'plaintext')
        : 'plaintext';

      // Count lines of code
      const lineCount = fileContent.split('\n').length;

      lines.push(
        `<file path="${fileUri.path}" size="${
          fileStat.size
        }" modified="${new Date(
          fileStat.mtime
        ).toISOString()}" created="${new Date(
          fileStat.ctime
        ).toISOString()}" extension="${fileExtension}" lines="${lineCount}">`
      );

      // Add code structure hints for common file types
      if (['js', 'ts', 'jsx', 'tsx'].includes(fileExtension)) {
        // Simple regex to find function/class declarations
        const functionMatches =
          fileContent.match(
            /function\s+(\w+)|class\s+(\w+)|const\s+(\w+)\s*=\s*(?:function|\(.*\)\s*=>)/g
          ) || [];
        if (functionMatches.length > 0) {
          lines.push('  <code_structure>');
          functionMatches.forEach((match) => {
            lines.push(`    <element>${match.trim()}</element>`);
          });
          lines.push('  </code_structure>');
        }
      }

      // Add imports/dependencies for JS/TS files
      // if (['js', 'ts', 'jsx', 'tsx'].includes(fileExtension)) {
      //     const importMatches = fileContent.match(/import\s+.*?from\s+['"].*?['"]/g) || [];
      //     if (importMatches.length > 0) {
      //         lines.push('  <imports>');
      //         importMatches.forEach(match => {
      //             lines.push(`    <import>${match.trim()}</import>`);
      //         });
      //         lines.push('  </imports>');
      //     }
      // }

      lines.push(fileContent);
      lines.push('</file>');
    } catch (error) {
      // Log the error but continue processing other files
      lines.push(
        `<file path="${fileUri.path}" error="Failed to process file: ${error.message}"/>`
      );
    }
  }
}

await vscode.env.clipboard.writeText(lines.join('\n'));
vscode.window.showInformationMessage(
  'Enhanced repository context copied to clipboard'
);
