#!/usr/bin/env node

/**
 * Design System Validation Script
 * 
 * Runs comprehensive checks for design system compliance
 * Can be used manually or in CI/CD pipelines
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎨 Design System Validation Script');
console.log('==================================\n');

let hasErrors = false;

function runCommand(command, description) {
  console.log(`📋 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} passed\n`);
    return true;
  } catch (error) {
    console.log(`❌ ${description} failed\n`);
    hasErrors = true;
    return false;
  }
}

function checkFileExists(filePath, description) {
  console.log(`📁 Checking ${description}...`);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description} exists\n`);
    return true;
  } else {
    console.log(`❌ ${description} missing: ${filePath}\n`);
    hasErrors = true;
    return false;
  }
}

function checkDesignTokens() {
  console.log('🔧 Validating design tokens...');
  const tokensPath = 'src/styles/design-tokens.css';
  
  if (!fs.existsSync(tokensPath)) {
    console.log('❌ Design tokens file missing\n');
    hasErrors = true;
    return false;
  }
  
  const content = fs.readFileSync(tokensPath, 'utf8');
  const requiredTokens = [
    '--color-primary',
    '--color-secondary', 
    '--color-success',
    '--color-error',
    '--color-warning'
  ];
  
  const missingTokens = requiredTokens.filter(token => !content.includes(token));
  
  if (missingTokens.length > 0) {
    console.log(`❌ Missing design tokens: ${missingTokens.join(', ')}\n`);
    hasErrors = true;
    return false;
  }
  
  console.log('✅ All required design tokens present\n');
  return true;
}

function checkHardcodedColors() {
  console.log('🔍 Checking for hardcoded colors...');
  const hexColorRegex = /#[0-9a-fA-F]{6}\b/;
  const excludedPaths = ['design-tokens.css', 'playbook-components', path.join('src', 'stories')];

  function collectFiles(dir, results = []) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) collectFiles(full, results);
      else if (/\.(js|jsx|css)$/.test(e.name)) results.push(full);
    }
    return results;
  }

  const violations = [];
  for (const file of collectFiles('src')) {
    if (excludedPaths.some(ex => file.includes(ex))) continue;
    const content = fs.readFileSync(file, 'utf8');
    // Skip files with a block-level eslint-disable for colors
    if (content.includes('eslint-disable') && content.includes('no-hardcoded-colors')) continue;
    const lines = content.split('\n');
    for (const line of lines) {
      if (line.includes('eslint-disable')) continue;
      if (hexColorRegex.test(line)) violations.push(`${file}: ${line.trim()}`);
    }
  }

  if (violations.length) {
    console.log('❌ Hardcoded colors found:');
    console.log(violations.join('\n'));
    console.log('\nPlease use design tokens instead.\n');
    hasErrors = true;
    return false;
  }

  console.log('✅ No hardcoded colors found\n');
  return true;
}

function checkDisallowedButtonsAndIcons() {
  console.log('🔍 Checking for disallowed button variants and non-outlined icons...');
  const excludedDirs = ['playbook-components', path.join('src', 'stories')];
  const files = [];
  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (/(\.jsx?|\.css)$/.test(e.name)) files.push(full);
    }
  }
  walk('src');
  let foundIssues = '';
  for (const file of files) {
    if (excludedDirs.some(ex => file.includes(ex))) continue;
    const content = fs.readFileSync(file, 'utf8');
    // Only flag Button components (not Paper/Typography/TextField) with disallowed variants
    if (/<Button[^>]*variant\s*=\s*['"](?:text|outlined)['"]/g.test(content)) {
      foundIssues += `Disallowed button variant in ${file}\n`;
    }
    const iconImports = content.match(/import\s*\{[^}]*\}\s*from\s*['"]@mui\/icons-material['"]/g) || [];
    if (iconImports.length) {
      const names = (content.match(/\{([^}]*)\}\s*from\s*['"]@mui\/icons-material['"]/g) || [])
        .flatMap(m => m.replace(/^[^{]*\{|\}.*$/g, '').split(',').map(s => s.trim()))
        .filter(Boolean)
        // Strip aliases: "EditOutlined as EditIcon" → "EditOutlined"
        .map(n => n.split(/\s+as\s+/)[0].trim());
      for (const n of names) {
        if (n && !n.endsWith('Outlined')) {
          foundIssues += `Non-outlined icon '${n}' in ${file}\n`;
        }
      }
    }
  }
  if (foundIssues) {
    console.log('❌ Component usage violations found:\n' + foundIssues);
    hasErrors = true;
    return false;
  }
  console.log('✅ No disallowed button variants or icons found\n');
  return true;
}

// Run all checks
console.log('Starting comprehensive design system validation...\n');

// Essential files
checkFileExists('src/styles/design-tokens.css', 'Design tokens file');
checkFileExists('.eslintrc.js', 'ESLint configuration');
checkFileExists('.stylelintrc.json', 'Stylelint configuration');
// Pre-commit hook is optional in CI environments
if (fs.existsSync('.husky/pre-commit')) {
  console.log('📁 Checking Pre-commit hooks...\n✅ Pre-commit hooks exist\n');
} else {
  console.log('📁 Checking Pre-commit hooks...\n⚠️  Pre-commit hooks not found (optional in CI)\n');
}

// Plugin files
checkFileExists('eslint-plugin-design-system/index.js', 'ESLint plugin');
checkFileExists('stylelint-plugin-design-system/index.js', 'Stylelint plugin');

// Design token validation
checkDesignTokens();

// Color validation
checkHardcodedColors();

// Component usage validation
checkDisallowedButtonsAndIcons();

// Code style validation
runCommand('npm run lint', 'ESLint validation');
runCommand('npm run lint:css', 'CSS lint validation');

// Summary
console.log('=================================');
if (hasErrors) {
  console.log('❌ Design system validation failed!');
  console.log('\nPlease fix the issues above before proceeding.');
  console.log('\nQuick reference:');
  console.log('  • Colors: Use var(--color-primary), var(--color-secondary)');
  console.log('  • Buttons: Use variant="contained"');
  console.log('  • Icons: Import with "Outlined" suffix');
  console.log('  • Text: Use sentence case');
  process.exit(1);
} else {
  console.log('✅ All design system checks passed!');
  console.log('🎉 Your code is ready for production!');
}