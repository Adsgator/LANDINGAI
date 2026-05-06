const fs = require('fs');
const doc = fs.readFileSync('docs/LANDINGAI-V3-IMPLEMENTAÇÃO.md', 'utf8');

const regex = /```(.*?)\n([\s\S]*?)```/g;
let match;
let i = 0;
while ((match = regex.exec(doc)) !== null) {
    console.log(`Block ${i++}: Lang = "${match[1].trim()}"`);
    if (match[1].trim() === 'html') {
      fs.writeFileSync('scratch/html_preview.txt', match[2].substring(0, 500) + '\n...\n' + match[2].substring(match[2].length - 500));
    }
}
