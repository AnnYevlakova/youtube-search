function init() {
    gapi.client.setApiKey('AIzaSyB9Y-NxEUbkWCJq1Bu7LM2nCGhmHDEyzFE');
    gapi.client.load("youtube", "v3", function(){});
}

let next = '';
let prev = '';
let pages = [];
var query = document.getElementById('enterQuery').value;
document.getElementById('next').addEventListener('click', function() {search(next)});
document.getElementById('prev').addEventListener('click', function() {search(prev)});

// Search for a specified string.
function search(pageToken) {
    let request;
    let results;
    
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
    });
}
