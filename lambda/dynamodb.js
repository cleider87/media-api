const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({
  region: process.env.REGION,
});

const create = async (tableName, item) => {
  await docClient
    .put({
      TableName: tableName,
      Item: item,
    })
    .promise();
};

const updateById = async (
  tableName,
  id,
  updateExpresion,
  values,
  expressionAttributeNames = undefined,
) => {
  await docClient
    .update({
      TableName: tableName,
      Key: { id },
      UpdateExpression: updateExpresion,
      ExpressionAttributeValues: values,
      ExpressionAttributeNames: expressionAttributeNames,
    })
    .promise();
};

module.exports = {
  create,
  updateById,
};
