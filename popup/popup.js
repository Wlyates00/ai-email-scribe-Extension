document.getElementById('submit').addEventListener('click', async function() {
    const tone = document.getElementById('custom-tone').value;
    const promptText = document.getElementById('field').value;

    // Construct the prompt for OpenAI API based on user inputs
    const messages = [
        { role: 'system', content: `You are going to act as the user. Write an email from the user's perspective using a ${tone} tone. The email should address the following prompt: ${promptText}. Ensure that the tone and content is relevant to the user's intent . Keep the email concise and ensure it is within a short length to stay within token limits.` },
        { role: 'user', content: promptText }
    ];

    try{
        // Send a POST request to your backend API
        const response = await fetch('http://localhost:3000/api/generate-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tone: tone,
                promptText: promptText
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to generate email');
        }

            
    const data = await response.json();
    const generatedEmail = data.generatedEmail.trim(); 

    // Save the generated email to localStorage
    localStorage.setItem('lastGeneratedEmail', generatedEmail);

    // Display the generated email in the output div
    document.getElementById('emailOutput').innerText = generatedEmail;
    }
    catch (error) {
        console.error('Error:', error);
        document.getElementById('emailOutput').innerText = `Error: ${error.message}`;
    }
});

// ON PAGE LOAD EVENT (RETAIN LAST GENERATED EMAIL)
document.addEventListener('DOMContentLoaded', function() {
    // Retrieve the last generated email from localStorage
    const lastGeneratedEmail = localStorage.getItem('lastGeneratedEmail');
    
    if (lastGeneratedEmail) {
        // Display the last generated email in the output div
        document.getElementById('emailOutput').innerText = lastGeneratedEmail;
    }
});