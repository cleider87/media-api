resource "aws_iam_role" "tf_s3_lambda_resize_role" {
  name = "${var.app-prefix}-lambda-resize-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_policy" "tf_s3_lambda_resize_role" {
  name = "${var.app-prefix}-lambda-resize-role"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ]
      Resource = ["arn:aws:logs:*:*:*"]
      }, {
      Effect = "Allow"
      Action = [
        "ec2:CreateNetworkInterface",
        "ec2:DescribeNetworkInterfaces",
        "ec2:DeleteNetworkInterface"
      ]
      Resource = ["*"]
    }]
  })
}

resource "aws_iam_role_policy_attachment" "tf_s3_lambda_resize_role" {
  policy_arn = aws_iam_policy.tf_s3_lambda_resize_role.arn
  role       = aws_iam_role.tf_s3_lambda_resize_role.name
}

data "archive_file" "tf_s3_lambda_resize_file" {
  type        = "zip"
  source_file = "../lambda.zip"
  output_path = "./lamda.zip"
}

resource "aws_lambda_function" "tf_s3_lambda_resize" {
  function_name    = "${var.app-prefix}-lambda-resize"
  role             = aws_iam_role.tf_s3_lambda_resize_role.arn
  filename         = "../lambda.zip"
  source_code_hash = data.archive_file.tf_s3_lambda_resize_file.output_base64sha256
  handler          = "index.handler"
  runtime          = "nodejs16.x"

  environment {
    variables = {
      REGION = var.aws_region
    }
  }
}

resource "aws_lambda_permission" "tf_s3_allow_bucket" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.tf_s3_lambda_resize.arn
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.tf_s3_bucket.arn
}

