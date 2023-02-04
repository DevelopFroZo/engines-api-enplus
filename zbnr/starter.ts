import path from 'path';

const buildPath = path.resolve('build');
const mainFilePath = path.resolve(buildPath, 'index.js');

function index() {
    require(mainFilePath).default();
}

index();
