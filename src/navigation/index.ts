import {path} from './path';
import {Module, submodules, doc, nginx} from './constants';

export {path, Module, submodules, doc, nginx};
export default {path, list: submodules, doc, nginx};