# Cluster
resource "aws_ecs_cluster" "tf_backend_cluster" {
  name = "${var.app-prefix}-backend-cluster"
}

# Tasks definition
resource "aws_ecs_task_definition" "tf_backend_task" {
  family                   = "${var.app-prefix}-backend-family"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  memory                   = "512"
  cpu                      = "256"

  execution_role_arn = aws_iam_role.tf_ecs_role.arn

  container_definitions = jsonencode(
    [
      {
        name : "${var.app-prefix}-backend",
        image : "${var.backend-image}:latest",
        memory : 512,
        essential : true,
        networkMode : "awsvpc",
        portMappings : [
          {
            containerPort : 3000,
            hostPort : 3000
          }
        ],
        environment : [
          {
            name : "NODE_ENV",
            value : "development"
          },
          {
            name : "PORT",
            value : "3000"
          },
          {
            name : "AWS_ACCESS_KEY",
            value : "${var.aws_access_key}"
          },
          {
            name : "AWS_SECRET_KEY",
            value : "${var.aws_secret_key}"
          },
          {
            name : "AWS_REGION",
            value : "${var.aws_region}"
          },
          {
            name : "AWS_BUCKET",
            value : "${var.bucket_name}"
          }
        ],
        logConfiguration : {
          logDriver : "awslogs",
          options : {
            "awslogs-create-group" : "true",
            "awslogs-group" : "${var.app-prefix}-backend-api",
            "awslogs-region" : "${var.aws_region}",
            "awslogs-stream-prefix" : "ecs"
          }
        }
      }
  ])
}

# ECS Service

resource "aws_security_group" "tf_backend_sg" {
  name        = "${var.app-prefix}-backend_sg"
  description = "allow inbound access from the ALB only"
  vpc_id      = aws_vpc.tf_vpc.id

  ingress {
    protocol        = "tcp"
    from_port       = "3000"
    to_port         = "3000"
    self = true
  }

  ingress {
    protocol  = -1
    from_port = 0
    to_port   = 0
    self      = true
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}


resource "aws_ecs_service" "tf_backend_service" {
  name = "${var.app-prefix}-backend-service"

  cluster         = aws_ecs_cluster.tf_backend_cluster.id
  task_definition = aws_ecs_task_definition.tf_backend_task.arn

  launch_type   = "FARGATE"
  desired_count = 1

  load_balancer {
    target_group_arn = aws_alb_target_group.tf_backend_tg.id
    container_name   = "${var.app-prefix}-backend"
    container_port   = 3000
  }

  network_configuration {
    subnets          = ["${aws_subnet.tf_public_a.id}", "${aws_subnet.tf_public_b.id}"]
    security_groups  = ["${aws_security_group.tf_backend_sg.id}"]
    assign_public_ip = true
  }
}

resource "aws_alb_target_group" "tf_backend_tg" {
  name        = "${var.app-prefix}-alb-tg-backend"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.tf_vpc.id
  target_type = "ip"
}

resource "aws_lb_listener" "tf_tg_listener" {
  load_balancer_arn = aws_lb.tf_backend_alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    target_group_arn = aws_alb_target_group.tf_backend_tg.arn
    type             = "forward"
  }
}

resource "aws_lb" "tf_backend_alb" {
  load_balancer_type = "application"
  subnets            = [aws_subnet.tf_public_a.id, aws_subnet.tf_public_b.id]
  security_groups    = ["${aws_security_group.tf_sg_media.id}"]
}
