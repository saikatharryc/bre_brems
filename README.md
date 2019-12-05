# bre_brems

# Requirement:
 In config change `MONGO_URL` value to valid mongo instance, 
 May be create one sandbox instance from mlab.


# Run

```shell
> npm install
> npm start
```

> Once the command executed successfully, you can see the application runnin in port `3000`
BASE_URL will be localhost:3000

# USE:

* Create Rule [which saves the rule in DB] [API: `{{BASE_URL}}/rules`]
* Get Rules [API: `{{BASE_URL}}/rules?id=<RULE ID Optional>`]
* Check Your rule against real data [API: `{{BASE_URL}}/`]
   - here `data_input` is the object you are validating
   - and either you need to pass `rule_id` incase you have already created some set of rules. or pass `rule_set` which will be an rule object.

# About Rule set:


#### allowIDs (object, array)
Provided an object containing an "id" property, then evaluates the presence of the id in the given array, checking for 1 or more entries.

#### always (object, bool)
`Always` to "always" respond with the given input.  Why?  Code consistency, mainly.

#### percentScale(object, opts)
The `object.id` is used to calculate a percentage, modified by the salt value. If the resulting, salted, number is within range, returns true; otherwise false.

```
  opts = {
    percentMin:[0-1],
    percentMax:[0-1],
    salt:[number],
    testPhase:[string]
  }
```

`testPhase` is used for logging and debugging only, and does not impact the algorithm.

`salt` is used to allow the same `id` to map to a different boolean amongst the feature flags. Thus you can have one flag with the `{ percentMin: 0, percentMax: 50, salt:0.5 }` return true, and another with `{ percentMin: 0, percentMax: 50, salt: 0.9 }` return false. Conversely you can tie together a booleans using the same salt.

#### has(test data [object], comparison data [object])
The most complex criteria mechanism, `has` will evaluate the test data (first argument) against the trait, comparator and value provided in the second argument.  If the test data has the trait and the associated value evaluates properly considering the comparison value, then true is returned.

* Requires a data object
* Requires a set of comparison data containing the following properties:
  * trait (required) - the name of a property to find on data object.  If comparison and value are omitted, the evaluation will simply verify the existence of the property on the object.
  * comparison (optional) - one of an existing set of comparison instructions :
    * equals (string, date, number, object)
    * like (string)
    * below (string, date, number, object)
    * above (string, date, number, object)
    * longer (string, date, number, object)
    * shorter (string, date, number, object)
    * older (date)
    * younger (date)
  * value (optional) - static value for comparison

If the comparison object contains only `trait` then it will evaluate the presence of the property on the data object. Comparison and value must be provided together, when one of them is provided.

