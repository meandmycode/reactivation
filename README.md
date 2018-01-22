# Reactivation

A baseline for building react + redux web applications, with a simplistic webpack configuration that adds [CSS Modules](https://github.com/css-modules/css-modules), automatic SVG sprites, an easy to configure mock rest api and image asset minification out of the box.

## Getting started

```sh
npx degit digital-engineers/reactivation my-swanky-project
cd my-swanky-project
npm install
```

## Why

Why use this over the mighty `create-react-app` (CRA)? you may want to use either, but the aim of this baseline is to provide a simplistic, extensible base that has a more specialised purpose than CRA could even provide.

Specifically we already:

- enable a the latest js pipeline, css modules and asset optimizers (such as automatic sprites and image optimization)
- provide a mock rest api to enable easy parallel development of application and backend
- out of the box we have a react + redux setup with a sample set of actions, reducer, container and components
- provide samples of more modern browser features and design patterns
- focus on providing a reasonable webpack configuration that resides within each project (rather than ejecting an incomprehensible mess with CRA)
- keep base template as simple as making a copy (vs cli tools and eject/initialize patterns)

## Debugging

`npm start`

## Building an optimized, deployable release

`npm run build`

## Configuring the default rest api endpoint

By default during debugging the default rest endpoint is configured to the built in mock api, you can override this during debugging and building by specifying the `API_BASE_URI` environment variable.

## Adding new resource types to the mock api

The mock api resources reside within the `mockapi` directory, the powering technology is [json server](https://github.com/typicode/json-server) with a few extensions to enable absolute references to resources within json, by specifying the `baseUrl` pattern [[1]](https://github.com/digital-engineers/reactivation/blob/master/mockapi/db.json#L5).
