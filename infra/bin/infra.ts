#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ApiGatewayStack } from '../lib/api-gateway-stack';
import { LambdaStack } from '../lib/lambda-stack';

const app = new cdk.App();
const lambdaStack = new LambdaStack(app, `LambdaStack`);
const apiGatewayStack = new ApiGatewayStack(app, `ApiGatewayStack`, {
  alias: lambdaStack.alias,
});
apiGatewayStack.addDependency(lambdaStack);