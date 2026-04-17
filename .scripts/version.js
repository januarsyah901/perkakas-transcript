#!/usr/bin/env node

/**
 * Versioning Script untuk Perkakas YT
 * Penggunaan: node .scripts/version.js [major|minor|patch]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Warna untuk terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
};

// Paths
const packagePath = path.join(__dirname, '../package.json');
const changelogPath = path.join(__dirname, '../CHANGELOG.md');
const releasePath = path.join(__dirname, '../RELEASES.md');

// Parse arguments
const versionType = process.argv[2];
const changeMessage = process.argv.slice(3).join(' ');

if (!versionType || !['major', 'minor', 'patch'].includes(versionType)) {
  console.log(`${colors.red}Error: Gunakan format: npm run version -- [major|minor|patch] "deskripsi perubahan"${colors.reset}`);
  process.exit(1);
}

if (!changeMessage) {
  console.log(`${colors.red}Error: Berikan deskripsi perubahan${colors.reset}`);
  process.exit(1);
}

try {
  // Read current package.json
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const currentVersion = packageJson.version;
  
  // Parse version
  const [major, minor, patch] = currentVersion.split('.').map(Number);
  let newVersion;
  
  if (versionType === 'major') {
    newVersion = `${major + 1}.0.0`;
  } else if (versionType === 'minor') {
    newVersion = `${major}.${minor + 1}.0`;
  } else if (versionType === 'patch') {
    newVersion = `${major}.${minor}.${patch + 1}`;
  }
  
  // Get current date
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  
  // Update version in package.json
  packageJson.version = newVersion;
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
  
  // Update CHANGELOG.md
  const changelogEntry = `## [${newVersion}] - ${dateStr}

### Changes
- ${changeMessage}

`;
  
  const existingChangelog = fs.existsSync(changelogPath) 
    ? fs.readFileSync(changelogPath, 'utf8')
    : '# Changelog\n\nSemua perubahan penting di proyek ini akan didokumentasikan di file ini.\n\n';
  
  fs.writeFileSync(
    changelogPath,
    '# Changelog\n\nSemua perubahan penting di proyek ini akan didokumentasikan di file ini.\n\n' +
    changelogEntry +
    (existingChangelog.includes('# Changelog') 
      ? existingChangelog.split('# Changelog')[1] 
      : existingChangelog)
  );
  
  // Update RELEASES.md (untuk release notes yang lebih rapi)
  const releaseEntry = `## Version ${newVersion} - ${dateStr}

**${versionType.toUpperCase()}** Release

${changeMessage}

---

`;
  
  const existingReleases = fs.existsSync(releasePath)
    ? fs.readFileSync(releasePath, 'utf8')
    : '# Perkakas YT - Release Notes\n\n';
  
  fs.writeFileSync(
    releasePath,
    '# Perkakas YT - Release Notes\n\n' +
    releaseEntry +
    (existingReleases.includes('# Perkakas YT') 
      ? existingReleases.split('# Perkakas YT - Release Notes')[1]
      : existingReleases)
  );
  
  // Git commit and tag
  try {
    execSync('git add package.json CHANGELOG.md RELEASES.md');
    execSync(`git commit -m "chore: release version ${newVersion}"`);
    execSync(`git tag -a v${newVersion} -m "Release version ${newVersion}"`);
    
    console.log(`${colors.green}✓ Version berhasil diupdate!${colors.reset}`);
    console.log(`${colors.blue}  Current: ${currentVersion} → ${newVersion}${colors.reset}`);
    console.log(`${colors.blue}  Type: ${versionType}${colors.reset}`);
    console.log(`${colors.green}✓ Files updated: package.json, CHANGELOG.md, RELEASES.md${colors.reset}`);
    console.log(`${colors.green}✓ Git tag created: v${newVersion}${colors.reset}`);
    console.log(`\n${colors.yellow}Next step:${colors.reset}`);
    console.log(`  git push origin main --tags`);
  } catch (gitError) {
    console.log(`${colors.yellow}⚠ Version files updated tapi git error (mungkin belum ada git repo):${colors.reset}`);
    console.log(`${colors.blue}  Current: ${currentVersion} → ${newVersion}${colors.reset}`);
  }
} catch (error) {
  console.log(`${colors.red}Error: ${error.message}${colors.reset}`);
  process.exit(1);
}
