export default function handler(req: any, res: any) {
  const { prompt } = req.body;

  // هذه طريقة بسيطة للرد فوري بدون GenAI
  res.status(200).json({
    text: "سمعتك تقول: " + prompt
  });
}