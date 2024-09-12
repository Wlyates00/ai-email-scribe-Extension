chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "aiEmailScribe",
        title: "Generate AI Email",
        contexts: ["selection"], // Adjust based on where you want the menu to show up
        documentUrlPatterns: ["*://mail.google.com/*"]
    });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "aiEmailScribe" && info.selectionText) {
        const selectedText = info.selectionText;
        
        // Call your backend OpenAI API to generate text
        const tone = "happy"; // Example tone; can be dynamic based on your use case
        const promptText = selectedText;

        try {
        const response = await fetch('http://localhost:3000/api/context-menu/generate-email', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tone, promptText })
        });

        const data = await response.json();
        const generatedText = data.generatedEmail;

        // Inject a script into the tab to delete the selected text and insert the generated text
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: (newText) => {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.deleteContents(); // Delete selected text

                // Insert the new generated text
                const textNode = document.createTextNode(newText);
                range.insertNode(textNode);
            }
            },
            args: [generatedText]
        });
        } catch (error) {
            console.error('Error:', error);
        }
    }
});