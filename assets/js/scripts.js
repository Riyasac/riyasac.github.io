/* Portfolio interactions: header state, scroll progress, active nav,
   reveal and stagger, count-up, typing stack card, card spotlight,
   mobile menu, back-to-top and footer year. */
(function () {
	'use strict';

	const header = document.getElementById('siteHeader');
	const progress = document.getElementById('scrollProgress');
	const backToTop = document.getElementById('backToTop');
	const navLinks = Array.from(document.querySelectorAll('#mainNav .nav-link'));
	const mainNav = document.getElementById('mainNav');
	const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const canObserve = 'IntersectionObserver' in window;

	// Header background, scroll progress and back-to-top visibility
	function onScroll() {
		const y = window.scrollY;
		const max = document.documentElement.scrollHeight - window.innerHeight;
		header.classList.toggle('is-scrolled', y > 24);
		backToTop.classList.toggle('is-visible', y > 600);
		if (progress) progress.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
	}

	let ticking = false;
	window.addEventListener('scroll', function () {
		if (ticking) return;
		ticking = true;
		window.requestAnimationFrame(function () {
			onScroll();
			ticking = false;
		});
	}, { passive: true });
	onScroll();

	// Active section indicator
	function setActive(id) {
		navLinks.forEach(function (link) {
			const isActive = link.getAttribute('href') === '#' + id;
			link.classList.toggle('active', isActive);
			if (isActive) {
				link.setAttribute('aria-current', 'true');
			} else {
				link.removeAttribute('aria-current');
			}
		});
	}

	if (canObserve) {
		const sections = navLinks
			.map(function (link) { return document.querySelector(link.getAttribute('href')); })
			.filter(Boolean);
		// Impact has no nav item; keep About highlighted while it is in view
		const impact = document.getElementById('impact');
		if (impact) sections.push(impact);

		const sectionObserver = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (!entry.isIntersecting) return;
				setActive(entry.target.id === 'impact' ? 'about' : entry.target.id);
			});
		}, { rootMargin: '-45% 0px -50% 0px' });

		sections.forEach(function (section) { sectionObserver.observe(section); });

		new IntersectionObserver(function (entries) {
			if (entries[0].isIntersecting) setActive('');
		}, { rootMargin: '-45% 0px -50% 0px' }).observe(document.getElementById('home'));
	}

	// Count-up for real figures already printed in the markup
	function countUp(el) {
		const target = Number(el.dataset.count);
		const prefix = el.dataset.prefix || '';
		const suffix = el.dataset.suffix || '';
		const duration = 1400;
		const start = performance.now();

		function frame(now) {
			const t = Math.min((now - start) / duration, 1);
			const eased = 1 - Math.pow(1 - t, 3);
			el.textContent = prefix + Math.round(target * eased).toLocaleString('en-US') + suffix;
			if (t < 1) window.requestAnimationFrame(frame);
		}
		window.requestAnimationFrame(frame);
	}

	// Reveal on scroll, with staggered children inside [data-stagger]
	document.querySelectorAll('[data-stagger]').forEach(function (group) {
		Array.from(group.children).forEach(function (child, i) {
			child.style.transitionDelay = Math.min(i * 80, 480) + 'ms';
		});
	});

	const revealItems = document.querySelectorAll('.reveal');

	if (reduceMotion || !canObserve) {
		revealItems.forEach(function (el) { el.classList.add('is-visible'); });
	} else {
		const revealObserver = new IntersectionObserver(function (entries, observer) {
			entries.forEach(function (entry) {
				if (!entry.isIntersecting) return;
				entry.target.classList.add('is-visible');
				entry.target.querySelectorAll('[data-count]').forEach(countUp);
				if (entry.target.dataset.count) countUp(entry.target);
				observer.unobserve(entry.target);
			});
		}, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

		revealItems.forEach(function (el) { revealObserver.observe(el); });

		// Impact values sit inside .reveal items; hero facts inside .hero-facts
		document.querySelectorAll('.impact-item [data-count], .hero-facts [data-count]').forEach(function (el) {
			el.textContent = (el.dataset.prefix || '') + '0' + (el.dataset.suffix || '');
		});
	}

	// Typing stack card
	const typing = document.querySelector('[data-typing]');
	if (typing && !reduceMotion) {
		const lines = typing.dataset.typing.split('|');
		let line = 0;
		let chars = lines[0].length;
		let deleting = true;
		typing.classList.add('is-typing');

		(function tick() {
			const text = lines[line];
			typing.textContent = text.slice(0, chars);
			let delay = deleting ? 28 : 55;

			if (!deleting && chars === text.length) {
				deleting = true;
				delay = 2200;
			} else if (deleting && chars === 0) {
				deleting = false;
				line = (line + 1) % lines.length;
				delay = 350;
			} else {
				chars += deleting ? -1 : 1;
			}
			window.setTimeout(tick, delay);
		})();
	}

	// Cursor spotlight on project cards
	document.querySelectorAll('.project-card, .project-featured').forEach(function (card) {
		card.addEventListener('pointermove', function (event) {
			const rect = card.getBoundingClientRect();
			card.style.setProperty('--mx', (event.clientX - rect.left) + 'px');
			card.style.setProperty('--my', (event.clientY - rect.top) + 'px');
		});
	});

	// Mobile menu: close after choosing a link, solid header while open
	if (mainNav) {
		mainNav.addEventListener('show.bs.collapse', function () { header.classList.add('is-open'); });
		mainNav.addEventListener('hidden.bs.collapse', function () { header.classList.remove('is-open'); });

		mainNav.addEventListener('click', function (event) {
			if (!event.target.closest('a') || !mainNav.classList.contains('show')) return;
			if (window.bootstrap) window.bootstrap.Collapse.getOrCreateInstance(mainNav).hide();
		});
	}

	// Theme toggle: a saved choice wins; otherwise follow the system setting
	const root = document.documentElement;
	const themeToggle = document.getElementById('themeToggle');
	const themeColor = document.getElementById('themeColor');
	const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

	function savedTheme() {
		try { return localStorage.getItem('theme'); } catch (e) { return null; }
	}

	function applyTheme(theme, animate) {
		if (animate && !reduceMotion) {
			root.classList.add('theme-switching');
			window.setTimeout(function () { root.classList.remove('theme-switching'); }, 400);
		}
		root.setAttribute('data-theme', theme);
		const next = theme === 'dark' ? 'light' : 'dark';
		themeToggle.setAttribute('aria-label', 'Switch to ' + next + ' theme');
		themeToggle.setAttribute('title', 'Switch to ' + next + ' theme');
		if (themeColor) themeColor.setAttribute('content', theme === 'dark' ? '#0e1626' : '#f6f5f0');
	}

	if (themeToggle) {
		applyTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light', false);

		themeToggle.addEventListener('click', function () {
			const theme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
			applyTheme(theme, true);
			try { localStorage.setItem('theme', theme); } catch (e) { /* storage blocked; theme lasts for this visit */ }
		});

		systemDark.addEventListener('change', function (event) {
			const saved = savedTheme();
			if (saved !== 'light' && saved !== 'dark') applyTheme(event.matches ? 'dark' : 'light', true);
		});
	}

	// Footer year
	const year = document.getElementById('year');
	if (year) year.textContent = new Date().getFullYear();
})();
