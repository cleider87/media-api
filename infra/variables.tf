variable "app-prefix" {
  description = "Media API Prefix"
  default     = "tf-media-api"
}

variable "aws_region" {
  description = "AWS region"
  default     = "us-east-1"
}

variable "bucket_name" {
  description = "Media API S3 bucket"
  default     = "media-api-static-resources"
}