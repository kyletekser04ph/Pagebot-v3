module.exports = {
  description: "What is Cuddlybot?",
  async run({ api, send, admin }){
    await send({
      attachment: {
        type: "image",
        payload: {
          url: "https://i.imgur.com/gw1V46p.jpeg",
          is_reusable: true
        }
      }
    });
    setTimeout(async () => await send({
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: `🤖 About Cuddlybot:
Cuddlybot is your friendly, helpful personal assistant.

💭 Why I named Cuddlybot as a name of the page bot because this is dedicated to my mind  and is a cute name right? 

❓ Contact us admins if you experienced/encountered any issue regarding to the bot and I will try to fix it. Thankyou for using me as a personal assistant!`,
          buttons: [
            {
              type: "web_url",
              url: "https://www.facebook.com/profile.php?id=61570199715409",
              title: "Like/Follow our Page"
                },
            {
              type: "web_url",
              url: "https://www.facebook.com/kylepogiv20",
              title: "Contact Admin 1"
                },
            {
              type: "web_url",
              url: "https://www.facebook.com/liannz12",
              title: "Contact Admin 2"
                }
             ]
        }
      }
    }), 2*1000);
  }
}
