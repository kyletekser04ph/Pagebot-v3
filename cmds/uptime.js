const moment = require('moment-timezone');

module.exports = {
  name: 'uptime',
  description: 'Show uptime bot.',
  author: 'Y2PHEQ',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const startTime = process.startTime;
    const uptime = process.uptime();

    const duration = moment.duration(uptime, 'seconds');
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    let uptimeMessage = "";

    if (days === 1) {
      uptimeMessage += `${days} Day, `;
    } else if (days > 1) {
      uptimeMessage += `${days} Days, `;
    }

    if (hours === 1) {
      uptimeMessage += `${hours} Hour, `;
    } else if (hours > 1) {
      uptimeMessage += `${hours} Hours, `;
    }

    if (minutes === 1) {
      uptimeMessage += `${minutes} Minute, `;
    } else if (minutes > 1) {
      uptimeMessage += `${minutes} Minutes, `;
    }

    if (seconds === 1) {
      uptimeMessage += `${seconds} Second.`;
    } else if (seconds > 1) {
      uptimeMessage += `${seconds} Seconds.`;
    }

    sendMessage(senderId, {
      text: uptimeMessage
    }, pageAccessToken);
  }
};
