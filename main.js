'use strict';

const tracer = require('./trace')('example-service', 'localhost:55680');
const express = require('express');
const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const createError = require('http-errors')
const app = express();

let tableName = 'example-dynamodb-table';
let client = null;
const initDB = () => {
  client = new DynamoDB({
    region: 'eu-west-1',
  });
}

initDB();

app.post('/test/:id', async (req, res, next) => {
  let obj = {};
  try {
    obj = {id: req.params.id};

    const params = {
      TableName: tableName,
      Item: marshall(obj)
    }

    await client.putItem(params);
  } catch (err) {
    tracer.getCurrentSpan().setStatus({
      code: 500,
      message: err
    });
    console.log('Error ' + err);
    next(createError(500, err));
  }

  res.status(200).json(obj);
});

if (!module.parent) {
  app.listen(8000);
  console.log('Express started on port 8000');
}
