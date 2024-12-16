module.exports = {
  admin: true,
  description: "Evaluate JS commands. Admin access only.",
  async run({ api, send, args, admin }){
    try {
    await eval(args.join(" "));
    } catch (error){
      send(error.message || error);
    }
  }
}
