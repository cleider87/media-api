resource "aws_ecs_task_definition" "tf_backend_task" {
    family = "${var.app-prefix}-backend-family"
    requires_compatibilities = ["FARGATE"]
    network_mode = "awsvpc"
    memory = "512"
    cpu = "256"

    execution_role_arn = "${aws_iam_role.tf_ecs_role.arn}"

    container_definitions = <<EOT
[
    {
        "name": "${var.app-prefix}-backend",
        "image": "${var.backend-image}:latest",
        "memory": 512,
        "essential": true,
        "portMappings": [
            {
                "containerPort": 3000,
                "hostPort": 3000
            }
        ]
    }
]
EOT
}

resource "aws_ecs_cluster" "tf_backend_cluster" {
    name = "${var.app-prefix}-backend-cluster"
}

resource "aws_ecs_service" "tf_backend_service" {
    name = "${var.app-prefix}-backend-service"

    cluster = "${aws_ecs_cluster.tf_backend_cluster.id}"
    task_definition = "${aws_ecs_task_definition.tf_backend_task.arn}"

    launch_type = "FARGATE"
    desired_count = 1

    network_configuration {
        subnets = ["${aws_subnet.tf_public_a.id}", "${aws_subnet.tf_public_b.id}"]
        security_groups = ["${aws_security_group.tf_sg_media.id}"]
        assign_public_ip = true
    }
}
