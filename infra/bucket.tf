# S3 bucket
resource "aws_s3_bucket" "tf_s3_bucket" {
  bucket = var.bucket_name
}

resource "aws_s3_bucket_ownership_controls" "tf_s3_bucket" {
  bucket = aws_s3_bucket.tf_s3_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "tf_s3_bucket" {
  bucket                  = aws_s3_bucket.tf_s3_bucket.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "tf_s3_bucket" {
  depends_on = [
    aws_s3_bucket_ownership_controls.tf_s3_bucket,
    aws_s3_bucket_public_access_block.tf_s3_bucket,
  ]

  bucket = aws_s3_bucket.tf_s3_bucket.id
  acl    = "public-read"
}

resource "aws_s3_bucket_notification" "tf_s3_bucket" {
  bucket = aws_s3_bucket.tf_s3_bucket.id

  lambda_function {
    lambda_function_arn = aws_lambda_function.tf_s3_lambda_resize.arn
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = "upload/"
  }
}
