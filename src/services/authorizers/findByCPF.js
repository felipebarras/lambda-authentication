const http = require('http');
require('dotenv').config();

exports.handler = async (event) => {
  const verifyIfExistsCustomerUri = process.env.eks_find_by_cpf_endpoint;

  try {
    const cpf = event.headers?.['cpf'];
    if (!cpf) throw new Error('CPF is missing in the request headers');

    // Promisify HTTP request
    const makeHttpRequest = (url) => {
      return new Promise((resolve, reject) => {
        http
          .get(url, (response) => {
            let data = '';

            response.on('data', (chunk) => (data += chunk));

            response.on('end', () => {
              if (response.statusCode === 200) {
                resolve(); // Sucesso com base no status 200
              } else {
                reject(new Error(`HTTP Status: ${response.statusCode}`));
              }
            });
          })
          .on('error', (err) => reject(err));
      });
    };

    // Perform HTTP request
    await makeHttpRequest(verifyIfExistsCustomerUri + cpf);

    // Build the policy document to allow access
    const policyDocument = {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: event.methodArn
        }
      ]
    };

    return {
      principalId: cpf,
      policyDocument
    };
  } catch (err) {
    console.error(`Authorization failed for CPF ${event.headers?.['cpf'] || 'unknown'}:`, err.message);

    return {
      principalId: 'unauthorized',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: event.methodArn
          }
        ]
      }
    };
  }
};
