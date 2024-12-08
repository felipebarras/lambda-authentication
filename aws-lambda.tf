resource "aws_lambda_function" "find_by_cpf" {
  filename         = data.archive_file.findByCPF_zip.output_path
  function_name    = "node-js-lambda-authorizer"
  role             = aws_iam_role.lambda_exec_role.arn
  handler          = "findByCPF.handler"
  runtime          = "nodejs18.x"

  environment {
    variables = {
      eks_find_by_cpf_endpoint = var.eks_find_by_cpf_endpoint
    }
  }

  source_code_hash = data.archive_file.findByCPF_zip.output_base64sha256
}

resource "aws_lambda_permission" "allow_api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.find_by_cpf.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api_gateway.execution_arn}/*/*"
}