**Note:** for the purpose of comparisons, "object" refers to both `object` and `array`, with the distinction being left up to the return value of the [_.isArray() method](https://lodash.com/docs#isArray).

Possible comparisons are:

##### equals
 * (`date`) - a **strict** equality check between base comparison date and check date.  If the check value is a number, then it evaluates the difference between `now()` and the comparison date to be equal to the check value, in days (e.g. "0" implies "today").
 * (`numeric`) - a **non-strict** equality check.
 * (`object`) - a **deep comparison** equality check, using the [_.isEqual()](https://lodash.com/docs#isEqual) method from `lodash-node`.
 * (`string`) - a **strict** equality check that the comparison string is identical to the check value note that this is a case-sensitive check.  See "like", below.

##### above
 * (`date`) - [alias: "longer", "older"] checks to see that the comparison date is older than the check date.  If the check value is a number, it checks to see that the comparison date is at least as old, in days, as the check value, compared to `now()` (e.g. "1" implies the date must be yesterday or older).
 * (`numeric`) - [alias: "longer"] a greater-than-or-equal-to check that the comparison number is greater than the check value.
 * (`object`) - an array or object is said to be "above" another if it fully contains the other.  That is: if the data object contains the comparison object, then the data object is above the comparison object.  If the objects are equal, the `above` comparison is inherently false.  If the data object is a non-array object but the comparison object is an array, then the [_.difference()](https://lodash.com/docs#difference) comparison is done between the keys of the data object and the comparison array.  If both data and comparison objects are arrays, a lodash [_.difference()](https://lodash.com/docs#difference) between comparison and data is compare with `[]`, indicating that the data object fully contains the comparison object.
 * (`string`) - performs a javascript string "greater-than-or-equal" comparison.  As a loosely-typed language, this could be anything, really.

##### below
 * (`date`) - [alias: "shorter", "younger"] checks to see that the comparison date is more recent than the check date.  If the check value is a number, it checks to see that the comparison date is at least as new, in days, as the check value, compared to `now()` (e.g. "1" implies the date must be tomorrow or younger).
 * (`numeric`) - [alias: "shorter"] a less-than-or-equal-to check that the comparison number is smaller than the check value.
 * (`object`) - an array or object is said to be "below" another if it is fully contained in the other.  That is: if the comparison object contains the data object, then the data object is below the comparison object.  If the objects are equal, the `below` comparison is inherently false.  If the data object is a non-array object but the comparison object is an array, then the [_.difference()](https://lodash.com/docs#difference) comparison is done between the keys of the data object and the comparison array.  If both data and comparison objects are arrays, a lodash [_.difference()](https://lodash.com/docs#difference) between comparison and data is compare with `[]`, indicating that the data object fully contains the comparison object.
 * (`string`) - performs a javascript string "less-than-or-equal" comparison.  As a loosely-typed language, this could be anything, really.

##### like
 * (`string`) - a **non-strict** check that the `toLowerCase()` comparison string is equal to the `toString().toLowerCase()` check value.

##### longer
 * (`object`) - true if the [_.size()](https://lodash.com/docs#size) of the data object is greater than that of the comparison object.
 * (`string`) - true if the length of the comparison string (non-trimmed) is greater than or equal to the length of the check value (non-trimmed).

##### shorter
 * (`object`) - true if the [_.size()](https://lodash.com/docs#size) of the data object is less than that of the comparison object.
 * (`string`) - true if the length of the comparison string (non-trimmed) is less than or equal to the length of the check value (non-trimmed).

#### is (object (source), object (options))
Tests if a key from a source object has property of a noted __type__.
##### Options
 * (`trait`) - JSON notation path reference for a key, presumed to exist in source data.  Checks source data using lodash [_.get()](https://lodash.com/docs/#get), and follows dot-path rules.
 * (`type`) - string representing potential data type. String case is adjusted in the `is` method, but value must be one of:
   * array
   * boolean
   * date (**NOTE:** a value like `Tue Feb 28 2017 20:42:48 GMT-0800 (PST)` is a _string_ type and not _date_.)
   * empty
   * finite
   * function
   * integer
   * NaN
   * nil
   * null
   * number
   * object
   * regex \| regular_expression \| regexp
   * string
   * undefined
### Features
Features contain sets of criteria to test users against. The value associated with the criteria is passed in as the data argument of the criteria function. A user will have a featured enabled if they match all listed criteria, otherwise the feature is disabled. Features can include other optional properties for context. Features are described as follows:
```javascript
var ExampleFeaturesObject = {
  "canCheckAlways": {
    "criteria": [
      {
        "always": false
      }
    ]
  },
  "canCheckHasString": {
    "criteria": [
      {
        "has": {
          "trait": "hasStringValue",
          "comparison": "equals",
          "value": "a string check value"
        }
      }
    ]
  },
  "canCheckType": {
    "criteria": [
      {
        "is": {
          "trait": "myData.nested.key",
          "type": "number"
        }
      }
    ]
  },
  "canCheckHigherNumber": {
    "criteria": [
      {
        "has": {
          "trait": "hasNumberValue",
          "comparison": "above",
          "value": 1
        }
      }
    ]
  },
  "canCheckLowerDate": {
    "criteria": [
      {
        "has": {
          "trait": "hasDateValue",
          "comparison": "younger",
          "value": new Date(2000, 1, 1, 1, 22, 0)
        }
      }
    ]
  }
}
```