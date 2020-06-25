import os

campaign_arn = os.environ['campaign_arn']


def handler(event, context):
    return campaign_arn