var _ = require("lodash");

function init() {
    gapi.client.setApiKey('AIzaSyB9Y-NxEUbkWCJq1Bu7LM2nCGhmHDEyzFE');
    gapi.client.load("youtube", "v3", function(){});
}
window.onload = function() {
    init();
};
let next = '';
let prev = '';
let pages = [];
let imgs = '';
let query;
document.getElementById('next').addEventListener('click', function() {search(next)});
document.getElementById('prev').addEventListener('click', function() {search(prev)});
document.getElementById('search-button').addEventListener('click', function() {search()});

// Search for a specified string.
function search(pageToken) {
    let request;
    let results;
    query = document.getElementById('enterQuery').value;
    if(pageToken != undefined) {
        request = gapi.client.youtube.search.list({
            part: "snippet",
            type: "video",
            q: query,
            order: "rating",
            pageToken: pageToken
       });
    } else {
        request = gapi.client.youtube.search.list({
            part: "snippet",
            type: "video",
            q: query,
            order: "rating"
       });
    }
    
    request.execute(function(response) {
        results = response.result;
        console.log(results);
        if(results.prevPageToken != undefined) {
            prev = results.prevPageToken;
        } else {
            prev = '';
        }
        next = results.nextPageToken;
        imgs = results.items.map(function(item){
            return item.snippet.thumbnails.default.url;
        });
        let tmpl = _.template('<%obj.forEach(function(item){%>\
                        <li class="default"><img src="<%-item%>" alt="" width="100px" height="100px">\
                        </li><%});%>');
        let html = tmpl(imgs);
        document.getElementById('results').innerHTML = html;
    });
}
module.exports = {
    imgs
}

