# newmoc

Newmoc is a collection of code snippets for a mocha project.
It is designed to simplify the creation of test scenarios for API testing by providing reusable blocks of code

Tutorial:
1. In a functions file, write `!TestTemplate` and hit enter to generate the class. 
Purpose of this snippet is to provide class methods to be used by each newmoc test data object in order the send the requests

2. For each endpoint, have a test data file. Write `!newmoc` + enter to generate the test data template.
Make sure to import in this file the test template from the previous step.

Purpose of the snippet is to structure an endpoint's test data in a standardized way, that allowes the test template class methods to iterate over the test scenarios.
Fill the test data template as in the example below:
```javascript
export default (async ()=> new TestTemplate({
    suiteName: 'Delete order endpoints tests',
    method: 'delete',       //lowercase method name
    url: `${env.petStore}`,     //base url for the endpoint
    api: (urlParameters) => `${orderEndpoints.order}/${urlParameters.orderId}`,     //endpoint path as function so url parameters can be passed directly
    scenarios: [
        {
            testName: 'Delete order - success',
            status: 200,
            urlParameters: {
                orderId: await (async ()=>{         //value for order id is extracted from the request to add an order
                    let testData  = await addOrder;
                    let res = await testData.returnResponse();    
                    return res.body.id;
                })()
            },
            queryParameters: {},
            body: {},
            formData: {},
            file: {
                fieldName: '',          //name of the form data field that receives the file (i.e: 'name')
                fieldNameValue: '',     //value of the field name (i.e: 'file')
                filePath: ''            //path to the file
            },
            headers: getHeadersWithAuthToken(),     //header is updated with auth token in an external function
            jsonSchema: {}                          //can be left empty if json scema is not available
        }                                           //add more scenarios according to needs
    ]
}))()
```

3. In a spec file that is running the tests, write `!runAll` + enter to generate a test suite for a given test data. 
Make sure to import in this file the test data object from the previous step.

Purpose of the snippet is to execute the runScenario method from the TestTemplate over each test scenario from the newmoc test data
Usage example:
```javascript
describe('Await for promises - deleteOrder', function () {
    it('Updating data', async function () {
        let testData  = await deleteOrder;                                          //deleteOrder test object is imported from the previous file
        describe(`${testData.object.suiteName}`, ()=> {
            testData.object.scenarios.slice(0,).forEach(function (testScenario){    //iterates over the test scenarios. To run fewer scenarios, slice the array accordingly
                testData.runScenario(testScenario, false);                          //pass string 'res.body' instead of "false" to log the response body of the request
           })
        })
    })
})
```

4. In case a specific scenario needs to be executed independently, write in the spec file `!returnResponse` + enter to generate a self invoking function that returns the response of a particular scenario from the test data template. By default it runs the first scenarion in the test data object, but any scenarios can be run by passing the scenario index in the method call `await testData.returnResponse(testData.object.Scenarios[x])`.

Purpose of the snippet is to provide a quick and easy way to get the response of a request defined in a newmoc test data object. This allows an easy chaining of the requests into integration api testing suite.
Usage example:

```javascript
await (async ()=>{
    let testData  = await deleteOrder;              //deleteOrder test object is imported from the previous file
    let res = await testData.returnResponse();      //returns the response of the request.
    return res;
})()
```

A demo project can be found [here](https://github.com/micufloreaionut/API-testing-demo).
