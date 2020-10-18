export default async function handleWebhook(req, res) {
  res.status(200).send('pong');
}

// Prevents next from invoking the default bodyparser
export const config = {
  api: {
    bodyParser: false,
  },
};
