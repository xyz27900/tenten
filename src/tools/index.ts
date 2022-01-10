import fs from 'fs';
import path from 'path';
import { makeColors } from '@/tools/colors';

const stylesDir = path.resolve(process.cwd(), 'src', 'styles');
const colorsFile = path.resolve(stylesDir, 'colors.css');

const colors = makeColors();

fs.writeFileSync(colorsFile, colors);
