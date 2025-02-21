import { addAlias } from 'module-alias';
import { join } from 'path';

// Register module aliases
addAlias('@', join(__dirname));
// Add this line at the beginning of your application
require('module-alias/register');
