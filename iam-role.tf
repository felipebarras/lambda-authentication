# Role para o Lambda
resource "aws_iam_role" "lambda_exec_role" {
  name = "lambda_exec_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action    = "sts:AssumeRole",
        Effect    = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# Política para API Gateway
resource "aws_iam_policy" "api_gateway_policy" {
  name        = "API_Gateway_Policy"
  description = "Permissões para gerenciar API Gateway"
  policy      = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid      = "Statement1",
        Effect   = "Allow",
        Action   = [
          "apigateway:POST",
          "apigateway:GET",
          "apigateway:PUT",
          "apigateway:DELETE"
        ],
        Resource = "*"
      }
    ]
  })
}

# Política para IAM
resource "aws_iam_policy" "iam_policy" {
  name        = "IAM_Policy"
  description = "Permissões para gerenciar IAM"
  policy      = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = [
          "iam:GetPolicy,
          "iam:CreatePolicy",
          "iam:CreateRole",
          "iam:GetRole",
          "iam:ListRoles",
          "iam:ListRolePolicies",
          "iam:ListAttachedRolePolicies",
          "iam:ListEntitiesForPolicy",
          "iam:AttachRolePolicy",
          "iam:PutRolePolicy",
          "iam:PassRole",
          "iam:DetachRolePolicy",
          "iam:ListInstanceProfilesForRole",
          "iam:DeleteRole"
        ],
        Resource = "*"
      }
    ]
  })
}

# Política para Lambda e Logs
resource "aws_iam_policy" "lambda_policy" {
  name        = "Lambda_Logs_Policy"
  description = "Permissões para Lambda e CloudWatch Logs"
  policy      = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = [
          "lambda:GetPolicy",
          "lambda:GetFunction",
          "lambda:ListVersionsByFunction",
          "lambda:GetFunctionCodeSigningConfig",
          "lambda:AddPermission",
          "lambda:CreateFunction",
          "lambda:UpdateFunctionCode",
          "lambda:InvokeFunction",
          "lambda:DeleteFunction",
          "lambda:RemovePermission",
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Resource = "*"
      }
    ]
  })
}

# Anexando políticas à role
resource "aws_iam_policy_attachment" "api_gateway_attachment" {
  name       = "api_gateway_attachment"
  roles      = [aws_iam_role.lambda_exec_role.name]
  policy_arn = aws_iam_policy.api_gateway_policy.arn
}

resource "aws_iam_policy_attachment" "iam_attachment" {
  name       = "iam_attachment"
  roles      = [aws_iam_role.lambda_exec_role.name]
  policy_arn = aws_iam_policy.iam_policy.arn
}

resource "aws_iam_policy_attachment" "lambda_attachment" {
  name       = "lambda_attachment"
  roles      = [aws_iam_role.lambda_exec_role.name]
  policy_arn = aws_iam_policy.lambda_policy.arn
}

# Anexando a política básica de execução do Lambda
resource "aws_iam_policy_attachment" "lambda_basic_execution" {
  name       = "lambda_basic_execution"
  roles      = [aws_iam_role.lambda_exec_role.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
