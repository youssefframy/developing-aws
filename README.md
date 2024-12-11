# Wallpaper Gallery Project

A serverless application for managing and displaying wallpapers using AWS services (Lambda, S3, DynamoDB, and API Gateway).

## Project Structure

```
your-project/
├── template.yaml
├── lambda/
│   ├── list_function/
│   │   └── app.py
│   └── update_wallpaper_table/
│       └── app.py
├── website/
    ├── index.html
    ├── list.html
    ├── upload.html
    ├── styles.css
    ├── list.js
    └── upload.js
```

## Deployment Guide

### Prerequisites

- AWS CLI installed and configured
- SAM CLI installed
- Appropriate AWS permissions for S3, DynamoDB, and Lambda
- Replace the existing bucket names in the `template.yaml` file with your own `unique` bucket names

### Deployment Steps

1. **Build and Deploy using SAM CLI**

   ```bash
   # Build the SAM application
   sam build

   # Deploy the application
   sam deploy --guided
   ```

2. **Update API Endpoints**

   - Update endpoints in `list.js` (lines 1-2)
   - Update endpoints in `upload.js` (lines 1-2)

3. **Deploy Website to S3**
   ```bash
   aws s3 sync ./website s3://your-bucket-name
   ```

## AWS CLI Commands Reference

### S3 Operations

```bash
# Create new S3 bucket
aws s3api create-bucket --bucket your-bucket-name

# Sync wallpapers to S3
aws s3 sync /Path/Wallpapers s3://your-bucket-name/

# Deploy website files
aws s3 sync ./website s3://your-bucket-name
```

## Testing

### Lambda Function Test Payload

```json
{
  "body": "{\"name\":\"Test Wallpaper\",\"category\":\"Nature\",\"filename\":\"test-image.jpg\",\"file\":\"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==\"}"
}
```

## Configuration Examples

### IAM Policy for S3 and DynamoDB

```json
{
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject"],
      "Resource": "arn:aws:s3:::wallpaper-gallery-demo/*"
    },
    {
      "Effect": "Allow",
      "Action": ["dynamodb:PutItem"],
      "Resource": "arn:aws:dynamodb:*:*:table/wallpaper-gallery"
    }
  ]
}
```

### S3 Bucket CORS Configuration

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD", "POST", "PUT", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": [
      "ETag",
      "x-amz-server-side-encryption",
      "x-amz-request-id",
      "x-amz-id-2"
    ],
    "MaxAgeSeconds": 3000
  }
]
```

## Important Notes

### Security

- Ensure proper IAM permissions are configured before executing Lambda functions
- Review and adjust CORS settings based on your security requirements

### API Gateway

- Enable CORS for all required methods in API Gateway
- Configure appropriate integration responses

### Lambda Configuration

- Adjust Lambda function timeout settings if timeout issues occur
- Test all functions post-deployment

## Troubleshooting

1. If experiencing access issues:

   - Verify IAM permissions
   - Check CORS configuration in S3 and API Gateway
   - Validate API endpoint URLs in frontend code

2. If experiencing timeout issues:
   - Increase Lambda function timeout in configuration
   - Optimize function code if necessary
