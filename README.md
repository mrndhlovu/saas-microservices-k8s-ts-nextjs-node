# Trello Clone Microservices app built with Typescript, Node, NextJS, Docker and Kubernetes

## Description

The project is an attempt to build a scalable event based microservices architecture. The focus was to decouple a monolithic idea into small manageable services which can be delegated to different teams.

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Project structure](#project-structure)
- [Technologies](#technologies)
- [Testing](#testing)
- [Usage](#usage)
- [LICENSE](#license)

## Installation

This installation process assumes that you are running the project locally on your machine and have at least 10GB of RAM and a multi-core processor.

- Step 1

---

    Clone repo:
    git clone https://github.com/mrndhlovsaas-microservices-k8s-ts-nextjs-node.git

---

- Step 2

```

    Add a .env file to the root of the project and add the following required environment variables.

    AUTH_MONGO_URI=mongodb://auth-mongo-srv:27017/<DB_NAME>
    BOARDS_MONGO_URI=mongodb://boards-mongo-srv:27017/<DB_NAME>
    ACCOUNTS_MONGO_URI=mongodb://accounts-mongo-srv:27017/<DB_NAME>
    PAYMENTS_MONGO_URI=mongodb://payments-mongo-srv:27017/<DB_NAME>
    EMAIL_MONGO_URI=mongodb://email-mongo-srv:27017/<DB_NAME>

    JWT_TOKEN_SIGNATURE=<YOUR_JWT_TOKEN_SIGNATURE>
    JWT_REFRESH_TOKEN_SIGNATURE=<YOUR_REFRESH_JWT_TOKEN_SIGNATURE>

    STRIPE_SECRET_KEY=<YOUR_STRIPE_SECRET_KEY>

    SEND_GRID_SECRET_KEY=<YOUR_SEND_GRID_SECRET_KEY>

    TOTP_AUTHENTICATOR_SECRET=<YOUR_TOTP_AUTHENTICATOR_SECRET>

    PORT=3000

    NATS_CLUSTER_ID=<YOUR_NATS_CLUSTER_ID>

    CLOUDINARY_CLOUD_NAME=<YOUR_CLOUDINARY_CLOUD_NAME>
    CLOUDINARY_API_KEY=<YOUR_CLOUDINARY_API_KEY>
    CLOUDINARY_API_SECRET=<YOUR_CLOUDINARY_API_SECRET>

    UNSPLASH_ACCESS_KEY=<YOUR_UNSPLASH_ACCESS_KEY>
    UNSPLASH_SECRET_KEY=<YOUR_UNSPLASH_SECRET_KEY>

    SPOTIFY_SECRET=<YOUR_SPOTIFY_SECRET>
    SPOTIFY_ID=<YOUR_SPOTIFY_ID>

    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<YOUR_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY>
    NEXT_PUBLIC_NGINX_BASE_URL=<YOUR_NEXT_PUBLIC_NGINX_BASE_URL>
    NEXT_PUBLIC_BASE_URL=https://<YOUR_NEXT_PUBLIC_BASE_URL>
    NEXT_PUBLIC_HOST=<YOUR_NEXT_PUBLIC_BASE_URL> // eg: tusks.dev

```
