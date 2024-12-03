const http = require('http');

exports.handler = async (event) => {
  const verifyIfExistsCustomerUri = process.env.CUSTOMER_API_URI || 'http://100.27.205.96:8080/api/v1/cliente/';
  
  try {
    const cpf = event.headers?.['cpf'];

    if (!cpf) {
      throw new Error('CPF is missing in the request headers');
    }

    // Promisify HTTP request
    const makeHttpRequest = (url) => {
      return new Promise((resolve, reject) => {
        http.get(url, (response) => {
          let data = '';

          response.on('data', (chunk) => {
            data += chunk;
          });

          response.on('end', () => {
            if (response.statusCode === 200) {
              resolve(); // Sucesso com base no status 200
            } else {
              reject(new Error(`HTTP Status: ${response.statusCode}`));
            }
          });
        }).on('error', (err) => {
          reject(err);
        });
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


// VALIDAÇÃO VIA JWT

// exports.handler = async (event) => {
//   const token = event.authorizationToken.split(' ')[1]; // Extract JWT Bearer

//   const cognitoUserPoolPublicKey = 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_P0lxyCCVh/.well-known/jwks.json';
//   // Include cognito user pool public key		#################################################################
//   const verifyIfExistsCustomerUri = '';
//   // Set service responsible for consult by CPF	#################################################################
//   try {
//     // Decode and verify JWT token
//     const decoded = jwt.verify(token, cognitoUserPoolPublicKey);

//     // Extract CPF from JWT claims
//     const cpf = decoded['custom:cpf'];
//     if (!cpf) throw new Error('CPF not found in token claims');

//     // Validate CPF via your application endpoint
//     const response = await axios.get(verifyIfExistsCustomerUri + cpf);
//     if (response.status !== 200 || !response.data.isValid) throw new Error('CPF validation failed');

//     // Build the policy document to allow access
//     // Change policyDocument according to returned while creating lambda function   #################################################################
//     const policyDocument = {
//       Version: '2012-10-17',
//       Statement: [
//         {
//           Action: 'execute-api:Invoke',
//           Effect: 'Allow',
//           Resource: event.methodArn
//         }
//       ]
//     };

//     return {
//       principalId: decoded.sub,
//       policyDocument,
//       context: {
//         user: JSON.stringify(decoded)
//       }
//     };
//   } catch (err) {
//     console.error('Authorization failed:', err.message);

//     // Deny access if validation fails
//     return {
//       principalId: 'unauthorized',
//       policyDocument: {
//         Version: '2012-10-17',
//         Statement: [
//           {
//             Action: 'execute-api:Invoke',
//             Effect: 'Deny',
//             Resource: event.methodArn
//           }
//         ]
//       }
//     };
//   }
// };
