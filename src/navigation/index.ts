import {path} from './path';
import {Module, Package, submodules, doc, nginx, mappings} from './constants';

export {path, Module, Package, submodules, doc, nginx, mappings};
export default {path, list: submodules, doc, nginx, mappings};