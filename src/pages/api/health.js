// heath check api endpoint

export default async function handler(req, res) {
  res.status(200).json({ message: 'I am alive' });
}