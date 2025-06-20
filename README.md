# Next.js + Prisma Project

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app), and uses [Prisma](https://www.prisma.io/) as the ORM.

---

## ✨ Features

- **User Authentication**: Sign up, sign in, and sign out functionality with secure password hashing.
- **Post Management**: Create, edit, and delete blog posts.
- **Comment System**: Add comments to posts, reply to comments, edit and delete comments and replies.
- **Like System**: Like and unlike posts, comments, and comment replies.
- **Favourites**: Mark posts as favourites and view your favourite posts.
- **Follow System**: Follow and unfollow other users.
- **Notifications**: Receive notifications for likes, comments, replies, follows, and new posts from the author that you followed.
- **Profile Page**: View your own and other authors' profiles.

## 🔧 Getting Started (Locally without Docker)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Rename `.example.env` to `.env` and update the database connection string:

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/YOUR_DATABASE_NAME
```

- For PostgreSQL: `postgresql://USER:PASSWORD@localhost:5432/YOUR_DATABASE_NAME`
- For MySQL: `mysql://USER:PASSWORD@localhost:3306/YOUR_DATABASE_NAME`

More options: [Prisma connection strings](https://www.prisma.io/docs/reference/database-reference/connection-urls)

### 3. Migrate Database

```bash
npm run db:deploy
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 Getting Started with Docker

### 1. Build the Docker Images

```bash
docker compose build
```

### 2. Run the Application

```bash
docker compose up
```

The app will be available at [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Environment Variables

Ensure your `.env` file contains the required values:

```env
DATABASE_USERNAME=YOUR_DATABASE_USERNAME
DATABASE_PASSWORD=YOUR_DATABASE_PASSWORD
DATABASE_NAME=YOUR_PREFERED_DATABASE_NAME
DATABASE_URL=postgresql://YOUR_DATABASE_USERNAME:YOUR_DATABASE_PASSWORD@postgres:5432/YOUR_PREFERED_DATABASE_NAME
```

Note:

- `postgres` is the hostname of the database container (not `localhost`).
- Replace all the value with your prefered choice

---

## 📁 Project Structure

```
app/              # Next.js app directory
prisma/           # Prisma schema and migrations
Dockerfile        # Docker build file for Next.js app
docker-compose.yml
.env              # Environment variables
```

---

## 🚀 Deploy on Vercel

The easiest way to deploy your Next.js app is with [Vercel](https://vercel.com). See [Next.js deployment docs](https://nextjs.org/docs/deployment).

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Docker for Node.js](https://nodejs.org/en/docs/guides/nodejs-docker-webapp)
