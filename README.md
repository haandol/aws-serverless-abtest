# A/B Testing with API Gateway and Lambda

This repository is about provisioning resources on AWS for A/B testing

**Running this repository may cost you to provision AWS resources**

# Prerequisites

- awscli
- Nodejs 12.16+
- Python 3.7+
- AWS Account and Locally configured AWS credential

# Installation

Install project dependencies

```bash
$ cd infra
$ npm i
```

Install cdk in global context and run `cdk init` if you did not initailize cdk yet.

```bash
$ npm i -g cdk
$ cdk init
$ cdk bootstrap
```

Deploy CDK Stacks on AWS

```bash
$ cdk deploy "*" --require-approval never
```