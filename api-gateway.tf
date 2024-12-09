resource "aws_apigatewayv2_api" "api_gateway" {
  name          = "gw_lanchonete_fiap"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id                  = aws_apigatewayv2_api.api_gateway.id
  integration_type        = "AWS_PROXY"
  integration_uri         = aws_lambda_function.node_js_lambda_authorizer.invoke_arn
  payload_format_version  = "2.0"
}

resource "aws_apigatewayv2_route" "default_route" {
  api_id    = aws_apigatewayv2_api.api_gateway.id
  route_key = "ANY /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_apigatewayv2_stage" "default_stage" {
  api_id      = aws_apigatewayv2_api.api_gateway.id
  name        = "$default"
  auto_deploy = true
}
