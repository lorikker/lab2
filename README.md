# `Fitness App`

This is a boilerplate project scaffolding your next developing project.

# Installation

- Install dependencies:

```bash
cd boilerplate-project-v2
pnpm i
```

- Configure your local environment:

```bash
cp .env.example .env
```

- If your mongodb instance is already running then run prisma generate otherwise move to the next step:

```bash
pnpm run db:generate
```

- Push your Prisma schema to the database (it will automatically invoke <code>[prisma generate](https://www.prisma.io/docs/concepts/components/prisma-migrate/db-push)</code>):

```bash
pnpm run db:push
```

- Populate the database with the seed:

```bash
pnpm run seed
```

- Run the server (login credentials are inside placeholder-data.js file located in /app/lib directory)

```bash
# development mode
pnpm run dev

# production mode
pnpm run build
pnpm run start
```

- Run Prisma studio:

```bash
pnpm run db:studio
```

# Security

Out of the box, Next.js provides security for different vulnerabilities, here are some of the security considerations that Next.js helps to address:

- [Cross-Site Scripting (XSS) Protection](https://nextjs.org/docs/pages/building-your-application/configuring/content-security-policy) - Next.js supports automatic HTML escaping by default. It uses React's server-side rendering to sanitize user inputs, helping to prevent XSS attacks. By using [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) your Next.js application is guarded against cross-site scripting (XSS), clickjacking, and other code injection attacks.
- [SQL Injection](https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#sql-injection) - Prisma mitigates the risk of SQL injection by escaping all variables when tagged templates are being used and sends all queries as prepared statements. [Check the docs](https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#sql-injection) for more information about the specific case where there is a vulnerability to SQL injection.

# Technologies

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
