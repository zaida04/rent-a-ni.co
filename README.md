<div align="center">
<h1>rent-a-ni.co</h1>
<p>Link shortener named after the popular "RAG" series.</p>
<p>
    <a href="https://discord.gg/jf66UUN"><img src="https://img.shields.io/discord/732714723744940032.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2 "></a>
    <img src="https://github.com/zaida04/rent-a-ni.co/workflows/lint-and-build/badge.svg" alt="Lint and build">
    <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a><br>
    <a href="https://github.com/zaida04/rent-a-ni.co/issues"><img src="https://img.shields.io/github/issues-raw/zaida04/rent-a-ni.co.svg?maxAge=25000" alt="Issues"></a>
    <a href="https://github.com/zaida04/rent-a-ni.co/pulls"><img src="https://img.shields.io/github/issues-pr/zaida04/rent-a-ni.co.svg?style=flat" alt="GitHub pull requests"></a><br>
</p>
</div>

## 📝 About
Personal link shortening service built with fastify

## 📦 Main Dependencies
- [Fastify](https://www.fastify.io/docs/latest/TypeScript/) - HTTP Router
- [BCrypt](https://www.npmjs.com/package/bcrypt) - Hashing and dehashing of password
- [JWT](https://www.npmjs.com/package/jsonwebtoken) - Encrypted payload that holds data 
- [Knex](http://knexjs.org/) - Database query builder
- [NanoID](https://github.com/ai/nanoid) - URL-safe ID generator 
- [UUID](https://www.npmjs.com/package/uuid) - Unique ID generator

## API Routes
API Routes preceeding with 🔒 require authentication. You authenticate yourself by passing an `Authorization: Bearer <token>` header with your request. You can retrieve a token by [creating an account](https://github.com/zaida04/rent-a-ni.co#post-apiv1accounts) or [logging into an account](https://github.com/zaida04/rent-a-ni.co#post-apiv1accountslogin)

### `GET /api/v1/`
General message about the API

### 🔒 `POST /api/v1/redirects`
Create a short link.  
```ts
{
    destination: string
}
```

### 🔒 `DELETE /api/v1/redirects/s/:id`
Delete a short link  

### `POST /api/v1/accounts/`
Create an account.
```ts
{
    email: string,
    username: string,
    password: string
}
```

### `POST /api/v1/accounts/login`
Login to an account and retrieve the generated token.
```ts
{
    username: string,
    password: string
}
```

### `GET /s/:id`
Access a short link, will redirect user to the destination

### `GET /`
Home page


## ✋ Contributing
Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.  

Please ensure any and all commits pass our tests, linting, and build steps
  
## ⚖️ LICENSING
Licensed under the [MIT License](https://github.com/zaida04/rent-a-ni.co/blob/main/LICENSE)  

For routes that require authentication, please pass a header like so: `Authorization: Bearer <TOKEN>`

