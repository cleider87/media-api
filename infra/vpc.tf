resource "aws_vpc" "tf_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags = {
    name = "${var.app-prefix}-vpc"
  }
}

resource "aws_subnet" "tf_public_a" {
  vpc_id            = aws_vpc.tf_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "${var.aws_region}a"
  tags = {
    name = "${var.app-prefix}-sn-public-a"
  }
}

resource "aws_subnet" "tf_public_b" {
  vpc_id            = aws_vpc.tf_vpc.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "${var.aws_region}b"
  tags = {
    name = "${var.app-prefix}-sn-public-b"
  }
}

resource "aws_internet_gateway" "tf_internet_gateway" {
  vpc_id = aws_vpc.tf_vpc.id
  tags = {
    name = "${var.app-prefix}-igw"
  }
}

resource "aws_route" "tf_internet_access" {
  route_table_id         = aws_vpc.tf_vpc.main_route_table_id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.tf_internet_gateway.id
}

resource "aws_security_group" "tf_lb_sg" {
  name        = "${var.app-prefix}-sg-ecs"
  description = "Allow TLS inbound traffic on port 80 (http)"
  vpc_id      = aws_vpc.tf_vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
