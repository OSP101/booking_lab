import { NextResponse } from 'next/server'
import { mysqlPool } from "../../../../utils/db";
import { authenticateApiKey } from '../../../../lib/encrypt'
import bcrypt from 'bcryptjs'
import nodemailer from "nodemailer";
import { sendResetEmail } from "@/lib/email"; 

const postLabHandler = async (req) => {
    try {
        const body = await req.json();
        const promisePool = mysqlPool.promise();

        const { email } = body;
        if (!email) {
          return NextResponse.json(
            { error: 'Missing required fields' },
            { status: 400 }
          );
        }
    
        let [user] = await promisePool.query('SELECT id,email FROM User WHERE email = ?', [email]);

        if (user.length === 0) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const token = bcrypt.hashSync(email, 5);
        const expiresAt = new Date(Date.now() + 1000 * 60 * 10);

        let [userToken] = await promisePool.query('SELECT id FROM Password_reset WHERE email = ?', [email]);

        if(userToken.length > 0) {
            await promisePool.query('DELETE FROM Password_reset WHERE email = ?', [email]);
        }
        const [userReset] = await promisePool.query('INSERT INTO Password_reset (email, token, expiresAt) VALUES (?, ?, ?)', [email, token, expiresAt]);

        const resetLink = `${process.env.NEXT_PUBLIC_URL}/reset-password?token=${token}`;
        const expirationTime = "10 นาที / 10 minutes";

        // const transporter = nodemailer.createTransport({
        //     host: 'smtp.mailersend.net',
        //     port: 587,
        //     secure: false,
        //     auth: {
        //         user: process.env.MAILERSEND_SMTP_USER,
        //         pass: process.env.MAILERSEND_SMTP_PASSWORD,
        //     },
        // });
    
        // const mailOptions = {
        //     from: `"Booking Lab Support" <${process.env.EMAIL_USER}>`,
        //     to: email,
        //     subject: "รีเซ็ตรหัสผ่านของคุณ | Reset Your Password - Booking Lab",
        //     text: `สวัสดี,\n\nเราได้รับคำขอให้รีเซ็ตรหัสผ่านของคุณ คลิกลิงก์ด้านล่างเพื่อดำเนินการ:\n${resetLink}\n\nลิงก์นี้จะหมดอายุใน ${expirationTime} หากคุณไม่ได้ร้องขอ กรุณาเพิกเฉยต่ออีเมลนี้\n\n© 2024 Booking Lab All Rights Reserved. Made with ❤️ by SaitoArm & OSP101`,
        //     html: `
        //         <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        //             <h2 style="color: #333; text-align: center;">🔐 รีเซ็ตรหัสผ่านของคุณ</h2>
        //             <h3 style="color: #333; text-align: center;">Reset Your Password</h3>
        //             <p style="color: #555; text-align: center;">สวัสดี,</p>
        //             <p style="color: #555;">เราได้รับคำขอให้รีเซ็ตรหัสผ่านของคุณ กรุณาคลิกปุ่มด้านล่างเพื่อดำเนินการ:</p>
        //             <p style="color: #555; text-align: center;">We received a request to reset your password. Click the button below to proceed:</p>
        //             <div style="text-align: center; margin: 20px 0;">
        //                 <a href="${resetLink}" style="background: #007bff; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold;">
        //                     🔄 รีเซ็ตรหัสผ่าน | Reset Password
        //                 </a>
        //             </div>
        //             <p style="color: #777; font-size: 14px;">
        //                 ลิงก์นี้จะหมดอายุใน <b>${expirationTime}</b> หากคุณไม่ได้ร้องขอ กรุณาเพิกเฉยต่ออีเมลนี้
        //             </p>
        //             <p style="color: #777; font-size: 14px;">
        //                 This link will expire in <b>${expirationTime}</b>. If you did not request this, please ignore this email.
        //             </p>
        //             <hr style="border: none; border-top: 1px solid #ddd;">
        //             <p style="color: #777; font-size: 12px; text-align: center;">
        //                 © 2024 Booking Lab All Rights Reserved. Made with ❤️ by SaitoArm & OSP101
        //             </p>
        //         </div>
        //     `
        // };

        // transporter.sendMail(mailOptions, function (error, info) {
        //     if (error) {
        //         console.log(error);
        //     } else {
        //         console.log("Email sent: " + info.response);
        //     }
        // });

        // const response = await fetch("https://api.mailersend.com/v1/email", {
        //     method: "POST",
        //     headers: {
        //         "Authorization": `Bearer ${process.env.MAILERSEND_API_KEY}`,
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify({
        //         from: {
        //             email: process.env.MAILERSEND_SENDER,
        //             name: "Booking Lab Support"
        //         },
        //         to: [{ email }],
        //         subject: "🔐 รีเซ็ตรหัสผ่านของคุณ | Reset Your Password - Booking Lab",
        //         text: `สวัสดี,\n\nเราได้รับคำขอให้รีเซ็ตรหัสผ่านของคุณ คลิกลิงก์ด้านล่างเพื่อดำเนินการ:\n${resetLink}\n\nลิงก์นี้จะหมดอายุใน ${expirationTime} หากคุณไม่ได้ร้องขอ กรุณาเพิกเฉยต่ออีเมลนี้\n\n© 2024 Booking Lab All Rights Reserved. Made with ❤️ by SaitoArm & OSP101`,
        //         html: `
        //             <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        //                 <h2 style="color: #333; text-align: center;">🔐 รีเซ็ตรหัสผ่านของคุณ</h2>
        //                 <h3 style="color: #333; text-align: center;">Reset Your Password</h3>
        //                 <p style="color: #555; text-align: center;">สวัสดี,</p>
        //                 <p style="color: #555;">เราได้รับคำขอให้รีเซ็ตรหัสผ่านของคุณ กรุณาคลิกปุ่มด้านล่างเพื่อดำเนินการ:</p>
        //                 <p style="color: #555; text-align: center;">We received a request to reset your password. Click the button below to proceed:</p>
        //                 <div style="text-align: center; margin: 20px 0;">
        //                     <a href="${resetLink}" style="background: #007bff; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold;">
        //                         🔄 รีเซ็ตรหัสผ่าน | Reset Password
        //                     </a>
        //                 </div>
        //                 <p style="color: #777; font-size: 14px;">
        //                     ลิงก์นี้จะหมดอายุใน <b>${expirationTime}</b> หากคุณไม่ได้ร้องขอ กรุณาเพิกเฉยต่ออีเมลนี้
        //                 </p>
        //                 <p style="color: #777; font-size: 14px;">
        //                     This link will expire in <b>${expirationTime}</b>. If you did not request this, please ignore this email.
        //                 </p>
        //                 <hr style="border: none; border-top: 1px solid #ddd;">
        //                 <p style="color: #777; font-size: 12px; text-align: center;">
        //                     © 2024 Booking Lab All Rights Reserved. Made with ❤️ by SaitoArm & OSP101
        //                 </p>
        //             </div>
        //         `
        //     })
        // });

        // const result = await response.json();
        // if (!response.ok) {
        //     console.error("Mailersend API Error:", result);
        //     return NextResponse.json({ error: "Failed to send email", details: result }, { status: 500 });
        // }

        await sendResetEmail(email, token);

        return NextResponse.json(user,{ message: "อีเมลรีเซ็ตรหัสถูกส่งแล้ว", status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create reset: ' + error },
            { status: 500 }
        );
    }
};


export const POST = authenticateApiKey(postLabHandler);