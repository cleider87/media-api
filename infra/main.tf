# Provider configuration
provider "aws" {
  region = var.aws_region
}

# S3 bucket
resource "aws_s3_bucket" "bucket" {
  bucket = var.bucket_name
}

# CloudFront distribution
resource "aws_cloudfront_distribution" "distribution" {
  origin {
    domain_name = aws_s3_bucket.bucket.bucket_regional_domain_name
    origin_id   = aws_s3_bucket.bucket.id
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "Media API CloudFront"
  default_root_object = "index.html"

  default_cache_behavior {
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = aws_s3_bucket.bucket.id

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

# DynamoDB table
resource "aws_dynamodb_table" "ddb-media-api-tasks" {
  name         = "ddb-media-api-tasks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "ddb-media-api-images" {
  name         = "ddb-media-api-images"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  attribute {
    name = "id"
    type = "S"
  }
}
