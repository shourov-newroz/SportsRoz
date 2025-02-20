import { addAlias } from 'module-alias';
import { join } from 'path';

// Register module aliases
addAlias('@', join(__dirname));
