var iframe;
var xmlhttp = new XMLHttpRequest();
var url = "http://jedaube:eleanor81@127.0.0.1:8000/items?name=";

// ********** janky -- need refactoring
var nodef = "This item is not defined in Corporate Information, click below to define";
var fulldef = "full definition »</a>"
var pkd = "new/"
// ********** end janky -- need refactoring

function createIframe(nameHtml, descHtml, pkd) {

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
    defHtml = "<body style=\"font-family:sans-serif;font-size:14px;\">" 
          + "<p style=\"font-weight:bold; font-size:16px;\">" 
          + nameHtml
          + "</p>"
          + "<hr />"
          + "<br />" 
          + descHtml
          + "<br /><br /><hr />"
          + "<div align=\"right\">" 
          + "<a target=\"_blank\" href=\"http://127.0.0.1:8000/info/"
          + pkd
          + "\">"
          + fulldef
          + "</div>" 
          + "</body>";
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(defHtml);
    //add event listener inside of iframe for word lookups inside of definitions 
    iframe.contentWindow.document.addEventListener('dblclick',function(){lookupSelection(iframe.contentWindow)}); 
    iframe.contentWindow.scrollTo(0,0);
    
    // ********** janky -- need refactoring
    pkd = "new/";
    fulldef = "full definition »</a>"
    // ********** end janky -- need refactoring
      //
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
        urlForAPI = url + word;
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200 ) {
                console.log(this.responseText);
                myFunction(this.responseText);
            }
        }
        xmlhttp.open("GET", urlForAPI, true);
        xmlhttp.send();
        function myFunction(response) {
           var item = JSON.parse(response);
           
           // ********** janky -- need refactoring 
           if (item.count == 0) {
               fulldef = "create a definition »</a>"
               createIframe(word, nodef, pkd);
           }
           // ********** end janky -- need refactoring
           else { 
             var name = item.results[0].name;
             var description = item.results[0].description;
             pkd = item.results[0].pk;
             nameH = name + ":  ";
             descH = description;

             console.log(item);    
             console.log(xmlhttp.status);
             console.log(xmlhttp.statusText);
             createIframe(nameH, descH, pkd);  
           }
        }
      }
      else 
      {
        console.log("error: nothing selected");     
      }
}
}

//add event listener for double-click to lookup current selection
document.addEventListener('dblclick',function(){lookupSelection(window)});
