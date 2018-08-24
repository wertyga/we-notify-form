import * as babel from 'babel-core';
import sass from 'node-sass';
import path from 'path';
import fs from 'fs';

export const scriptFilePath = path.join(__dirname, '../WeNotifyForm')
export const outputPath = path.join(__dirname, '../production')
const readmeFile = path.join(__dirname, 'README.md')

try {
    fs.readdirSync(scriptFilePath)
        .forEach(file => {
            const filePath = path.join(scriptFilePath, file);
            const outputFilePath = path.join(outputPath, file.replace(/\.sass/, '.css'));

            if(file.match(/\.js/)) {
                const code = babel.transformFileSync(filePath).code.replace(/\.sass/, '.css');
                fs.writeFileSync(outputFilePath, code)
            } else if(file.match(/\.sass/)) {
                sass.render({
                    file: filePath,
                }, function(err, result) {
                    fs.writeFileSync(outputFilePath, result.css)
                });
            }
        });
    fs.copyFileSync(readmeFile, path.join(outputPath, 'README.md'))
} catch(e) {
    console.error(e)
}




