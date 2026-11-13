/**
 * ESLint Plugin for Design System Compliance
 * Enforces brand guidelines and prevents common design violations.
 *
 * None of these rules autofix. Each correct fix depends on context (which token
 * a color maps to, which button color fits a secondary action, whether an
 * Outlined icon exists, whether a string is UI copy or a data code), so the
 * rules offer editor suggestions instead and `eslint --fix` leaves them alone.
 */

const ICON_STYLE_SUFFIX = /(Filled|TwoTone|Rounded|Sharp|Outlined)?$/;

function toOutlinedIconName(iconName) {
  return iconName.replace(ICON_STYLE_SUFFIX, '') + 'Outlined';
}

const rules = {
  'no-hardcoded-colors': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Prevent hardcoded hex colors, require design tokens',
        category: 'Design System',
        recommended: true
      },
      schema: []
    },
    create(context) {
      const hexColorRegex = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b/g;
      const allowedColors = ['#3B4960', '#F1F2F3']; // Brand colors

      function check(node, text, where) {
        const matches = text.match(hexColorRegex);
        if (!matches) return;
        matches.forEach(color => {
          if (!allowedColors.includes(color.toUpperCase())) {
            context.report({
              node,
              message: `Hardcoded color "${color}" found${where}. Use design tokens instead: var(--color-primary), var(--color-secondary), etc.`
            });
          }
        });
      }

      return {
        Literal(node) {
          if (typeof node.value === 'string') check(node, node.value, '');
        },
        TemplateElement(node) {
          check(node, node.value.raw, ' in template literal');
        }
      };
    }
  },

  'button-variant-compliance': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Enforce filled button variants only',
        category: 'Design System',
        recommended: true
      },
      hasSuggestions: true,
      schema: []
    },
    create(context) {
      return {
        JSXElement(node) {
          const name = node.openingElement.name.name;
          if (name !== 'Button' && name !== 'MuiButton') return;

          const variantAttr = node.openingElement.attributes.find(
            attr => attr.name && attr.name.name === 'variant'
          );
          if (!variantAttr || !variantAttr.value) return;

          const variant = variantAttr.value.value;
          if (variant !== 'outlined' && variant !== 'text') return;

          const hasColor = node.openingElement.attributes.some(
            attr => attr.name && attr.name.name === 'color'
          );
          context.report({
            node: variantAttr,
            message: `Button variant "${variant}" not allowed. Use variant="contained" (with color="secondary" for secondary actions).`,
            suggest: [
              {
                desc: hasColor
                  ? 'Use variant="contained"'
                  : 'Use variant="contained" color="secondary"',
                fix(fixer) {
                  return fixer.replaceText(
                    variantAttr,
                    hasColor ? 'variant="contained"' : 'variant="contained" color="secondary"'
                  );
                }
              }
            ]
          });
        }
      };
    }
  },

  'icon-type-compliance': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Enforce Material Icons Outlined only',
        category: 'Design System',
        recommended: true
      },
      hasSuggestions: true,
      schema: []
    },
    create(context) {
      function message(iconName) {
        return `Icon "${iconName}" should use Outlined variant. Import "${toOutlinedIconName(iconName)}" instead.`;
      }

      return {
        ImportDeclaration(node) {
          const source = node.source.value;

          // import { Close, EditOutlined as Edit } from '@mui/icons-material'
          if (source === '@mui/icons-material') {
            node.specifiers.forEach(specifier => {
              if (specifier.type !== 'ImportSpecifier') return;
              const iconName = specifier.imported.name;
              if (iconName.endsWith('Outlined')) return;
              const outlined = toOutlinedIconName(iconName);
              context.report({
                node: specifier,
                message: message(iconName),
                suggest: [
                  {
                    // Alias keeps existing JSX usages (<Close />) working
                    desc: `Import ${outlined} as ${specifier.local.name}`,
                    fix(fixer) {
                      return fixer.replaceText(specifier, `${outlined} as ${specifier.local.name}`);
                    }
                  }
                ]
              });
            });
            return;
          }

          // import CloseIcon from '@mui/icons-material/Close'
          const deepImport = /^@mui\/icons-material\/([A-Za-z0-9]+)$/.exec(source);
          if (deepImport && !deepImport[1].endsWith('Outlined')) {
            const outlined = toOutlinedIconName(deepImport[1]);
            context.report({
              node: node.source,
              message: message(deepImport[1]),
              suggest: [
                {
                  desc: `Import from @mui/icons-material/${outlined}`,
                  fix(fixer) {
                    return fixer.replaceText(node.source, `'@mui/icons-material/${outlined}'`);
                  }
                }
              ]
            });
          }
        }
      };
    }
  },

  'text-casing-compliance': {
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Enforce sentence case text (no Title Case or UPPERCASE)',
        category: 'Design System',
        recommended: true
      },
      hasSuggestions: true,
      schema: []
    },
    create(context) {
      function isTitleCase(text) {
        const words = text.split(/\s+/);
        if (words.length < 2) return false;
        return words.every(w => /^[A-Z][a-z]+$/.test(w));
      }

      function isUpperCase(text) {
        // Shouted copy ("ADD ATHLETE", "SUBMIT"), not acronyms or codes ("IR", "NFI", "UTC")
        return /^[A-Z]+( [A-Z]+)+$/.test(text) || /^[A-Z]{6,}$/.test(text);
      }

      function toSentenceCase(text) {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      }

      function check(node, text, replace) {
        if (!isTitleCase(text) && !isUpperCase(text)) return;
        const fixed = toSentenceCase(text);
        context.report({
          node,
          message: `Text "${text}" should use sentence case. Consider: "${fixed}"`,
          suggest: [
            {
              desc: `Change to "${fixed}"`,
              fix(fixer) {
                return replace(fixer, fixed);
              }
            }
          ]
        });
      }

      return {
        Literal(node) {
          if (typeof node.value !== 'string' || node.value.length < 2) return;
          if (node.parent && node.parent.type === 'ImportDeclaration') return;
          const quote = node.raw.charAt(0);
          check(node, node.value.trim(), (fixer, fixed) =>
            fixer.replaceText(node, `${quote}${fixed}${quote}`)
          );
        },
        // Visible JSX copy: <Button>Save As Draft</Button>
        JSXText(node) {
          const text = node.value.trim();
          if (text.length < 2) return;
          check(node, text, (fixer, fixed) =>
            fixer.replaceText(node, node.raw.replace(text, fixed))
          );
        }
      };
    }
  }
};

module.exports = {
  rules,
  configs: {
    recommended: {
      plugins: ['design-system'],
      rules: {
        'design-system/no-hardcoded-colors': 'error',
        'design-system/button-variant-compliance': 'error',
        'design-system/icon-type-compliance': 'error',
        'design-system/text-casing-compliance': 'warn'
      }
    }
  }
};
