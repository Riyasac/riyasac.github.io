/* Writes the crawlable parts that come from assets/js/posts.js:
   - static post cards between <!-- posts:start --> and <!-- posts:end --> markers
     (homepage Blog section, blog index, "More posts" on each post)
   - sitemap.xml and sitemap.txt
   scripts.js still renders the same cards in the browser; this keeps the links
   in the HTML for crawlers and visitors without JavaScript.
   Run after editing posts.js:  node tools/sync-posts.mjs
   No dependencies. Pass --check to exit 1 when any file is out of date. */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE_URL = 'https://riyasac.github.io';
const CHECK = process.argv.includes('--check');

const sandbox = { window: {} };
vm.runInNewContext(readFileSync(join(ROOT, 'assets/js/posts.js'), 'utf8'), sandbox);
const posts = sandbox.window.BLOG_POSTS;

const stale = [];

function write(rel, content) {
	const file = join(ROOT, rel);
	const current = existsSync(file) ? readFileSync(file, 'utf8') : '';
	if (current === content) return;
	stale.push(rel);
	if (!CHECK) writeFileSync(file, content);
}

function esc(text) {
	return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatDate(iso) {
	return new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Same markup as postCard() in scripts.js. Covers in the first row of the blog
// index are above the fold, so they load eagerly; the first one is the LCP image.
function card(post, indent, position, eager) {
	const lines = ['<article class="post-card reveal">'];
	if (post.cover) {
		const loading = position < eager ? (position === 0 ? ' fetchpriority="high"' : '') : ' loading="lazy"';
		lines.push(`\t<div class="post-card-cover"><img src="${esc(post.cover)}" alt=""${loading} width="1024" height="535"></div>`);
	}
	lines.push(
		'\t<div class="post-card-body">',
		`\t\t<p class="post-card-meta"><time datetime="${esc(post.date)}">${formatDate(post.date)}</time> · ${post.readingTime} min read</p>`,
		`\t\t<h3><a href="${esc(post.url)}">${esc(post.title)}</a></h3>`,
		`\t\t<p class="post-card-desc">${esc(post.description)}</p>`
	);
	if (post.tags && post.tags.length) {
		lines.push(`\t\t<ul class="tag-list" aria-label="Tags">${post.tags.map(function (tag) { return '<li>' + esc(tag) + '</li>'; }).join('')}</ul>`);
	}
	lines.push('\t</div>', '</article>');
	return lines.map(function (line) { return indent + line; }).join('\n');
}

function fillCards(rel, items, eager) {
	const file = join(ROOT, rel);
	const html = readFileSync(file, 'utf8');
	const marker = /([ \t]*)<!-- posts:start -->[\s\S]*?<!-- posts:end -->/;
	const match = html.match(marker);
	if (!match) throw new Error(rel + ': missing <!-- posts:start --> / <!-- posts:end --> markers');
	const indent = match[1];
	const body = items.map(function (post, i) { return card(post, indent, i, eager || 0); }).join('\n');
	let next = html.replace(marker, indent + '<!-- posts:start -->\n' + (body ? body + '\n' : '') + indent + '<!-- posts:end -->');
	// "More posts" stays hidden when there is nothing else to show
	next = next.replace(/(<section class="more-posts"[^>]*?)( hidden)?>/, function (all, open) {
		return open + (items.length ? '' : ' hidden') + '>';
	});
	write(rel, next);
}

fillCards('index.html', posts.slice(0, 3));
fillCards('blog/index.html', posts, 3);
posts.forEach(function (post) {
	fillCards('blog/' + post.slug + '/index.html', posts.filter(function (other) { return other.slug !== post.slug; }));
});

// Sitemaps list canonical pages only. A post republished from Medium keeps its
// canonical on Medium (the `medium` field), so it stays out of the sitemap.
const indexable = posts.filter(function (post) { return !post.medium; });
const latest = posts.map(function (post) { return post.updated || post.date; }).sort().pop();
const urls = [
	{ loc: SITE_URL + '/' },
	{ loc: SITE_URL + '/blog/', lastmod: latest }
].concat(indexable.map(function (post) {
	return { loc: SITE_URL + post.url, lastmod: post.updated || post.date };
}));

write('sitemap.xml', [
	'<?xml version="1.0" encoding="UTF-8"?>',
	'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
	...urls.map(function (url) {
		return '\t<url><loc>' + esc(url.loc) + '</loc>' + (url.lastmod ? '<lastmod>' + url.lastmod + '</lastmod>' : '') + '</url>';
	}),
	'</urlset>',
	''
].join('\n'));
write('sitemap.txt', urls.map(function (url) { return url.loc; }).join('\n') + '\n');

if (CHECK && stale.length) {
	console.error('Out of date, run node tools/sync-posts.mjs:\n  ' + stale.join('\n  '));
	process.exit(1);
}
console.log(stale.length ? (CHECK ? '' : 'Updated:\n  ' + stale.join('\n  ')) : 'Everything up to date.');
