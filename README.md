## Project Setup

1. Create a fork.
2. Clone your fork.
3. ``` cd srijan26 ```
4. ``` npm i ```
5. Copy the contents of .env.example, create a .env file and paste the contents there (make sure the env isn't being tracked by git).
6. ``` npx prisma generate ```
7. ``` npm run dev ```
8. If working on the backend, run ``` docker-compose up -d ``` to start up a local instance of mongodb using docker.
9. Run ``` npx prisma db push ``` to sync your schema with your database.

- When you want to merge your changes, create a pull request to the ```dev``` branch of the repository.

## Project Overview

- ```components``` has currently payments data, read the README in that file to know more
- ```hooks``` has payment modular function that connects to cashfree service and is called by the _paymentSection.tsx_

### Some development guidelines

- To access the database, import {prisma} from ["@/prisma/client"](/prisma/client.ts). Do not create a new Prisma Client instance for every file.

- For protected components, you can use the checkAuthentication method from [AuthService](services/AuthService.ts).

- For critical operations (editing/deleting data, etc), use a Confirmation Dialog on the frontend. Check [this](hooks/useConfirmationDialog.tsx) page for usage instructions.

- For the background gradient effect, you can use [this](/components/Balls.tsx) component. And for the non-rectangular button design, [this](/components/Clickable.tsx).