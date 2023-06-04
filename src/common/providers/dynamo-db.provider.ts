import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  PutCommand,
  DynamoDBDocumentClient,
  UpdateCommand,
  QueryCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { Schema } from '../interfaces/schema';

@Injectable()
export class DynamoDBProvider {
  private readonly dynamo: DynamoDBDocumentClient;

  constructor(private configService: ConfigService) {
    const client = new DynamoDBClient({
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
        secretAccessKey: this.configService.get('AWS_SECRET_KEY'),
      },
      region: this.configService.get('AWS_REGION'),
    });
    this.dynamo = DynamoDBDocumentClient.from(client);
  }

  async create(tableName: string, item: Schema): Promise<any> {
    try {
      const command = new PutCommand({
        TableName: tableName,
        Item: item
      });
      return await this.dynamo.send(command);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async update(
    tableName: string,
    key: Record<string, any>,
    updateExpresion: string,
    values: Record<string, any>,
    expressionAttributeNames?: Record<string, any>,
  ): Promise<any> {
    try {
      const command = new UpdateCommand({
        TableName: tableName,
        Key: key,
        UpdateExpression: updateExpresion,
        ExpressionAttributeValues: values,
        ExpressionAttributeNames: expressionAttributeNames,
        ReturnValues: 'ALL_NEW',
      });
      const { Attributes: item } = await this.dynamo.send(command);
      return item;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }

  async updateById(
    tableName: string,
    id: string,
    updateExpresion: string,
    values: Record<string, any>,
    expressionAttributeNames?: Record<string, any>,
  ): Promise<any> {
    return await this.update(
      tableName,
      {
        id,
      },
      updateExpresion,
      values,
      expressionAttributeNames,
    );
  }

  async getById(tableName: string, id: string): Promise<any> {
    try {
      const command = new QueryCommand({
        TableName: tableName,
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: {
          ':id': id,
        },
        ConsistentRead: true,
      });

      return await this.dynamo.send(command);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async deleteById(tableName: string, id: string): Promise<any> {
    try {
      const command = new DeleteCommand({
        TableName: tableName,
        Key: {
          id,
        },
      });

      return await this.dynamo.send(command);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
