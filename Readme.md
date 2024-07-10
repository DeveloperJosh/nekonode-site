# NekoNode Site

This is the next-js website for the NekoNode API. The website is built using Next.js and Tailwind CSS, Right now the webiste has the api built into it, I will continue to update [NekoNode CLI](https://github.com/DeveloperJosh/anime-cli) and [NekoNode API](https://github.com/DeveloperJosh/nekonode-api) along with this website.

## NekoNode CLI

[NekoNode CLI](https://github.com/DeveloperJosh/anime-cli) is a command-line tool that allows you to search for anime using the NekoNode API.

## Requirements

- [Node.js](https://nodejs.org/en/): I recommend using the latest LTS version.
- [Redis](https://redis.io/): for caching the API responses.
- [MongoDB](https://www.mongodb.com/): for storing the user data.
- [Hostinger](https://www.hostinger.com/): for the email service.
- [CryptoJS](https://cryptojs.gitbook.io/docs/): for encrypting the user data, and for the extractors, You will have to put them in your .env file.
- GogoCDN: Good luck with that one.

## System Requirements

- At least 2GB of RAM
- At least 2 CPU Cores
- At least 1GB of Storage

## Installation

1. Clone the repository
2. Run `npm install` to install the dependencies
3. Create a `.env` file in the root directory and add the following variables:

```env
JWT_SECRET=""
MONGO_URL=""
BASE_URL="https://gogoanime3.co"
CRYPTO_KEY=""
CRYPTO_SECOND_KEY=""
CRYPTO_IV=""
REDIS_URL=""
AJAX_URL=""
HEARTBEAT="" # Not required
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

## Documentation?

For the API documentation, please visit the [NekoNode API Documentation](https://api.nekonode.net/docs/).

## Found a Bug?

If you find a bug or have a feature request, please open an issue on the [NekoNode GitHub repository](https://github.com/DeveloperJosh/nekonode-site/issues) make sure it has the `bug` Label.