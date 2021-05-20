# rent-a-ni.co
Personal link shortening service built with fastify

## API

For routes that require authentication, please pass a header like so: `Authorization: Bearer <TOKEN>`

### `GET /api/v1/`
**Description:** General message about the API

### `POST /api/v1/redirects`
**Authentication required?: ✅** <br>
**Description:** Create a short link.
**Body:**
```ts
{
    destination: string
}
```

### `DELETE /api/v1/redirects/s/:id`
**Authentication required?: ✅** <br>
**Description:** Delete a short link

### `POST /api/v1/accounts/`
**Description:** Create an account.
```ts
{
    email: string,
    username: string,
    password: string
}
```

### `POST /api/v1/accounts/login`
**Description:** Login to an account and retrieve the generated token.
```ts
{
    username: string,
    password: string
}
```

### `GET /s/:id`
**Description:** Access a short link, will redirect user to the destination

### `GET /`
**Description:** Home page
