export const forgotPasswordEmail = (url: string, temporaryPassword: string) => {
  return `
    <p>Reset your password</p>

    <p>
      We received a request to reset your password. Use the link below to proceed:
    </p>

    <p>
      <a href="${url}">${url}</a>
    </p>

    <p>
      Temporary password:<br />
      <strong>${temporaryPassword}</strong>
    </p>

    <p>
      After logging in, please change your password.<br />
      If you did not request this, you can ignore this email.
    </p>

    <p>
      © ${new Date().getFullYear()}
    </p>
  `;
};
