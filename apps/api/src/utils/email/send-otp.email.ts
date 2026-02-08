export const sendLoginOtp = (userName: string, otp: string) => {
  return `
    <p>Your OTP for login</p>

    <p>
      Hello ${userName || 'User'},
    </p>

    <p>
      Use the following One-Time Password (OTP) to log in:
    </p>

    <p>
      <strong>${otp}</strong>
    </p>

    <p>
      This OTP is valid for 10 minutes.<br />
      Do not share this code with anyone.
    </p>

    <p>
      If you did not request this login, you can safely ignore this email.
    </p>

    <p>
      © ${new Date().getFullYear()}
    </p>
  `;
};
