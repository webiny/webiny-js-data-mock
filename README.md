# Webiny Data Mock

Add .env file into the project root and fill it with:
````
API_GRAPHQL_URL=https://xxxxxxx.cloudfront.net
API_TOKEN=xxxxxxx
````


Run with
`````
yarn create-data
`````

## Blog mock data (id: blog)

The blog mock data creates:

- categories
- authors
- articles

### Categories

Category list is hardcoded, there is 10 of them.

### Authors

Authors list is hardcoded, there is 7 of them.

### Articles

Article structure is hardcoded, but the content is modified with the author name and category titles - as there can be
multiple categories attached to an article.

There are modifier arguments for the create-data command:

````
yarn create-data --article:amount=100 --article:atOnce=10
````

The `article:amount` defines how much articles will be generated - default is **100**.

The `article:atOnce` defines how much articles will be created at once (how many mutations will be sent at once) -
default is **10**.

#### Skip creating blog articles

If you want to skip creating blog articles, add `--skip=blog` argument to the create-data command:

````
yarn create-data --skip=blog
````

Note that this will NOT skip group and models creation.

## Car mock data (id: cars)

### Car Makes

Car makes list is hardcoded, there is 39 of them.

### Car Models

Car models list is hardcoded, there is 892 of them.

There are modifier arguments for the create-data command:

````
yarn create-data --carModels:atOnce=10
````

The `carModels:atOnce` defines how much car models will be created at once (how many mutations will be sent at once) -
default is **10**.

#### Skip creating cars

If you want to skip creating cars, add `--skip=cars` argument to the create-data command:

````
yarn create-data --skip=cars
````
