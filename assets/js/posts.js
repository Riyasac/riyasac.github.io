/* Blog posts, newest first.
   To publish a post: copy blog/_post-template.html to blog/<slug>/index.html,
   write the article, then add one entry at the top of this list.
   The homepage Blog section and the blog index both render from this list. */
window.BLOG_POSTS = [
	{
		slug: 'django-middleware-explained',
		title: 'Django Middleware Explained: The Complete Guide with Real-World Examples',
		description: 'Learn how Django processes every request and response, and why middleware is one of the most powerful features in Django.',
		date: '2026-07-28',
		readingTime: 16,
		level: 'Beginner to Intermediate',
		tags: ['Django', 'Python', 'Middleware'],
		url: '/blog/django-middleware-explained/',
		cover: '/assets/img/blog/django-middleware-explained/cover.webp',
		coverAlt: 'Django Middleware: the hidden layer behind every request',
		medium: 'https://medium.com/@riyasac6/django-middleware-explained-the-complete-guide-with-real-world-examples-c0e041afd43b'
	}
];
