## Useful commands to use via CLI

```bash
aws s3api create-bucket --bucket your-bucket-name
```

```bash
aws s3 sync /Path/Wallpapers s3://your-bucket-name/
```

```bash
aws s3 sync ./website s3://your-bucket-name
```

## Testing update wallpaper lambda function

```json
{
  "body": "{\"name\":\"Test Wallpaper\",\"category\":\"Nature\",\"filename\":\"test-image.jpg\",\"file\":\"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==\"}"
}
```

## Policy for the update s3 and DynamoDB table

```json
		{
			"Effect": "Allow",
			"Action": [
				"s3:PutObject"
			],
			"Resource": "arn:aws:s3:::wallpaper-gallery-demo/*"
		},
		{
			"Effect": "Allow",
			"Action": [
				"dynamodb:PutItem"
			],
			"Resource": "arn:aws:dynamodb:*:*:table/wallpaper-gallery"
		}
```

## Updating the CORS Headers for the S3 bucket In case you are not accessing it

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
