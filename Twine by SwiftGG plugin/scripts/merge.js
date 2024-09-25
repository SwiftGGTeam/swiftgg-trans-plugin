const fs = require('fs');
const path = require('path');

// 定义数据目录和输出文件
const dataDir = path.join(__dirname, 'data');
const outputFile = path.join(__dirname, 'data.json');

// 用于存储所有 JSON 数据的对象
let mergedData = {};

// 递归读取目录
function readDir(dir, baseKey = '') {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // 如果是目录，递归读取
            readDir(filePath, path.join(baseKey, file));
        } else {
            // 如果是 JSON 文件，读取并合并数据
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const jsonData = JSON.parse(fileContent);

            // 使用文件路径作为键，移除 'data/' 前缀
            const key = path.join(baseKey, file.replace('.json', ''))
                .replace(/\\/g, '/')
                .replace(/^data\//, '');
            mergedData[key] = jsonData;
        }
    });
}

// 开始读取数据目录
readDir(dataDir);

// 将合并后的数据写入新文件
fs.writeFileSync(outputFile, JSON.stringify(mergedData, null, 2));

console.log(`所有 JSON 文件已合并到 ${outputFile}`);
