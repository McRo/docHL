// Vannilla JS

init();

function init(){

    // get all embeds
    var embeds = document.getElementsByClassName("docHL");
    // 
    Array.from(embeds).forEach( 
        
        function(embed, index){
            populateEmbed (embed )
        }

    )



}


async function populateEmbed (embed) {
        

    var settings = Object.assign({}, embed.dataset)
    // load data
    let data = await getData(settings)
    
    //filter data
    let filtered_data = filterData(settings, data);

    // display data
    let displayed = displayItems(embed, filtered_data);
}




function getData(data_embed) {

    return new Promise((resolve, reject) => {

        var request = new XMLHttpRequest();
        request.open("GET", data_embed.url, true);

        request.onload = function() {

            xml_data = request.responseXML;
            resolve(xml_data)

        }
        request.send();
    })

}


function filterData(settings, items) {


    
    var tags = items.querySelectorAll(settings.filterTag);
    
    arr = []
    
    tags.forEach( function(tag, index )  {
        if(tag.innerHTML==settings.filterValue){
            item = tag.parentNode;
            arr.push(item)

        }
    })

    return arr;

}


function displayItems(embed, items){

    var html = "<div class='pinit'>";
    

    Array.from(items).forEach( (item) => {  

        item_html = buildHtml(item);
        html += item_html;
        
    })

    html += "</div>";
    
    // keep embed tag
    embed.innerHTML = html;
    // kill him : 
    // embed.outerHTML = html;

}


function buildHtml(item){

    // get infos from XML nodes
    let _title = item.querySelectorAll("titre")[0].textContent;
    console.group(_title)
    let _author = item.querySelectorAll("auteur")[0].textContent;
    let _year = item.querySelectorAll("annee")[0].textContent;
    // transform html tag text 
    let _text = sanitize(_title + " " + _author) + " <br/>" + _year ;
    let _thumb = item.querySelectorAll("vignette_maxi")[0].textContent;
    let _url = item.querySelectorAll("url")[0].textContent;
    // 
    let _is_new =  item.querySelectorAll("note_interne_3")[0].textContent == "N";
    let _label = item.querySelectorAll("libelle_collection")[0].textContent;
    // build class for item (new and libelle)
    let _class = [_is_new?"new":"old", slugify(_label)];

    // tranforme tempatetags to dom obj
    let template_dom = new DOMParser().parseFromString(getTemplateTags(),  "application/xml");
    
    // set classes
    template_dom.getElementsByClassName("item")[0].classList.add(..._class);
    // set image
    template_dom.getElementsByTagName("img")[0].setAttribute('src', _thumb);
    // set url
    template_dom.getElementsByTagName("a")[0].setAttribute('href', _url);
    // set text
    template_dom.getElementsByClassName("ov")[0].innerHTML = _text;
    
    //
    return template_dom.documentElement.outerHTML;
    
}


function getTemplateTags(){

    let template = '<span class="item " >\
                    <a href="" target="_blank">\
                        <img src="" alt="" width="auto" /> \
                        <span class="ov"></span>\
                    </a>\
                </span>';
    
    
    return template;

}


function slugify(text) {
    /* FROM https://gist.github.com/thierryc */
    return text
    .toString()                     // Cast to string
    .toLowerCase()                  // Convert the string to lowercase letters
    .normalize('NFD')       // The normalize() method returns the Unicode Normalization Form of a given string.
    .trim()                         // Remove whitespace from both sides of a string
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-');        // Replace multiple - with single -
  }


  function sanitize(str) {
    // transform text elements to html (&nbsp; and so)
    var parser = new DOMParser();
	var doc = parser.parseFromString(str, 'text/html');

	return doc.body.innerHTML;

  }








