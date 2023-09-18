import {path} from './path';
import {Module, submodules, doc, nginx, packages} from './constants';

export {path, Module, submodules, doc, nginx, packages};
export default {path, list: submodules, doc, nginx, packages};