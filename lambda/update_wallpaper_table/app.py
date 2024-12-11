import json
import boto3
import base64
import uuid
from datetime import datetime

def lambda_handler(event, context):
    # Initialize AWS services
    s3 = boto3.client('s3')
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('wallpaper-gallery')
    
    try:
        # Parse the request body
        body = json.loads(event['body'])
        name = body['name']
        category = body['category']
        file_content = base64.b64decode(body['file'])
        
        # Generate unique filename
        file_extension = body['filename'].split('.')[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        
        # Upload to S3
        bucket_name = 'wallpaper-gallery-demo'
        s3.put_object(
            Bucket=bucket_name,
            Key=unique_filename,
            Body=file_content,
            ContentType=f'image/{file_extension}'
        )
        
        # Get the URL of the uploaded image
        url = f"https://{bucket_name}.s3.amazonaws.com/{unique_filename}"
        
        # Store metadata in DynamoDB
        table.put_item(Item={
            'id': str(uuid.uuid4()),
            'name': name,
            'category': category,
            'url': url,
            'created_at': datetime.now().isoformat()
        })
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'message': 'Upload successful',
                'url': url
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': str(e)
            })
        } 