variable "stage" {
  description = "Environment"
  default     = "dev"
}

variable "tags" {
  default = {
    Environment = "dev"
    Project     = "tf-media"
  }
}

variable "prefix" {
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

variable "backend-image" {
  description = "Media API Backend Image"
  default     = "cleider87/media-api-backend"
}

variable "aws_access_key" {
  description = "AWS Access Key"
  default     = "localhost"
}

variable "aws_secret_key" {
  description = "AWS Secret Key"
  default     = "localhost"
}