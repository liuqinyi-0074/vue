const {onRequest} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const Mailjet = require("node-mailjet");
const cors = require("cors")({origin: true});

admin.initializeApp();

exports.sendEmail = onRequest((request, response) => {
  cors(request, response, async () => {
    try {
      const {from: fromEmail, to: toEmail, subject, attachments} =
      request.query;

      // 验证必要参数是否存在
      if (!fromEmail) {
        return response.status(400).send("Query param 'from' is required");
      }
      if (!toEmail) {
        return response.status(400).send("Query param 'to' is required");
      }
      if (!subject) {
        return response.status(400).send("Query param 'subject' is required");
      }

      // 将 toEmail 转换为收件人数组
      const recipientEmails = toEmail.split(",").map((email) => ({
        Email: email.trim(),
        Name: "Recipient",
      }));

      // 初始化 Mailjet 客户端
      const mailjet = Mailjet.apiConnect(
          "dd25224982b214309b41c3d59cf4e35b",
          "72833dca5cd9576c4626a10b9ed44951",
      );

      // 构建邮件请求
      const emailRequest = mailjet.post("send", {version: "v6.0.6"}).request({
        Messages: [
          {
            From: {
              Email: fromEmail,
              Name: "System email",
            },
            To: recipientEmails, // 允许多个收件人
            Subject: subject,
            HTMLPart: "<h3>Dear user, welcome to Social Food Support</h3>",
            TextPart: "Dear user, welcome to Social Food Support",
            Attachments: attachments ? JSON.parse(attachments) : [], // 处理附件
          },
        ],
      });

      // 发送邮件并返回结果
      const result = await emailRequest;
      response.status(201).json(result.body);
    } catch (err) {
      response.status(500).send(`Failed to send email: ${err.message}`);
    }
  });
});
