# charity-base/api
- [Running] (#running)
- [Endpoint] (#endpoint)
- [Pagination] (#pagination)
- [Filter Parameters] (#filter-parameters)
- [Projection Parameters] (#projection-parameters)

## Running
Once you've built the charity-base database - as described in [charity-base/data] (https://github.com/tithebarn/charity-base/tree/master/data) - running the API is easy. Assuming you're in the charity-base directory:
```bash
$ cd api
$ node server.js
```
Now visit `http://localhost:3000` - you should see it running.

## Endpoint
The API has one endpoint - `GET /api/v1/charities/` - which returns charity documents from the database. Options are specified in the URL query string and there is no user authentication.

For example, calling the endpoint with no options in the query string will return the following response.
```javascript
{
  "version": "v1",
  "totalMatches": null,
  "pageSize": 10,
  "pageNumber": 1,
  "request": {
    "query": {}
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
GET /api/v1/charities/?countResults
```

## Pagination
The number of charities returned is limited to 10. If the value of `totalMatches` in the response is greater than 10 (when `countResults` included in query) you can page through the results by specifying `l_pageNumber` in the query string. For example, to get the 2nd page of results:
```bash
GET /api/v1/charities/?l_pageNumber=2
```
When `l_pageNumber` is unspecified, the default page number is 1.

## Filter Parameters
Results can be filtered by specifying filter parameters in the query string. There are six accepted filter parameters, all starting with `f_`:

* Subsidiary number can be specified using `f_subNumber`, which is zero for main charities.  Some main charities have hundreds of subsidiaries which are each numbered, starting from 1.  For example, to request only main charities:
    ```bash
    GET /api/v1/charities/?f_subNumber=0
    ```

* Charity registration number can be specified with `f_charityNumber`.  For example to request the 99th subsidiary of The Royal Society:
    ```bash
    GET /api/v1/charities/?f_charityNumber=207043&f_subNumber=99
    ```

* The database contains registered charities as well as those which used to be registered but are no longer.  By default, both are returned.  You can request only registered or only de-registered using the boolean query parameter `f_registered`.  For example, to request main charities which are still registered:
    ```bash
    GET /api/v1/charities/?f_subNumber=0&f_registered=true
    ```

* Search for charities by name using `f_searchTerm`.  The value will be split into words and only charities matching all words will be returned.  MongoDB's text search rules apply.  By default the text index specified in `charity-base/models/charity.js` is on the `otherNames.name` field which covers all given names for each charity.  For example, to find registered charities with "London" and "NHS" in one of their working names:
    ```bash
    GET /api/v1/charities/?f_registered=true&f_searchTerm=nhs+london
    ```

* Filter the results by gross income using the inclusive lower limit `f_$gte_income` and exclusive upper limit `f_$lt_income` parameters.  The vast majory of main (non-subsidiary) registered charities have income information in the database.  Exceptions include recently registered charities which have not yet reported their income.  No subsidiary charities, and almost no de-registered charities have income information.  To request main, registered charities with gross income between £0 and £17k:
    ```bash
    GET /api/v1/charities/?f_subNumber=0&f_registered=true&f_$gte_income=0&f_$lt_income=17000
    ```

## Projection Parameters
Returned charity objects always have the following properties: `charityNumber`, `subNumber`, `name` and `registered`.  Respectively, these provide the registration number, subsidiary number (0 for non-subsidiary charities), official name and whether or not the charity is still registered.

All other top-level fields defined in the schema `charity-base/models/charity.js` can be requested by specifying `p_fieldName=true` in the URL query string, where `fieldName` should be replaced accordingly.  For example, to return the basic financial information with each charity:
```bash
GET /api/v1/charities/?p_financial=true
```
