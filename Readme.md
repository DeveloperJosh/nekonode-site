<h1 align="center">
NekoNode
</h1>

<p align="center">
  <a href="https://nekonode.net" target="_blank">
    <img src="https://raw.githubusercontent.com/DeveloperJosh/nekonode-site/master/public/logo.png" alt="Logo" width="200"/>
  </a>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/Node.js-339933.svg?style=for-the-badge&logo=node.js&logoColor=white"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Next.js-000000.svg?style=for-the-badge&logo=next.js&logoColor=white"/></a>
  <a href="#"><img src="https://img.shields.io/badge/MongoDB-4EA94B.svg?style=for-the-badge&logo=mongodb&logoColor=white"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white"/></a>
</p>

<p align="center">
  <a href="https://github.com/DeveloperJosh/nekonode-site/fork">
    <img src="https://img.shields.io/github/forks/DeveloperJosh/nekonode-site?style=social" alt="fork"/>
  </a>
  <a href="https://github.com/DeveloperJosh/nekonode-site">
    <img src="https://img.shields.io/github/stars/DeveloperJosh/nekonode-site?style=social" alt="stars"/>
  </a>
</p>

<div align="center" >

| Official Domains | Links                                      |
| ---------------- | ------------------------------------------ |
| Main Site        | [nekonode.net](https://nekonode.net)       |
| Mirror           | [nekohub.net](https://nekohub.net)         |

</div>

## What is NekoNode?

Welcome to **NekoNode** - your ultimate anime destination! Explore **[nekonode.net](https://nekonode.net)** and dive into the world of anime.

Crafted using **Next.js** and **Tailwind CSS**, our site offers a modern and responsive interface. Enjoy fast performance and smooth navigation as you explore a vast collection of HD anime titles.

Enjoy your favorite shows with English subs or dubs hassle-free, no sign-up required!

## Requirements

- [Node.js](https://nodejs.org/en/): I recommend using the latest LTS version.
- [Redis](https://redis.io/): for caching the API responses.
- [MongoDB](https://www.mongodb.com/): for storing the user data.
- [Player](https://github.com/DeveloperJosh/player-nekonode-site): for streaming the videos.
- GogoCDN: For fetching the video links. Add the URL to your .env file.

## System Requirements

- At least 2GB of RAM
- At least 2 CPU Cores
- At least 1GB of Storage

## Local Development

> **⚠️ Caution**
>
> If you want to self host this app, please note that it's only allowed for personal use.
> **Commercial use is not recommended.**


## Installation

1. Clone the repository
2. Run `npm install` to install the dependencies
3. Create a `.env` file in the root directory and add the following variables:

    ```env
    JWT_SECRET=""
    MONGO_URL=""
    BASE_URL="https://gogoanime3.co"
    REDIS_URL=""
    AJAX_URL=""
    DISCORD_CLIENT_ID=""
    DISCORD_CLIENT_SECRET=""
    NEXTAUTH_URL=http://localhost:3000 #your domain
    NEXTAUTH_URL_INTERNAL=http://localhost:3000 #your domain
    ```

4. Run `npm run dev` to start the development server

## Deployment

1. Run `npm run build` to build the project
2. Run `npm run start` to start the production server

## Contributing

If you would like to contribute to the project, please open a pull request on the [NekoNode-Site GitHub repository](https://github.com/DeveloperJosh/nekonode-site).

## Documentation

For the API documentation, please visit the [NekoNode API Documentation](https://api.nekonode.net/docs/).

## Found a Bug?

If you find a bug or have a feature request, please open an issue on the [NekoNode GitHub repository](https://github.com/DeveloperJosh/nekonode-site/issues) and make sure it has the `bug` label.

## Get in Touch! 📧

Got questions, suggestions, or just wanna say hi? Drop us a line at <a href="mailto:blue@blue-dev.xyz">Blue@blue-dev.xyz</a>. You can also hang out with us on Discord.

- Visit our website at **[NekoNode](https://nekonode.net)**
- Join our **[Discord](https://discord.gg/88ArBFRcY8)**
## Support & Contributions

If you would like to support or contribute to this project, feel free to star the [GitHub repository](https://github.com/DeveloperJosh/nekonode-site).

## License 📝

This project is licensed under the [MIT License](https://github.com/DeveloperJosh/nekonode-site/blob/master/LICENSE), I would appreciate it if you could include a link to the original repository.

## Found a Bug? 🐞

Uh-oh, looks like you stumbled upon a bug? No worries, we're here to squash it! Just head over to our [issues](https://github.com/DeveloperJosh/nekonode-site/issues) section on GitHub and let us know what's up.

## Star History 📈

<p align="center">
  <a href="https://starchart.cc/DeveloperJosh/nekonode-site"><img src="https://starchart.cc/DeveloperJosh/nekonode-site.svg?variant=adaptive" alt="Stargazers over time"/></a>
</p>
