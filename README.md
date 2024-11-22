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
yarn create-data --articles:amount=100 --articles:atOnce=10 --articles:startId=555
````

The `articles:amount` defines how much articles will be generated - default is **100**.

The `articles:atOnce` defines how much articles will be created at once (how many mutations will be sent at once) -
default is **10**.

The `articles:startId` defines the starting ID number of the articles - default is **1**.

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
* `model` - is the modelId you want to fetch entries from
* `per-request` - is the number of entries you want to fetch per request - default is **1000**
* `max-requests` - is the maximum number of requests you want to allow to execute - default is **100**
* `filename` - is the name of the file where the fetched entries will be saved - if no filename is given, you will only get info about the amount of entries fetched

Note that, if you pass the `filename`, the fetched entries will contain only the allowed types of fields, defined [here](https://github.com/webiny/webiny-js-data-mock/blob/main/src/apps/utils/createModelFields.ts#L3).

## Create Tenants

You can create tenants by running:

```
yarn create-tenants --tenants=aChildTenant,anotherChildTenant,....
```

But for that to work, you need a code from `./code/tenants/` diretory in your project.

Just copy the files and import the plugins via the `createTenantsMockDataPlugins()` from the `index.ts` file.

## Create Completely Random Mock Data For Any Model

### Add a custom authorizer which allows the `create-data-per-tenant` script to run

To be able to run the `create-data-per-tenant` script, you need to add a custom authorizer to your project. You can do
that by using the code in `./code/authorization` directory.

Just copy the files and import the plugins via the `createAuthenticator()` from the `index.ts` file.

### Creating the data

You can create completely random mock data for any model by running:

```
yarn create-data-per-tenant --tenants=yourTenantName --amount=1 --models=aModelId,anotherModelId,....
```

In the `tenants` argument, you can pass multiple tenants separated by a comma or a `*` to target all existing tenants.

In the `amount` argument, you must send the amount of the records you want to create. Default is `5`.

In the `models` argument, you must send the `modelId` of the model you want to create the records for. Same as for the
tenants, you can send multiple `modelId` separated by a comma or a `*` to target all existing models.

#### Dry Run

If you do not wish to insert data immediately, but you want to see what will get inserted, you can add the `--dry-run` flag.
It will generate JSON file in `./dryRuns/ ` directory.

#### IMPORTANT!

When sending a `*`, make sure it is sent with quotes, like this: `"*"`. Otherwise, the script will fail.
