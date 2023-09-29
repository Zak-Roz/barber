export const message = {
  getResetBody: (client_url: string, key: string) => `
    Click on <a href="${client_url}/verify-password?key=${key}">link</a>
  `,
  getVerifyBody: (client_url: string, key: string) => `
    <p>
      Thank you for registering with our platform! We're excited to have you as a part of our community. To complete the
      registration process and ensure the security of your account, we kindly request you to verify your email address.
    </p>

    <p>
      Please click on the following link to verify your email: <a href="${client_url}/verification?key=${key}">Verification Link</a>
    </p>

    <p>
      Once you've verified your email, you'll have full access to all the features and benefits our platform offers.
    </p>

    <p>
      Thank you for choosing our platform. We look forward to providing you with a great experience!
    </p>

    <p>
      Best regards,
    </p>

    <p>
      Guxamit Team
    </p>
  `,
  getVerifyCompanyBody: (client_url: string, key: string) => `
    Click on <a href="${client_url}/verification-company-email?key=${key}">link</a>
  `,
  getInviteLink: (client_url: string, key: string) => `
    <p>
      I'm thrilled to invite you to our exclusive company named "KPI" on our interactive web application.
    </p>

    <p>
      To join the "KPI" group, simply follow this <a href="${client_url}/invite-company?key=${key}">link</a>.
    </p>

    <p>
      Best regards,
    </p>

    <p>
      Guxamit Team
    </p>
  `,
  getVerificationCode: (key: string) => `
    Hello,
    Your verification code:
    <b>${key}</b>
    The verification code will be valid for 30 minutes. Please do not share this code with anyone.
  `,
};
