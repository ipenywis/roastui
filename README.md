# RoastUI

[RoastUI](https://roastui.design) is an innovative tool that offers AI-driven analysis for UI/UX designs. It's crafted to provide comprehensive insights, allowing you to refine your designs and quickly produce enhanced layouts.

The full project has been built in public on YouTube, you can watch the full video tutorial from [here](https://youtu.be/3r9mNlZNtRc) (~10hrs 😬).

## Features

- Completely built with Next.js
- Deployed on VPS on [fly.io](https://fly.io) across multiple regions
- Compiles, runs and renders AI-generated code in the browser using [esbuild WASM](https://esbuild.github.io)
- Uses SQLite with Fly.io LiteFS for distributed database

## Running The Project

If you want to play around with RoastUI locally, roast your own designs on your machine or contributing, this guide will help you properly setup and run the project.

The project runs on Next.js with ai-sdk from Vercel and it is deployed on fly.io (VPS).

#### 1. Clone the repository
First, you need to clone the repository to your local machine, you can use the following command

```bash
$ git clone https://github.com/ipenywis/roastui.git
```

This will clone the project to the `roastui` folder.

#### 2. Install dependencies

The project uses PNPM to manage dependencies, make sure to install it from [here](https://pnpm.io/cli/install) first.

Then simply run

```bash
$ pnpm install
```

#### 3. Setup environment variables

There are plenty of environment variables that are required in order to run the project, you can check the `.env.example` file to see the list of the variables that you need to populate for the app to properly run.

We use [openrouter](https://openrouter.ai) for running AI models, since it provides almost all AI models within one single API.

For authentication, we use next-auth.

For Object storage, we use Cloudflare R2, which is an AWS S3 compatible object storage.

#### 4. Run the development server

Once you have set up your environment variables, you can start the development server by running:

```bash
# pnpm is preferred over other package managers
$ pnpm dev
```

This will start the Next.js development server on `http://localhost:3000`. You can now open your browser and navigate to that address to see RoastUI running locally.

## Contributing

We welcome your contributions toward improving RoastUI! You can read the [CONTRIBUTING](./CONTRIBUTING.md) guide to know how to contribute to the project.

## License

This project is licensed under the Elastic License 2.0. See the [LICENSE](./LICENCE) file for details.
