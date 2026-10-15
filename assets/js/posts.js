/* Blog posts, newest first.
   To publish a post: copy blog/_post-template.html to blog/<slug>/index.html,
   write the article, then add one entry at the top of this list and run
   `node tools/sync-posts.mjs` to refresh the static cards and the sitemaps.
   The homepage Blog section, the blog index and "More posts" all render from this list.
   Optional `updated: 'YYYY-MM-DD'` sets the sitemap lastmod after a substantial edit.
   A `medium` URL marks a post whose canonical lives on Medium; it stays out of the sitemap. */
window.BLOG_POSTS = [
	{
		slug: 'aws-basics-for-beginners',
		title: 'AWS Basics for Beginners: Essential Services Explained with Examples',
		description: '28 essential AWS services explained with simple examples, four beginner architectures, the AWS CLI, key cloud concepts and an AWS learning roadmap.',
		date: '2026-10-15',
		readingTime: 10,
		level: 'Beginner',
		tags: ['AWS', 'Cloud', 'DevOps'],
		url: '/blog/aws-basics-for-beginners/',
		cover: '/assets/img/blog/aws-basics-for-beginners/cover.webp',
		coverAlt: 'AWS Basics for Beginners cover: three architecture flows, Client to API Gateway to Lambda to DynamoDB, User to ELB to EC2 to RDS, and App to SQS to Lambda, with 28 services, 4 examples and 7 learning stages'
	},
	{
		slug: 'docker-image-optimization',
		title: 'Docker Image Optimization: Build Smaller, Faster and Safer Images',
		description: 'Take a Python app from 1.15 GB to 124 MB with slim base images, .dockerignore, cache mounts and a non-root user. Measured results and a Docker cheat sheet.',
		date: '2026-10-15',
		readingTime: 8,
		level: 'Beginner',
		tags: ['Docker', 'DevOps', 'Python'],
		url: '/blog/docker-image-optimization/',
		cover: '/assets/img/blog/docker-image-optimization/cover.webp',
		coverAlt: 'Docker Image Optimization cover: an optimized Dockerfile using a pinned slim Python base image, a pip cache mount and a non-root user, with measured results of 1.15 GB before, 124 MB after and a 2.2 second rebuild'
	},
	{
		slug: 'fastapi-for-beginners',
		title: 'FastAPI for Beginners: Build Your First Python API',
		description: 'Install FastAPI, build and run your first Python API, add request validation, and build a CRUD to-do API. Includes a comparison with Django REST Framework.',
		date: '2026-10-15',
		readingTime: 7,
		level: 'Beginner',
		tags: ['FastAPI', 'Python', 'APIs'],
		url: '/blog/fastapi-for-beginners/',
		cover: '/assets/img/blog/fastapi-for-beginners/cover.webp',
		coverAlt: 'FastAPI for Beginners cover: a main.py file with a FastAPI app and a /hello/{name} endpoint, run with fastapi dev, returning 200 for GET /hello/Riyas and /docs and 422 for bad input'
	},
	{
		slug: 'git-for-backend-developers',
		title: 'Git for Backend Developers: Commits, Branching, Rebasing and Recovering from Mistakes',
		description: 'Commits, branching, merge vs rebase, undoing mistakes, hotfixes and releases, git bisect and secret-blocking hooks, plus a Git cheat sheet.',
		date: '2026-10-15',
		readingTime: 16,
		level: 'Beginner to Intermediate',
		tags: ['Git', 'Workflow', 'Best Practices'],
		url: '/blog/git-for-backend-developers/',
		cover: '/assets/img/blog/git-for-backend-developers/cover.webp',
		coverAlt: 'Git for Backend Developers cover: a terminal showing git reset --hard HEAD~2, then git reflog listing the lost commit and git reset --hard HEAD@{1} bringing both commits back, with git bisect finding a bad commit among 30 in 5 runs'
	},
	{
		slug: 'python-concurrency-threads-asyncio-processes',
		title: 'Python Concurrency for Backend Developers: Threads, asyncio and Processes',
		description: 'When to use threads, asyncio or processes in a Python backend, with measured benchmarks on regular and free-threaded Python 3.14 and Django guidance.',
		date: '2026-10-15',
		readingTime: 14,
		level: 'Intermediate',
		tags: ['Python', 'Concurrency', 'Django'],
		url: '/blog/python-concurrency-threads-asyncio-processes/',
		cover: '/assets/img/blog/python-concurrency-threads-asyncio-processes/cover.webp',
		coverAlt: 'Python Concurrency cover: benchmark results showing 100 I/O calls taking 10.01 s sequentially, 0.40 s with threads and 0.10 s with asyncio, and CPU-bound threads taking 1.06 s with the GIL enabled versus 0.34 s with it disabled'
	},
	{
		slug: 'lazy-imports-in-python',
		title: 'Lazy Imports in Python: Benefits, Examples and Best Practices',
		description: 'Load modules only when your code needs them: practical patterns, a measured startup benchmark, Django guidance and the lazy import syntax in Python 3.15.',
		date: '2026-10-09',
		updated: '2026-10-14',
		readingTime: 17,
		level: 'Intermediate',
		tags: ['Python', 'Performance', 'Django'],
		url: '/blog/lazy-imports-in-python/',
		cover: '/assets/img/blog/lazy-imports-in-python/cover.webp',
		coverAlt: 'Lazy Imports in Python cover: a code window comparing an eager pandas import, a function-local import and the Python 3.15 lazy import keyword, with measured startup times of 246 ms eager and 19 ms lazy'
	},
	{
		slug: 'django-optimization-at-scale',
		title: 'Scaling Django Applications: Optimization Techniques for Millions of Records',
		description: 'How to find slow queries in Django, fix them with the ORM, and keep a project fast when tables grow past millions of rows.',
		date: '2026-10-07',
		updated: '2026-10-14',
		readingTime: 21,
		level: 'Intermediate to Advanced',
		tags: ['Django', 'Performance', 'PostgreSQL'],
		url: '/blog/django-optimization-at-scale/',
		cover: '/assets/img/blog/django-optimization-at-scale/cover.webp',
		coverAlt: 'Django Optimization cover: ORM methods such as select_related, only, iterator and bulk_create beside a database growing to millions of rows'
	},
	{
		slug: 'api-fundamentals',
		title: 'API Fundamentals: Architectures, Authentication, REST Design and Security',
		description: 'How APIs communicate, how they know who is calling, how to design clean REST endpoints, and how to keep them secure.',
		date: '2026-10-07',
		updated: '2026-10-14',
		readingTime: 16,
		level: 'Beginner to Intermediate',
		tags: ['APIs', 'REST', 'Security'],
		url: '/blog/api-fundamentals/',
		cover: '/assets/img/blog/api-fundamentals/cover.webp',
		coverAlt: 'API Fundamentals cover: a versioned, paginated GET request with a Bearer token and a 200 OK JSON response, covering 6 architectures, 4 auth methods and 10 security checks'
	},
	{
		slug: 'django-middleware-explained',
		title: 'Django Middleware Explained: The Complete Guide with Real-World Examples',
		description: 'Learn how Django processes every request and response, and why middleware is one of the most powerful features in Django.',
		date: '2026-07-28',
		updated: '2026-10-14',
		readingTime: 8,
		level: 'Beginner to Intermediate',
		tags: ['Django', 'Python', 'Middleware'],
		url: '/blog/django-middleware-explained/',
		cover: '/assets/img/blog/django-middleware-explained/cover.webp',
		coverAlt: 'Django Middleware: the hidden layer behind every request',
		medium: 'https://medium.com/@riyasac6/django-middleware-explained-the-complete-guide-with-real-world-examples-c0e041afd43b'
	}
];
