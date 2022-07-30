[![deploy-accounts-service](https://github.com/mrndhlovu/trello-microservices-k8s/actions/workflows/deploy-accounts-service.yml/badge.svg)](https://github.com/mrndhlovu/trello-microservices-k8s/actions/workflows/deploy-accounts-service.yml) [![deploy-auth-service](https://github.com/mrndhlovu/trello-microservices-k8s/actions/workflows/deploy-auth-service.yml/badge.svg)](https://github.com/mrndhlovu/trello-microservices-k8s/actions/workflows/deploy-auth-service.yml) [![deploy-board-service](https://github.com/mrndhlovu/trello-microservices-k8s/actions/workflows/deploy-board-service.yml/badge.svg)](https://github.com/mrndhlovu/trello-microservices-k8s/actions/workflows/deploy-board-service.yml) [![deploy-client-service](https://github.com/mrndhlovu/trello-microservices-k8s/actions/workflows/deploy-client-service.yml/badge.svg)](https://github.com/mrndhlovu/trello-microservices-k8s/actions/workflows/deploy-client-service.yml) [![deploy-email-service](https://github.com/mrndhlovu/trello-microservices-k8s/actions/workflows/deploy-email-service.yml/badge.svg)](https://github.com/mrndhlovu/trello-microservices-k8s/actions/workflows/deploy-email-service.yml) [![deploy-payments-service](https://github.com/mrndhlovu/trello-microservices-k8s/actions/workflows/deploy-payments-service.yml/badge.svg)](https://github.com/mrndhlovu/trello-microservices-k8s/actions/workflows/deploy-payments-service.yml) [![deploy-manifests](https://github.com/mrndhlovu/trello-microservices-k8s/actions/workflows/deploy-manifests.yml/badge.svg)](https://github.com/mrndhlovu/trello-microservices-k8s/actions/workflows/deploy-manifests.yml)

# Trello Clone Microservices app built with Typescript, Node, NextJS, Docker and Kubernetes.

## Description

The project is an attempt to build a scalable event based microservices architecture. The focus was to decouple a monolithic idea into small manageable services which can be delegated to different teams.

## Table of Contents

- [Trello Clone Microservices app built with Typescript, Node, NextJS, Docker and Kubernetes.](#trello-clone-microservices-app-built-with-typescript-node-nextjs-docker-and-kubernetes)
  - [Description](#description)
  - [Table of Contents](#table-of-contents)
  - [Screenshots](#screenshots)
  - [Project structure](#project-structure)
  - [Installation](#installation)

## Screenshots

- Two step authentication
  ![alt Two step authentication](https://res.cloudinary.com/drxavrtbi/image/upload/v1630885504/projects/mfa_m9wjlh.gif)

- Service Upgrade Checkout
  ![alt Service Upgrade Checkout](https://res.cloudinary.com/drxavrtbi/image/upload/v1630885295/projects/checkoutsaas_fgnbfx.gif)

- Image Drag and drop
  ![alt Image Drag and drop](https://res.cloudinary.com/drxavrtbi/image/upload/v1630885406/projects/Imageupload_ct0weh.gif)

- Dark mde
  ![alt Infinite scrolling](https://res.cloudinary.com/drxavrtbi/image/upload/v1630886099/projects/darkmode_x8rwzv.gif)

## Project structure

NB: The project depends on this shared resources repo deployed on npm.

```
@tusksui/shared
```

- Frontend

  - client

- Backend

  - accounts-service
  - auth-service
  - board-service
  - email-service
  - payments-service

- Config files
  - makefile
  - .gitignore
  - skaffold.yml
  - infar

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

    MONGO_URI=mongodb://auth-mongo-srv:27017/<DB_NAME>
    MONGO_URI=mongodb://boards-mongo-srv:27017/<DB_NAME>
    MONGO_URI=mongodb://accounts-mongo-srv:27017/<DB_NAME>
    MONGO_URI=mongodb://payments-mongo-srv:27017/<DB_NAME>
    MONGO_URI=mongodb://email-mongo-srv:27017/<DB_NAME>

    JWT_ACCESS_TOKEN_SIGNATURE=<YOUR_JWT_TOKEN_SIGNATURE>
    JWT_REFRESH_TOKEN_SIGNATURE=<YOUR_REFRESH_JWT_TOKEN_SIGNATURE>

    STRIPE_SECRET_KEY=<YOUR_STRIPE_SECRET_KEY>

    MAILGUN_SECRET_KEY=<YOUR_MAILGUN_SECRET_KEY>

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

---

- Step 3

---

    Install
    [minikube](https://minikube.sigs.k8s.io/docs/start/)

    Enable ingress addon:
    minikube addons enable ingress

    Install
    [skaffold](https://skaffold.dev/)

---

- Step 4

---

    Tell kubernetes where to find your environment variables:

    kubectl create secret generic env-config --from-env-file=.env

---

- Step 5

---

    Install typescript

---
