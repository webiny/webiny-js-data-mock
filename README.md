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
yarn create-data --article:amount=100 --article:atOnce=10 --article:startId=555
````

The `article:amount` defines how much articles will be generated - default is **100**.

The `article:atOnce` defines how much articles will be created at once (how many mutations will be sent at once) -
default is **10**.

The `article:startId` defines the starting ID number of the articles - default is **1**.

#### Skip creating blog articles

If you want to skip creating blog articles, add `--skip=cms:blog` argument to the create-data command:

````
yarn create-data --skip=cms:blog
````

Note that this will NOT skip group and models creation.

## Car mock data (id: simpleCars)

### Car Makes

Car makes list is hardcoded, there is 39 of them.

### Car Models

Car models list is hardcoded, there is 892 of them.

There are modifier arguments for the create-data command:

````
yarn create-data --simpleCarModels:atOnce=10
````

The `simpleCarModels:atOnce` defines how much car models will be created at once (how many mutations will be sent at once) -
default is **10**.

#### Skip creating simple cars

If you want to skip creating cars, add `--skip=cms:simpleCars` argument to the create-data command:

````
yarn create-data --skip=cms:simpleCars
````


## Fetch All Entries From A Certain Model

You can also fetch a list of entries from a certain model. For example, to fetch a list of articles, run:
```
yarn fetch-data --model=article --per-request=2000 --filename=articles.json
```
Where:
* model - is the modelId you want to fetch entries from
* per-request - is the number of entries you want to fetch per request - default is 1000
* max-requests - is the maximum number of requests you want to allow to execute - default is 100
* filename - is the name of the file where the fetched entries will be saved - if no filename is given, you will only get info about the amount of entries fetched
