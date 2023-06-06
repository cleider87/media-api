resource "aws_dynamodb_table" "ddb-media-tasks" {
  name         = "ddb-media-api-tasks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "ddb-media-images" {
  name         = "ddb-media-api-images"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  attribute {
    name = "id"
    type = "S"
  }
}