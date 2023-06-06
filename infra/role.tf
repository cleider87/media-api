resource "aws_iam_role" "tf_ecs_role" {
  name = "${var.prefix}-ecs-role"

  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
POLICY
}

resource "aws_iam_role_policy_attachment" "tf_ecs_policy_attachment" {
  role = aws_iam_role.tf_ecs_role.name

  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy_attachment" "tf_cloudwatch_policy_attachment" {
  role = aws_iam_role.tf_ecs_role.name

  policy_arn = "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
}