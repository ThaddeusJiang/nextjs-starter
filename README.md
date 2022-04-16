# React App Starter

> You shouldn't start a wonderful app from scratch every time.
>
>  ~ TJ

[![Detect Secrets](https://github.com/ThaddeusJiang/react-app-starter/actions/workflows/detect-secrets.yml/badge.svg)](https://github.com/ThaddeusJiang/react-app-starter/actions/workflows/detect-secrets.yml)
[![Test](https://github.com/ThaddeusJiang/react-app-starter/actions/workflows/test.yml/badge.svg)](https://github.com/ThaddeusJiang/react-app-starter/actions/workflows/test.yml)
[![Deployment](https://vercelbadge.vercel.app/api/ThaddeusJiang/react-app-starter)](https://react-app-starter-tj.vercel.app/)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Twitter: ThaddeusJiang](https://img.shields.io/twitter/follow/ThaddeusJiang.svg?style=social)](https://twitter.com/ThaddeusJiang)


## Features:

- [x] Out of box API mocking.
- [x] Out of box Authentication.
- [x] Beautiful Data fetching.
- [x] Easy Form validation.
- [x] Out of box Utility-First CSS.
- [x] Out of box CI/CD.
- [x] Out of box lint and code format.
- [x] Out of box Infrastructure as Code.
- [x] A little of Components.
- [x] ... and more

## Built with

- [NextJS: the React Framework for Production](https://nextjs.org/docs)
- [Tailwindcss: rapidly build modern websites without ever leaving your HTML](https://tailwindcss.com/)
  - [daisyUI: Tailwind Components](https://github.com/saadeghi/daisyui/)
- [React-hook-form: performance, flexible and extensible forms with easy-to-use validation](https://www.react-hook-form.com/)
- [React-query: performant and powerful data synchronization for React](https://react-query.tanstack.com/)
- [React-table: Lightweight and extensible data tables for React](https://react-table.tanstack.com/)
- [Storybook: build bulletproof UI components faster](https://storybook.js.org)
  - [Chromatic: visual testing](https://www.chromatic.com/features/test)
- [react-testing: simple and complete testing utilities that encourage good testing practices](https://testing-library.com/)
- [Mock Service Worker: API mocking of the next generation](https://github.com/mswjs/msw)
- And other standard tools as [Eslint](https://eslint.org/), [Prettier](https://prettier.io/), [Lint-staged](https://github.com/okonet/lint-staged)

## Install

```sh
yarn install
```

## Usage

Create .env file base on sample.env then run below command

```
cp sample.env .env
```

> About the secret token, ask @ThaddeusJiang

```sh
yarn dev
```

## Run tests

```sh
yarn test
```

## Run storybook

```sh
yarn storybook
```

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fhello-world)

## Author

- Website: https://ThaddeusJiang.com/
- Twitter: [@ThaddeusJiang](https://twitter.com/ThaddeusJiang)
- Github: [@ThaddeusJiang](https://github.com/ThaddeusJiang)

# Auth Providers

## github
- Callback URL: `<domain>/api/auth/callback/github`
- https://next-auth.js.org/providers/

# Memo

其实我想用 [Ramdajs](https://ramdajs.com/) ，但是我也不是特别熟。
暂时先继续使用 lodash/fp 吧。

关于报表可视化，需要评估 [d3js](https://d3js.org/) ，
目前使用 react-charts 。

# folder structure

```
.
├── client // UI clients
│   └── apis
├── components // UI Components
├── data
│   ├── reals
│   └── mocks // mock data
├── mocks // Mock Service Worker handlers
├── modules
│   ├── customer
│   │   └── apis
│   │   └── components
│   └── task
│   │   └── apis
│       └── components
├── pages
│   ├── api // Auth API
│   │   └── auth
│   ├── customers // UI Pages
│   ├── ...
│   ├── ...
├── public
├── styles
├── types
└── utils
└── tailwind.config.js
```
