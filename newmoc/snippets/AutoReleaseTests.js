//imports
const apiData = require('../../../microservices/offerorchestrator/api_data/OfferOrchestratorAPIData.json');
const env = require('../../../config/env.js')[process.env.ENV];
const api = require('../../../support/helpers.js');
const authData = require('../../../microservices/authorizationAPI/api_data/authorizationAPIData.json');


async function getHeaders() {
    //get account user access token
    const formData = {
        "grant_type": "password",
        "client_id": "ldap-adapter",
        "client_secret": "Tcb6F8M5HKgMwC4V",
        "scope": "openid",
        "username": "353:pool-user-1106@thinksurance.de",
        "password": "da0c0194b8ba3d2458141515676e44d7"
    }
    const postAccountAuth = await api.postWithForm(
        env.keycloak,
        authData.api_url.accountLogin,
        formData,
        authData.commonHeaders
    )
    let accessToken = "Bearer " + await postAccountAuth.body.access_token;
    let headers = { ...apiData.commonHeaders, ...{ "Authorization": accessToken }, ...{ "X-Account-Tag": "thinksurance" } }
    return headers;
}

//object defining the scenarios
let testCases = async() => {
    return {
        suiteName: "Get all autorelease rules",
        functionName: "getAutoreleaseRules",
        method: "get",
        url: `${env.gateway}`,
        api: (urlParameters) => `${apiData.apis.autoReleaseRules}`,
        scenarios: [
            {
                testName: "Get all autorelease rules - 200",
                status: 200,
                urlParameters: {
        
                },
                queryParameters: {
        
                },
                body: {
        
                },
                formData: {
        
                },
                file: {
                    fieldName: '',
                    fieldNameValue: '',
                    filePath: ''
                },
                headers: await getHeaders(),
                jsonSchema: {
                    
                }
            },
            {
                testName: "Get all autorelease rules - 401",
                status: 401,
                urlParameters: {
        
                },
                queryParameters: {
        
                },
                body: {
        
                },
                formData: {
        
                },
                file: {
                    fieldName: '',
                    fieldNameValue: '',
                    filePath: ''
                },
                headers: apiData.commonHeaders,
                jsonSchema: {
                    
                }
            }
        ]
    };
};

const request = require('supertest');
const test = require('chai').expect;

//class defining the tests
class TestsTemplate {
    constructor(object) {
        this.object = object;
    }

    getCommand(scenario){
        let command = `request.agent("${this.object.url}").${this.object.method}("${this.object.api(scenario.urlParameters)}")`;
        switch (true){
            case Object.keys(scenario.queryParameters).length > 0:
                command += `.query(${JSON.stringify(scenario.queryParameters)})`;
            case Object.keys(scenario.body).length > 0:
                command += `.send(${JSON.stringify(scenario.body)})`;
            case Object.keys(scenario.formData).length > 0:
                command += `.type('form').send(${JSON.stringify(scenario.formData)})`;
            case scenario.file.fieldName.length > 0:
                command += `.set('content-type', 'multipart/form-data').field(${scenario.file.fieldName}, ${scenario.file.fieldNameValue}).attach(${scenario.file.fieldNameValue}, ${scenario.file.filePath})`;
            case Object.keys(scenario.headers).length > 0:
                command += `.set(${JSON.stringify(scenario.headers)})`;
        }
        command += `.then(function (res) { return res;}).catch(function (err) {console.error(err.message); return Promise.reject(err);});`
        return(command);
    }

    runScenario(scenario) {
        it(`${scenario.testName}`, async ()=> {
            let res = await eval(this.getCommand(scenario));
            test(await res.statusCode).to.equal(scenario.status);
            if (Object.keys(scenario.jsonSchema).length > 0){
                //set json schema validation
                console.log("test")
            }
        })
    }

    async exportPositiveScenario(scenario = this.object.scenarios[0]) {
        let res = await eval(this.getCommand(scenario));
        return res;
    }
}

describe("Await for promises", function () {
    it("Updating data", async function () {
        testCases  = await testCases();
        let tests =  new TestsTemplate(testCases);
        describe(`${tests.object.suiteName}`, function () {
            tests.object.scenarios.forEach(function (testScenario){
                tests.runScenario(testScenario);    
            })
        })
    })
})

module.export = {
    async function() {
        testCases  = await testCases();
        let tests =  new TestsTemplate(testCases);
        let req = await tests.exportPositiveScenario();
        return req;
    }
};