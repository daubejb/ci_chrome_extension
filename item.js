var iframe;

function createIframe(defHtml) {

  //don't add a frame within a frame
  var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
  if (!location.ancestorOrigins.contains(extensionOrigin)) {
   
    var iframeExists = false;    

    //check if iframe exists
    if (iframe)
      if (iframe.parentNode)
        iframeExists = true;
    
    //only create iframe if it doesn't exist
    if (!iframeExists)
    {        
    iframe = document.createElement('iframe');

    iframe.setAttribute("id", "itemlookup");
    iframe.setAttribute("style",'position:fixed;top:50%;left:50%;margin-top: -100px;margin-left: -200px;display:block;width:400px;height:200px;z-index:1000;background:lightgrey;color:black;border:1px solid grey;padding: 4px 4px 0px 0px');
 
    document.body.appendChild(iframe);
    }

    //insert definition html in iframe
    defHtml = "<body style=\"font-family:sans-serif;font-size:14px;\">" + defHtml + "</body>";
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(defHtml);
    //add event listener inside of iframe for word lookups inside of definitions 
    iframe.contentWindow.document.addEventListener('dblclick',function(){lookupSelection(iframe.contentWindow)}); 
    iframe.contentWindow.scrollTo(0,0);
    iframe.contentWindow.document.close();

    //add event to delete iframe upon main window click
    document.addEventListener('click',deleteIframe);
  }  
}

//delete iframe definition box
function deleteIframe()
{
  if (iframe)
    if (iframe.parentNode)
      iframe.parentNode.removeChild(iframe); //if iframe exists, remove it
  document.removeEventListener('click',deleteIframe); //remove event listener for main window click

}

//lookup selection made in window specified
function lookupSelection(lookupWindow) {
  var word = lookupWindow.getSelection().toString();
  if (word)
  {
    if (word.length > 0) //check to make sure word doesn't include any spaces and has nonzero length
      { 
	    console.log("selection: [" + word + "]");
        createIframe(word);  

      }
      else 
      {
        console.log("error: nothing selected");     
      }
}
}

//add event listener for double-click to lookup current selection
document.addEventListener('dblclick',function(){lookupSelection(window)});
