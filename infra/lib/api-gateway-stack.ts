import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as apigw from '@aws-cdk/aws-apigateway';
import * as lambda from '@aws-cdk/aws-lambda';

interface Props extends cdk.StackProps {
  alias: lambda.Alias;
}

export class ApiGatewayStack extends cdk.Stack {
  public readonly api: apigw.RestApi;

  constructor(scope: cdk.Construct, id: string, props: Props) {
    super(scope, id, props);

    const ns = scope.node.tryGetContext('ns') || '';

    this.api = new apigw.RestApi(this, `${ns}RestApi`, {
      deploy: true,
      deployOptions: {
        stageName: 'dev',
        metricsEnabled: true,
        loggingLevel: apigw.MethodLoggingLevel.ERROR,
        variables: {
          lambdaAlias: props.alias.aliasName,
        }
      },
      endpointConfiguration: {
        types: [apigw.EndpointType.REGIONAL],
      },
    });
    this.api.root.addMethod('ANY');

    const credentialsRole = new iam.Role(this, `${ns}ApigwCredentialRole`, {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
      managedPolicies: [
        { managedPolicyArn: 'arn:aws:iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs' },
        { managedPolicyArn: 'arn:aws:iam::aws:policy/AWSLambdaFullAccess' },
      ]
    });

    const resourceOptions: apigw.MethodOptions = {
      methodResponses: [
        {
          statusCode: '200',
          responseModels: {
            'application/json': apigw.Model.EMPTY_MODEL,
          },
        }
      ],
    };

    this.api.root.addMethod('GET', new apigw.LambdaIntegration(props.alias, {
      proxy: false,
      credentialsRole,
      passthroughBehavior: apigw.PassthroughBehavior.NEVER,
      requestTemplates: {
        'application/json': `$input.json('$')`,
      },
      integrationResponses: [
        { statusCode: '200' }
      ],
    }), resourceOptions);
 
  }

}