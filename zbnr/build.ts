import {watch} from './lib/watcher';

function handlePaths() {
    process.exit(0);
}

function index() {
    watch(handlePaths);
}

index();
