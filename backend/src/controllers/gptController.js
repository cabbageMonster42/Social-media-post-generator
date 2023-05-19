const axios = require("axios");



async function generateText(ctx) {

  const { textLength, inputText, socialMedia, textType, audienceType } = ctx.request.body;
  try {
    const response = await axios.post("https://api.openai.com/v1/chat/completions", 

		{
			"model": "gpt-3.5-turbo",
			// "max_tokens": ,
			"messages": [{"role": "user", "content": `You are an expert proffesional marketing writer! Write a promotional text for ${inputText},  with only a limited Number of words: ${textLength}!, specifically a ${socialMedia} type post focusing on ${audienceType} as its target audience, in the style: ${textType}`}]
		}, {
      headers: {
        "Authorization": "Bearer MyOpenAiToken",
        "Content-Type": "application/json",
      },
    });

    const generatedText = response.data.choices[0].message.content;

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: generatedText,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: error.message,
    };
  }
}

module.exports = {
  generateText,
};
