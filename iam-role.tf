# # Role para o Lambda
# resource "aws_iam_role" "lambda_exec_role" {
#   name = "lambda_exec_role"
#   assume_role_policy = jsonencode({
#     Version = "2012-10-17",
#     Statement = [
#       {
#         Action    = "sts:AssumeRole",
#         Effect    = "Allow",
#         Principal = {
#           Service = "lambda.amazonaws.com"
#         }
#       }
#     ]
#   })
# }

# resource "aws_iam_policy_attachment" "lambda_basic_execution" {
#   name       = "lambda_basic_execution"
#   roles      = [aws_iam_role.lambda_exec_role.name]
#   policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
# }