This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Project Overview

- ```components``` has currently payments data, read the README in that file to know more
- ```hooks``` has payment modular function that connects to cashfree service and is called by the _paymentSection.tsx_
- ```lib``` has auth actions (sign in, sign out and sign up apis), and the auth files itself for betterauth
- DB client -> @/prisma/prisma.ts
