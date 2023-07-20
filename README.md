## Webiny Data Mock

Add .env file into the project root and fill it with:
````
API_GRAPHQL_URL=https://xxxxxxx.cloudfront.net
API_TOKEN=xxxxxxx
````


Run with
`````
yarn create-data
`````


### Blog mock data
The blog mock data creates:
- categories
- authors
- articles

#### Categories
Category list is hardcoded, there is 10 of them.

#### Authors
Authors list is hardcoded, there is 7 of them.

#### Articles
Article structure is hardcoded, but the content is modified with the author name and category titles - as there can be multiple categories attached to an article.

There are modifier arguments for the create-data command:
````
yarn create-data --article:amount=100 --article:atOnce=10
````
The `article:amount` defines how much articles will be generated - default is 100.

The `article:atOnce` defines how much articles will be created at once (how many mutations will be sent at once) - default is 10.



