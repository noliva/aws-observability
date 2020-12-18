# Setup

- Create a DynamoDB table
- Start the collector
- Start and try the application
- Delete the DynamoDB table

### Create a DynamoDB table

First of all you will need to have valid credentials to access AWS and the appropriate permissions for DynamoDB and X-Ray.

You can create an example DynamoDB with the following command
> ./scripts/dynamodb_setup.sh

That will create a table named `example-dynamodb-table` in your account.

### Start the collector

For this part we are going to use docker.

Before starting the collector you will need to create a file named `.env` in your root project containing the following values

```
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_KEY
```

Once you have your `.env` file created with the credentials, you can start the collector with this command:

> docker-compose up

That will start the collector where we are going to send traces from our application.

### Start and try the application

Once you have the database created and the collector running, you can start the application with:

> npm start

To test that everything is working you can send a request like:

> curl -X POST http://localhost:8000/test/foo

You should be able to now go into the X-Ray console and see the traces.

### Delete the DynamoDB table

Once you have finished with the example, you can delete the DynamoDB table using the script

> ./scripts/dynamodb_cleanup.sh
