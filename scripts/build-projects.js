// Pre-renders the Key Projects tabs and cards into index.html so crawlers and link
// previews see real content without running JavaScript.
//
// Usage: node scripts/build-projects.js
// Run it after editing js/projects.js, then commit the updated index.html.

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const indexPath = path.join(root, 'index.html');

// Load the same browser scripts the page uses into one shared context
const context = vm.createContext({});
for (const file of ['js/projects.js', 'js/project-cards.js']) {
    vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
}
const { tabs, cards, count } = vm.runInContext(`({
    tabs: projectTabsHTML(PROJECT_CATEGORIES),
    cards: PROJECTS.map(projectCardHTML).join('\\n'),
    count: PROJECTS.length
})`, context);

function indent(html, spaces) {
    const pad = ' '.repeat(spaces);
    return html.split('\n').map(line => pad + line).join('\n');
}

function inject(html, name, content, spaces) {
    const pattern = new RegExp(`(<!-- BUILD:${name} -->)[\\s\\S]*?(\\n[ \\t]*<!-- /BUILD:${name} -->)`);
    if (!pattern.test(html)) throw new Error(`Marker BUILD:${name} not found in index.html`);
    return html.replace(pattern, (_, open, close) => `${open}\n${indent(content, spaces)}${close}`);
}

let html = fs.readFileSync(indexPath, 'utf8');
html = inject(html, 'PROJECT-TABS', tabs, 16);
html = inject(html, 'PROJECT-CARDS', cards, 16);
fs.writeFileSync(indexPath, html);

console.log(`Rendered ${count} project cards into index.html`);
