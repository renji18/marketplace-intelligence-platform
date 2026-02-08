export const verifyEmailAccount = (url: string, temporaryPassword: string) => {
  return `
    <p>Verify your email</p>

    <p>
      Thank you for signing up. Please verify your email by visiting the link below:
    </p>

    <p>
      <a href="${url}">${url}</a>
    </p>

    <p>
      Temporary password:<br />
      <strong>${temporaryPassword}</strong>
    </p>

    <p>
      After logging in, please change your password.
    </p>

    <p>
      © ${new Date().getFullYear()}
    </p>
  `;
};
