import React, { useState, useEffect } from "react";
import "./Word.css";

const WordEditor = () => {
  const [pages, setPages] = useState([{ id: 1, content: "" }]);
  const [color, setColor] = useState("#000000");
  const [font, setFont] = useState("Arial");
  const [fontSize, setFontSize] = useState("3");
  const maxContentHeight = 750;
  useEffect(() => {
    const savedPages = JSON.parse(localStorage.getItem("editorPages"));
    if (savedPages) {
      setPages(savedPages);
    }
  }, []);

  const handleCommand = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const handleColorChange = (e) => {
    const selectedColor = e.target.value;
    setColor(selectedColor);
    handleCommand("foreColor", selectedColor);
  };

  const handleFontChange = (e) => {
    const selectedFont = e.target.value;
    setFont(selectedFont);
    handleCommand("fontName", selectedFont);
  };

  const handleFontSizeChange = (e) => {
    const selectedFontSize = e.target.value;
    setFontSize(selectedFontSize);
    handleCommand("fontSize", selectedFontSize);
  };

  const saveContent = () => {
    const updatedPages = pages.map((page) => ({
      ...page,
      content: document.getElementById(`page-${page.id}`).innerHTML,
    }));
    setPages(updatedPages);
    localStorage.setItem("editorPages", JSON.stringify(updatedPages));
    alert("Content saved locally!");
  };

  const clearContent = () => {
    setPages([{ id: 1, content: "" }]);
    localStorage.removeItem("editorPages");
    alert("Content cleared!");
  };

  const addPage = () => {
    setPages([...pages, { id: pages.length + 1, content: "" }]);
  };

  const deletePage = (id) => {
    const updatedPages = pages.filter((page) => page.id !== id);
    setPages(updatedPages);
  };
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text/plain");
    const currentPage = document.getElementById(`page-${pages[pages.length - 1].id}`);
    currentPage.innerHTML += pastedText;
    while (currentPage.scrollHeight > maxContentHeight) {
      const content = currentPage.innerHTML;
      let splitPoint = content.length - 1;
      while (splitPoint > 0 && currentPage.scrollHeight > maxContentHeight) {
        currentPage.innerHTML = content.substring(0, splitPoint);
        splitPoint--;
      }
      const remainingText = content.substring(splitPoint);
      
      const newPageId = pages.length + 1;
      setPages((prevPages) => [...prevPages, { id: newPageId, content: remainingText }]);
      const newPage = document.getElementById(`page-${newPageId}`);
      if (newPage) {
        newPage.innerHTML = remainingText;
      }
    }
  };
  
  
  
  
 

  return (
    <div className="word-editor">
      <div className="toolbar">
        <button onClick={() => handleCommand("bold")}><b>B</b></button>
        <button onClick={() => handleCommand("italic")}><i>I</i></button>
        <button onClick={() => handleCommand("underline")}><u>U</u></button>
        <button onClick={() => handleCommand("justifyLeft")}>Left</button>
        <button onClick={() => handleCommand("justifyCenter")}>Center</button>
        <button onClick={() => handleCommand("justifyRight")}>Right</button>
        <button onClick={() => handleCommand("insertOrderedList")}>OL</button>
        <button onClick={() => handleCommand("insertUnorderedList")}>UL</button>
        <label className="color-picker">
          Text Color
          <input type="color" value={color} onChange={handleColorChange} />
        </label>
        <label className="font-picker">
          Font:
          <select value={font} onChange={handleFontChange}>
            <option value="Arial">Arial</option>
            <option value="Verdana">Verdana</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
          </select>
        </label>
        <label className="font-size-picker">
          Font Size:
          <select value={fontSize} onChange={handleFontSizeChange}>
            <option value="1">8px</option>
            <option value="2">10px</option>
            <option value="3">12px</option>
            <option value="4">14px</option>
            <option value="5">18px</option>
            <option value="6">24px</option>
            <option value="7">36px</option>
          </select>
        </label>
      </div>

      {pages.map((page) => (
        <div key={page.id} className="page" >
        <div id={`page-${page.id}`}
            contentEditable="true"
            className="editor"
            onPaste={handlePaste}
            suppressContentEditableWarning={true}
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
    
          <button
            className="delete-page-button"
            onClick={() => deletePage(page.id)}
          >
            <span className="icon">
              <span className="lid"></span>
              <span className="can"></span>
            </span>
          </button>
          
          
         
 
        </div>
      ))}
       <button className="add-page-button" onClick={addPage}>
          Add New Page
       </button>
       <button className="save-button" onClick={saveContent}>
          Save Content
       </button>
       <button className="clear-button" onClick={clearContent}>
          Clear Content
       </button>
      
    </div>
  );
};


export default WordEditor;



