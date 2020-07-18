#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ApiGatewayStack } from '../lib/api-gateway-stack';
import { LambdaStack } from '../lib/lambda-stack';

const ns = 'Alpha';
const app = new cdk.App({
  context: {
    ns,
  },
});

const lambdaStack = new LambdaStack(app, `${ns}LambdaStack`);
const apiGatewayStack = new ApiGatewayStack(app, `${ns}ApiGatewayStack`, {
  alias: lambdaStack.alias,
});
apiGatewayStack.addDependency(lambdaStack);