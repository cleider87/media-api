resource "aws_dynamodb_table" "ddb-media-tasks" {
  name         = "${var.app-prefix}-media-api-tasks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "ddb-media-images" {
  name         = "${var.app-prefix}-media-api-images"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  attribute {
    name = "id"
    type = "S"
  }
}