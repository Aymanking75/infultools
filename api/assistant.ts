export default function handler(req: any, res: any) {
  const { prompt } = req.body;

  res.status(200).json({
    text: "سمعتك تقول: " + prompt
  });
}