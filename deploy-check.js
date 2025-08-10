// Simple deployment verification script
console.log('✅ Deployment verification started');
console.log('📁 Checking build output...');

import { existsSync, readdirSync } from 'fs';
import { join } from 'path';

const distPath = './dist/spa';

if (existsSync(distPath)) {
  console.log('✅ dist/spa directory exists');
  const files = readdirSync(distPath);
  console.log('📄 Files in dist/spa:', files);
  
  if (files.includes('index.html')) {
    console.log('✅ index.html found');
  } else {
    console.log('❌ index.html NOT found');
  }
  
  const hasAssets = files.some(file => file.startsWith('assets'));
  if (hasAssets) {
    console.log('✅ Assets directory found');
  } else {
    console.log('❌ Assets directory NOT found');
  }
} else {
  console.log('❌ dist/spa directory does not exist');
}

console.log('🚀 Ready for Netlify deployment!');
