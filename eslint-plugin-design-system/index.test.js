// @vitest-environment node
/* eslint-disable design-system/no-hardcoded-colors -- fixtures are the rule's test inputs */
import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import plugin from './index.js'

RuleTester.describe = describe
RuleTester.it = it

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } }
})
const { rules } = plugin

ruleTester.run('no-hardcoded-colors', rules['no-hardcoded-colors'], {
  valid: [
    "const c = 'var(--color-primary)'",
    "const c = '#3B4960'",
    'const c = `1px solid var(--color-border-primary)`'
  ],
  invalid: [
    { code: "const c = '#dc3545'", errors: 1, output: null },
    { code: 'const c = `1px solid #abcdef`', errors: 1, output: null }
  ]
})

ruleTester.run('button-variant-compliance', rules['button-variant-compliance'], {
  valid: [
    '<Button variant="contained" color="secondary">Back</Button>',
    '<Paper variant="outlined" />'
  ],
  invalid: [
    {
      code: '<Button variant="outlined">Back</Button>',
      output: null,
      errors: [
        {
          message: 'Button variant "outlined" not allowed. Use variant="contained" (with color="secondary" for secondary actions).',
          suggestions: [
            {
              desc: 'Use variant="contained" color="secondary"',
              output: '<Button variant="contained" color="secondary">Back</Button>'
            }
          ]
        }
      ]
    },
    {
      code: '<MuiButton variant="text" color="error">Cancel</MuiButton>',
      output: null,
      errors: [
        {
          message: 'Button variant "text" not allowed. Use variant="contained" (with color="secondary" for secondary actions).',
          suggestions: [
            {
              desc: 'Use variant="contained"',
              output: '<MuiButton variant="contained" color="error">Cancel</MuiButton>'
            }
          ]
        }
      ]
    }
  ]
})

ruleTester.run('icon-type-compliance', rules['icon-type-compliance'], {
  valid: [
    "import { CloseOutlined } from '@mui/icons-material'",
    "import { EditOutlined as Edit } from '@mui/icons-material'",
    "import CloseIcon from '@mui/icons-material/CloseOutlined'"
  ],
  invalid: [
    {
      code: "import { Close } from '@mui/icons-material'",
      output: null,
      errors: [
        {
          message: 'Icon "Close" should use Outlined variant. Import "CloseOutlined" instead.',
          suggestions: [
            {
              desc: 'Import CloseOutlined as Close',
              output: "import { CloseOutlined as Close } from '@mui/icons-material'"
            }
          ]
        }
      ]
    },
    {
      code: "import { EditRounded } from '@mui/icons-material'",
      output: null,
      errors: [
        {
          message: 'Icon "EditRounded" should use Outlined variant. Import "EditOutlined" instead.',
          suggestions: [
            {
              desc: 'Import EditOutlined as EditRounded',
              output: "import { EditOutlined as EditRounded } from '@mui/icons-material'"
            }
          ]
        }
      ]
    },
    {
      code: "import MailIcon from '@mui/icons-material/Mail'",
      output: null,
      errors: [
        {
          message: 'Icon "Mail" should use Outlined variant. Import "MailOutlined" instead.',
          suggestions: [
            {
              desc: 'Import from @mui/icons-material/MailOutlined',
              output: "import MailIcon from '@mui/icons-material/MailOutlined'"
            }
          ]
        }
      ]
    }
  ]
})

ruleTester.run('text-casing-compliance', rules['text-casing-compliance'], {
  valid: [
    "const s = 'Add athlete'",
    "const codes = ['IR', 'PUP', 'NFI', 'UTC']",
    "import Foo from 'Some Module'",
    '<Typography>Save as draft</Typography>',
    "moment(value).format('D MMM YYYY')",
    "const DATE_FORMAT = 'DD MMM YYYY'",
    "const column = { format: 'D MMM YYYY' }",
    '<DatePicker format="DD MMM YYYY" />'
  ],
  invalid: [
    {
      code: "const s = 'Add Athlete'",
      output: null,
      errors: [{ message: 'Text "Add Athlete" should use sentence case. Consider: "Add athlete"', suggestions: [{ desc: 'Change to "Add athlete"', output: "const s = 'Add athlete'" }] }]
    },
    {
      code: "showToast('Save As Draft')",
      output: null,
      errors: [{ message: 'Text "Save As Draft" should use sentence case. Consider: "Save as draft"', suggestions: [{ desc: 'Change to "Save as draft"', output: "showToast('Save as draft')" }] }]
    },
    {
      code: "const s = 'ADD ATHLETE'",
      output: null,
      errors: [{ message: 'Text "ADD ATHLETE" should use sentence case. Consider: "Add athlete"', suggestions: [{ desc: 'Change to "Add athlete"', output: "const s = 'Add athlete'" }] }]
    },
    {
      code: '<Button>\n  Save As Draft\n</Button>',
      output: null,
      errors: [
        {
          message: 'Text "Save As Draft" should use sentence case. Consider: "Save as draft"',
          suggestions: [
            { desc: 'Change to "Save as draft"', output: '<Button>\n  Save as draft\n</Button>' }
          ]
        }
      ]
    }
  ]
})
