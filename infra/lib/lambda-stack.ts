import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';

export class LambdaStack extends cdk.Stack {
  public readonly alias: lambda.Alias;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaExecutionRole = new iam.Role(this, 'LambdaExecutionRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        { managedPolicyArn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole' },
      ],
    });

    const helloFunction = new lambda.Function(this, 'HelloFunction', {
      runtime: lambda.Runtime.PYTHON_3_7,
      code: lambda.Code.fromAsset(path.resolve(__dirname, './functions')),
      handler: 'hello.handler',
      role: lambdaExecutionRole,
      environment: {
        'campaign_arn': 'v1_campaign_arn'
      },
    });
    const version = helloFunction.addVersion('V1');

    this.alias = new lambda.Alias(this, 'Alias', {
      aliasName: 'live',
      version,
    });
 }

}