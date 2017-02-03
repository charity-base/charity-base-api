# charity-base/api
- [Running] (#running)
- [Endpoint] (#endpoint)
- [Counting Results] (#counting-results)
- [Pagination] (#pagination)
- [Filter Parameters] (#filter-parameters)
- [Projection Parameters] (#projection-parameters)
- [Sorting Parameters] (#sorting-parameters)

## Running
Once you've built the charity-base database - as described in [charity-base/data] (https://github.com/tithebarn/charity-base/tree/master/data) - running the API is easy. Assuming you're in the charity-base directory:
```bash
$ cd api
$ node server.js
```
Now visit `http://localhost:3000` - you should see it running.

## Endpoint
The API has one endpoint - `GET /api/v0.2.0/charities/` - which returns charity documents from the database. Options are specified in the URL query string and there is no user authentication.

For example, calling the endpoint with no options in the query string will return the following response.
```javascript
{
  "version": "v0.2.0",
  "totalMatches": null,
  "pageSize": 10,
  "pageNumber": 1,
  "query": {
    "filter": {},
    "projection": {...},
    "sort": {...},
    "skip": 0,
    "limit": 10
  },
  "charities": [{
    ...
  }]
}
```
The `charities` value is an array of up to 10 JSON objects from the database.

## Counting Results
By default the value of `totalMatches` in the response is `null` because counting the total number matches for some queries is slow.  However you can explicitly request the value by including `countResults` in the query string:
```bash
GET /api/v0.2.0/charities/?countResults
```

## Pagination
By default the number of charities returned from each request is limited to `10`.  This can be changed with the `limit` query parameter whose value is capped at `50`.

If the value of `totalMatches` in the response is greater than 10 (when `countResults` included in query) you can page through the results by specifying `skip` in the query string (`skip` can take any value but use multiples of `limit` to get sequential pages).

For example, to return the third page of results with 30 charities per request:
```bash
GET /api/v0.2.0/charities/?limit=30&skip=60
```

## Filter Parameters
The fields `charityNumber`, `subNumber`, `registered` and `mainCharity.income` (defined in the schema `charity-base/models/charity.js`) can be specified in the query string to filter results.  The package `api-query-params` is used to translate these query string parameters to a database query, supporting a wide range of [filter options] (https://github.com/loris/api-query-params#supported-features).

For example:
* Request registered, main (non-subsidiary) charities with no reported income:

    ```bash
    GET /api/v0.2.0/charities/?registered=true&subNumber=0&!mainCharity.income
    ```

* Request & count de-registered, subsidiary charities of The Royal Society (the answer is 94)

    ```bash
    GET /api/v0.2.0/charities?countResults&registered=false&charityNumber=207043&subNumber>0
    ```

* Request registered, main charities with non-zero gross income less than (or equal) £17k

    ```bash
    GET /api/v0.2.0/charities?registered=true&subNumber=0&mainCharity.income>0&mainCharity.income<=17000
    ```

In addition to filtering by the fields above, there is another filter parameter `search` which performs a text search over all working names of each charity (accepts `=` operator only).  For example, to find registered charities with "London" and "NHS" in one of their working names:
```bash
GET /api/v0.2.0/charities/?registered=true&search=nhs+london
```

## Projection Parameters
Returned charity objects always have the following properties: `charityNumber`, `subNumber`, `name` and `registered`.  All other fields defined in the schema `charity-base/models/charity.js` can be requested using the query parameter `fields`, which expects a comma-separated list of fields.

For example, to return the gross income, registration history and number of volunteers of each registered, main charity:
```bash
GET /api/v0.2.0/charities/?registered=true&subNumber=0&fields=mainCharity.income,registration,beta.people.volunteers
```

Note: if the `search` filter parameter is used, the `score` of the text-matching will also be returned with each charity.

## Sorting Parameters
Unless the `search` parameter is used, results are by default returned in order of ascending `charityNumber` and then `subNumber`.  If `search` is used they are returned in order of descending `score` (i.e. most relevant first).

This behaviour can be overridden using the query parameter `sort`, which expects a comma-separated list of fields.  It is recommended to only sort by fields which have an index defined in `charity-base/models/charity.js`.  Fields in the list may be prefixed with `-` to sort in descending order.  For example, to find charities in descending order of gross income (and to project the income):
```bash
GET /api/v0.2.0/charities/?sort=-mainCharity.income&fields=mainCharity.income
```
