import { Selector } from 'testcafe';   
import { MongoClient } from 'mongodb'; 

// MongoDB configuration 
const mongoUrl = 'mongodb+srv://josephbwanzj:josephwan1*@testresults.szcjd.mongodb.net/?retryWrites=true&w=majority&appName=testResults'; 
const dbName = 'app_test_results'; 
const collectionName = 'testResults'; 
 
// Function to log the main test result 
async function logTestResult(t, status, errorDetails, startTime, endTime) { 
    const client = new MongoClient(mongoUrl); 
    const testResult = { 
        testID: 8,
        testName: t.testRun.test.name, 
        status: status, // 'Passed' or 'Failed' 
        startTime: startTime, 
        endTime: endTime, 
        browser: { 
            name: t.browser.name, 
            version: t.browser.version, 
            platform: t.browser.platform 
        }, 
        errorLogs: errorDetails 
    }; 
    try { 
        // Connect to MongoDB and insert the result 
        await client.connect(); 
        const db = client.db(dbName); 
        const collection = db.collection(collectionName); 
        await collection.insertOne(testResult); 
        console.log('Test result saved to database:', testResult); 
    } catch (error) { 
        console.error('Error saving test result:', error); 
    } finally { 
        // Close the MongoDB connection 
        await client.close(); 
    } 
}  

fixture `Manager Delete Customer`   
    .page `https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login` 

test('Manager Delete Customer', async t => {   
    const bankManagerButton = Selector('button').withText('Bank Manager Login');   
    const customerButton = Selector('button').withText('Customers');
    const deleteCustomerButton = Selector('button').withText('Delete');
    const startTime = new Date();
    await t.setNativeDialogHandler(() => true);
    try {   
        await t   
            .click(bankManagerButton)
            .click(customerButton)
            .click(deleteCustomerButton);
        const endTime = new Date();
        await logTestResult(t, 'Passed', null, startTime, endTime); 

    } catch (error) {   
        console.error('Test failed:', error);  
        const endTime = new Date(); 
        const errorDetails = {
            message: error.errMsg, 
            stack: error.callsite,   
            code: error.code
        };
        await logTestResult(t, 'Failed', errorDetails, startTime, endTime); 
        throw error; 
    }   
}); 