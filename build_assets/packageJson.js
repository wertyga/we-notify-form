import {outputPath} from './grandpa';
import fs from 'fs'

const fileContent = (`{
  "name": "we-notify-form",
  "version": "1.0.0",
  "description": "simple notify form with API and fully customize",
  "main": "WeNotify.js",
  "keywords": ["notify", "form"],
  "author": "Alexej Bronshtein <wertyga18@gmail.com>",
  "license": "ISC",
  "dependencies": {
    "axios": "^0.17.0",
    "body-parser": "^1.17.2",
    "connect-mongo": "^2.0.1",
    "cross-env": "^5.1.4",
    "express": "^4.15.4",
    "lodash": "^4.17.10",
    "mongoose": "^4.11.13"
  }
}`);

fs.writeFileSync(outputPath + '/package.json', fileContent)