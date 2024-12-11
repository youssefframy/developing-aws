import json
import boto3
import os
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key

def lambda_handler(event, context):
    tableName = os.environ['TABLE_NAME']
    IDENTITY_POOL_ID = os.environ['IDENTITY_POOL_ID']  # Get from environment variable
    REGION = 'us-east-1'
    
    try:
        # Get credentials from Cognito Identity Pool
        cognito_identity = boto3.client('cognito-identity')
        
        # Get Identity ID from Identity Pool
        identity_response = cognito_identity.get_id(
            IdentityPoolId=IDENTITY_POOL_ID
        )
        
        # Get credentials for the Identity ID
        credentials_response = cognito_identity.get_credentials_for_identity(
            IdentityId=identity_response['IdentityId']
        )
        
        # Create DynamoDB client with temporary credentials
        dynamodb = boto3.resource(
            'dynamodb',
            aws_access_key_id=credentials_response['Credentials']['AccessKeyId'],
            aws_secret_access_key=credentials_response['Credentials']['SecretKey'],
            aws_session_token=credentials_response['Credentials']['SessionToken'],
            region_name=REGION
        )
        
        table = dynamodb.Table(tableName)
        
        # Scan the table to get all wallpapers
        response = table.scan()
        items = response['Items']
        
        # Sort items by created_at if it exists
        items.sort(key=lambda x: x.get('created_at', ''), reverse=True)
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps(items)
        }
        
    except ClientError as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps({
                'error': str(e)
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps({
                'error': str(e)
            })
        }