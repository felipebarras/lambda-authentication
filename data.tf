data "archive_file" "findByCPF_zip" {
  type        = "zip"
  source_file = "${path.module}/src/services/authorizers/findByCPF.js"
  output_path = "${path.module}/findByCPF.zip"
}