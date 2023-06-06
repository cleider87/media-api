resource "aws_cloudfront_distribution" "distribution" {
  origin {
    domain_name = aws_s3_bucket.tf_s3_bucket.bucket_regional_domain_name
    origin_id   = aws_s3_bucket.tf_s3_bucket.id
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "Media API CloudFront"
  default_root_object = "index.html"

  default_cache_behavior {
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = aws_s3_bucket.tf_s3_bucket.id

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  origin {
    domain_name = aws_alb.tf_backend_alb.dns_name
    origin_id   = aws_alb.tf_backend_alb.id
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  ordered_cache_behavior {
    path_pattern     = "/api/*"
    allowed_methods  = ["HEAD", "DELETE", "POST", "GET", "OPTIONS", "PUT", "PATCH"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = aws_alb.tf_backend_alb.id

    forwarded_values {
      query_string = true
      headers      = ["Origin"]

      cookies {
        forward = "all"
      }
    }

    compress               = true
    viewer_protocol_policy = "redirect-to-https"
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
