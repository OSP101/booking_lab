import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetEmail(email, token) {
    const resetLink = `${process.env.NEXT_PUBLIC_URL}/reset-password?token=${token}`;
    const expirationTime = "10 นาที / 10 minutes";

    try {
        const response = await resend.emails.send({
            from: "Booking Lab Support <booking-lab@osp101.dev>",
            to: email,
            subject: "รีเซ็ตรหัสผ่านของคุณ | Reset Your Password - Booking Lab",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #333; text-align: center;">🔐 รีเซ็ตรหัสผ่านของคุณ</h2>
                    <h3 style="color: #333; text-align: center;">Reset Your Password</h3>
                    <p style="color: #555; text-align: center;">สวัสดี,</p>
                    <p style="color: #555;">เราได้รับคำขอให้รีเซ็ตรหัสผ่านของคุณ กรุณาคลิกปุ่มด้านล่างเพื่อดำเนินการ:</p>
                    <p style="color: #555; text-align: center;">We received a request to reset your password. Click the button below to proceed:</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="${resetLink}" style="background: #007bff; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold;">
                            🔄 รีเซ็ตรหัสผ่าน | Reset Password
                        </a>
                    </div>
                    <p style="color: #777; font-size: 14px;">
                        ลิงก์นี้จะหมดอายุใน <b>${expirationTime}</b> หากคุณไม่ได้ร้องขอ กรุณาเพิกเฉยต่ออีเมลนี้
                    </p>
                    <p style="color: #777; font-size: 14px;">
                        This link will expire in <b>${expirationTime}</b>. If you did not request this, please ignore this email.
                    </p>
                    <hr style="border: none; border-top: 1px solid #ddd;">
                    <p style="color: #777; font-size: 12px; text-align: center;">
                        © 2024 Booking Lab All Rights Reserved. Made with ❤️ by SaitoArm & OSP101
                    </p>
                </div>
            `,
        });

        console.log("Email sent:", response);
        return response;
    } catch (error) {
        console.error("Resend API Error:", error);
        throw new Error("Failed to send email");
    }
}
