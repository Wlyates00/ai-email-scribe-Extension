// When installed a context menu button will be created
chrome.runtime.onInstalled.addListener(() => {
  // Creating context menu with these porperties
  chrome.contextMenus.create({
    id: "aiEmailScribe",
    title: "Generate AI Email Body",
    contexts: ["selection"],
    documentUrlPatterns: ["*://mail.google.com/*"],
  });
});

// Adding life to the context menu button
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  // Check if my context menu was the lucky one to be clicked
  if (info.menuItemId === "aiEmailScribe" && info.selectionText) {
    // The selected text
    const selectedText = info.selectionText;

    // Call your backend OpenAI API to generate text
    const tone = "Happy";
    const promptText = selectedText;

    // API call to the backend
    try {
      const response = await fetch(
        "http://localhost:3200/api/context-menu/generate-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tone, promptText }), // Sending tone and user prompt
        }
      );

      const data = await response.json();
      const generatedText = data.generatedEmail;

      // Inject a script into the curent running tab to delete the selected text and insert the generated text
      // BUT ONLY if it is editable!
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (newText) => {
          const selection = window.getSelection(); // Get this window selection
          if (selection.rangeCount > 0) {
            // If its more than "" proceed

            const range = selection.getRangeAt(0); // All chars in your selection

            let container = range.commonAncestorContainer; // Check its container

            // If the container is a text node, get its parent node
            if (container.nodeType === Node.TEXT_NODE) {
              container = container.parentNode;
            }
            if (!container.isContentEditable) {
              return; // This stop the user from destroying the page
            }
            range.deleteContents(); // Delete selected text

            // Insert the new generated text
            const textNode = document.createTextNode(newText);
            range.insertNode(textNode);
          }
        },
        args: [generatedText],
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }
});
