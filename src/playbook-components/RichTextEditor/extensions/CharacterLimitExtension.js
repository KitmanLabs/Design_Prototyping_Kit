import {
  extension,
  PlainExtension,
  // CreateExtensionPlugin is a type-only export - createPlugin() returns a plugin spec object
} from '@remirror/core';
import { filterTransaction } from './utils';


// This extension is inspired by: https://github.com/ueberdosis/tiptap/blob/main/packages/extension-character-count/src/character-count.ts
export class CharacterLimitExtension extends PlainExtension {
  get name() {
    return 'characterLimit';
  }

  createPlugin() {
    return {
      filterTransaction: (transaction, state) =>
        filterTransaction(transaction, state, this.options.limit),
    };
  }
}

extension({ defaultSettings: { limit: 65535 } })(CharacterLimitExtension);
