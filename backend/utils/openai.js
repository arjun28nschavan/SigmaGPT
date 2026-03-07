import dotenv from "dotenv";
dotenv.config();

const getOpenAIAPIResponse = async (message) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "user",
                    content: message,
                }
            ]
        })
    };

    try {
        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            options
        );

        const data = await response.json();

        // console.log(data.choices[0].message.content);
        return (data.choices[0].message.content); //reply

    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching Groq API");
    }
}

export default getOpenAIAPIResponse;