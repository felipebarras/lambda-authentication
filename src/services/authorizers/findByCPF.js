const jwt = require('jsonwebtoken');
const axios = require('axios'); // For making HTTP requests

exports.handler = async (event) => {
  const token = event.authorizationToken.split(' ')[1]; // Extract JWT Bearer

  const cognitoUserPoolPublicKey = 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_P0lxyCCVh/.well-known/jwks.json';
  // Include cognito user pool public key		#################################################################
  const verifyIfExistsCustomerUri = '';
  // Set service responsible for consult by CPF	#################################################################
  try {
    // Decode and verify JWT token
    const decoded = jwt.verify(token, cognitoUserPoolPublicKey);

    // Extract CPF from JWT claims
    const cpf = decoded['custom:cpf'];
    if (!cpf) throw new Error('CPF not found in token claims');

    // Validate CPF via your application endpoint
    const response = await axios.get(verifyIfExistsCustomerUri + cpf);
    if (response.status !== 200 || !response.data.isValid) throw new Error('CPF validation failed');

    // Build the policy document to allow access
    // Change policyDocument according to returned while creating lambda function   #################################################################
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
      principalId: decoded.sub,
      policyDocument,
      context: {
        user: JSON.stringify(decoded)
      }
    };
  } catch (err) {
    console.error('Authorization failed:', err.message);

    // Deny access if validation fails
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
